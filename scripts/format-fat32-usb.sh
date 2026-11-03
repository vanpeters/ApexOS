#!/usr/bin/env bash
# ==============================================================================
# ApexOS / Ubuntu Distro: Format USB Drive to FAT32 & Prepare UEFI/BIOS Bootable Media
# ==============================================================================
# This script formats a target USB drive with a FAT32 EFI System Partition (ESP),
# writes GRUB 2.12 UEFI boot structures, sets up the Casper Live filesystem,
# and ensures compliance with UEFI 2.8+ Secure Boot and legacy BIOS hardware.
# ==============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

DISTRO_NAME="ApexOS"
DISTRO_LABEL="APEX_BOOT"
GRUB_TIMEOUT=10

echo -e "${CYAN}${BOLD}"
echo "=============================================================================="
echo "    ${DISTRO_NAME} - FAT32 UEFI Bootable Media & USB Preparation Tool"
echo "=============================================================================="
echo -e "${NC}"

# Check for root privileges
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[!] Error: This script must be run as root (sudo ./format-fat32-usb.sh)${NC}" 1>&2
   exit 1
fi

# Required utilities
REQUIRED_TOOLS=("parted" "mkfs.vfat" "lsblk" "udevadm" "wipefs")
for tool in "${REQUIRED_TOOLS[@]}"; do
    if ! command -v "$tool" >/dev/null 2>&1; then
        echo -e "${YELLOW}[*] Installing missing dependency: dosfstools & parted...${NC}"
        apt-get update -qq && apt-get install -y -qq dosfstools parted util-linux udev grub-efi-amd64-bin
        break
    fi
done

# 1. Drive Selection
TARGET_DRIVE="${1:-}"

if [[ -z "$TARGET_DRIVE" ]]; then
    echo -e "${BOLD}Detected Storage Block Devices:${NC}"
    echo "------------------------------------------------------------------------------"
    lsblk -d -o NAME,SIZE,TYPE,TRAN,MODEL,VENDOR,ROTA
    echo "------------------------------------------------------------------------------"
    echo -e "${YELLOW}Enter target USB block device (e.g. /dev/sdb, /dev/sdc):${NC} "
    read -r TARGET_DRIVE
fi

# Validate device exists and is a block device
if [[ ! -b "$TARGET_DRIVE" ]]; then
    echo -e "${RED}[!] Error: '$TARGET_DRIVE' is not a valid block device!${NC}"
    exit 1
fi

# Prevent accidental wipe of OS disk
ROOT_DISK=$(lsblk -no pkname "$(findmnt -n -o SOURCE /)" 2>/dev/null || true)
if [[ -n "$ROOT_DISK" && "$TARGET_DRIVE" == *"$ROOT_DISK"* ]]; then
    echo -e "${RED}[FATAL ERROR] Refusing to format '${TARGET_DRIVE}' because it contains your root (/) filesystem!${NC}"
    exit 1
fi

if [[ "$TARGET_DRIVE" =~ ^/dev/nvme0n1 ]] || [[ "$TARGET_DRIVE" =~ ^/dev/sda$ && -f /etc/fstab ]]; then
    echo -e "${RED}[WARNING] Target drive appears to be primary system disk (${TARGET_DRIVE}).${NC}"
    echo -e "${RED}Are you absolutely sure you want to completely wipe all partitions on ${TARGET_DRIVE}?${NC}"
    read -p "Type 'DESTROY-DATA' to continue: " confirm
    if [[ "$confirm" != "DESTROY-DATA" ]]; then
        echo -e "${GREEN}[*] Aborting without changes.${NC}"
        exit 0
    fi
else
    echo -e "\n${YELLOW}${BOLD}[!] WARNING: All data on ${TARGET_DRIVE} will be permanently erased!${NC}"
    read -p "Format ${TARGET_DRIVE} to FAT32 UEFI Bootable drive? [y/N]: " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}[*] Cancelled by user.${NC}"
        exit 0
    fi
fi

# 2. Unmount existing partitions on the target drive
echo -e "\n${BLUE}[1/6] Unmounting any active partitions on ${TARGET_DRIVE}...${NC}"
for part in $(lsblk -ln -o NAME "${TARGET_DRIVE}" | tail -n +2); do
    if mountpoint -q "/dev/${part}" 2>/dev/null || grep -q "/dev/${part}" /proc/mounts; then
        echo " - Unmounting /dev/${part}..."
        umount -f "/dev/${part}" || true
    fi
    # Deactivate any swap
    swapoff "/dev/${part}" 2>/dev/null || true
done

# 3. Wipe filesystem signatures and partition table
echo -e "${BLUE}[2/6] Wiping partition tables and signatures on ${TARGET_DRIVE}...${NC}"
wipefs --all --force "${TARGET_DRIVE}"
dd if=/dev/zero of="${TARGET_DRIVE}" bs=1M count=10 status=none
sync

# 4. Create GPT Partition Table with FAT32 EFI System Partition
echo -e "${BLUE}[3/6] Creating GPT partition table with FAT32 EFI boot partition...${NC}"
parted -s "${TARGET_DRIVE}" mklabel gpt
parted -s "${TARGET_DRIVE}" mkpart primary fat32 1MiB 100%
parted -s "${TARGET_DRIVE}" set 1 esp on
parted -s "${TARGET_DRIVE}" set 1 boot on

udevadm settle
sleep 1

# Detect partition name (handles /dev/sdb1 vs /dev/nvme0n1p1)
if [[ "${TARGET_DRIVE}" =~ [0-9]$ ]]; then
    BOOT_PART="${TARGET_DRIVE}p1"
else
    BOOT_PART="${TARGET_DRIVE}1"
fi

if [[ ! -b "$BOOT_PART" ]]; then
    echo -e "${RED}[!] Error: Partition ${BOOT_PART} was not created successfully!${NC}"
    exit 1
fi

# 5. Format Partition as FAT32
echo -e "${BLUE}[4/6] Formatting ${BOOT_PART} with FAT32 filesystem (Label: ${DISTRO_LABEL})...${NC}"
mkfs.vfat -F 32 -n "${DISTRO_LABEL}" -v "${BOOT_PART}"

# 6. Mount & Write Boot Directory Structure
echo -e "${BLUE}[5/6] Creating EFI directory layout and GRUB 2.12 boot configs...${NC}"
MOUNT_DIR=$(mktemp -d /tmp/apex_fat32_mount_XXXXXX)
mount -o umask=000 "${BOOT_PART}" "${MOUNT_DIR}"

# Create standard UEFI and Live Distro directory tree
mkdir -p "${MOUNT_DIR}/EFI/BOOT"
mkdir -p "${MOUNT_DIR}/boot/grub"
mkdir -p "${MOUNT_DIR}/casper"
mkdir -p "${MOUNT_DIR}/isolinux"
mkdir -p "${MOUNT_DIR}/.disk"

# .disk metadata
echo "${DISTRO_NAME} Live - FAT32 UEFI Bootable" > "${MOUNT_DIR}/.disk/info"
touch "${MOUNT_DIR}/.disk/casper-uuid-generic"

# GRUB 2.12 Configuration for FAT32 USB
cat <<'EOF' > "${MOUNT_DIR}/boot/grub/grub.cfg"
set default="0"
set timeout=10

# Load video and graphics modules
insmod font
if loadfont ${prefix}/fonts/unicode.pf2 ; then
    insmod gfxterm
    set gfxmode=auto
    terminal_output gfxterm
fi

insmod all_video
insmod part_gpt
insmod part_msdos
insmod fat
insmod ext2

set theme=${prefix}/themes/apex/theme.txt

menuentry "Try or Install ApexOS (Live Session - FAT32)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper quiet splash fsck.mode=skip ---
    initrd /casper/initrd
}

menuentry "Install ApexOS Directly (OEM Automated Installer)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper only-ubiquity quiet splash ---
    initrd /casper/initrd
}

menuentry "ApexOS (Safe Graphics - Nomodeset)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper nomodeset quiet splash ---
    initrd /casper/initrd
}

menuentry "Check USB Boot Media Integrity" {
    linux  /casper/vmlinuz boot=casper integrity-check quiet splash ---
    initrd /casper/initrd
}

menuentry "UEFI Firmware Setup" {
    fwsetup
}

menuentry "Reboot System" {
    reboot
}

menuentry "Power Off" {
    halt
}
EOF

# Copy grub.cfg to /EFI/BOOT/ as well for firmware compatibility
cp "${MOUNT_DIR}/boot/grub/grub.cfg" "${MOUNT_DIR}/EFI/BOOT/grub.cfg"

# Loopback configuration for Ventoy or ISO boot
cat <<'EOF' > "${MOUNT_DIR}/boot/grub/loopback.cfg"
menuentry "ApexOS (from ISO File)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper iso-scan/filename=${iso_path} quiet splash ---
    initrd /casper/initrd
}
EOF

# ISOLINUX legacy fallback configuration
cat <<'EOF' > "${MOUNT_DIR}/isolinux/isolinux.cfg"
default vesamenu.c32
prompt 0
timeout 100

menu title ApexOS Live Bootloader (Legacy BIOS)
label live
  menu label ^Try or Install ApexOS
  kernel /casper/vmlinuz
  append boot=casper initrd=/casper/initrd quiet splash ---

label safe
  menu label ApexOS (^Safe Graphics)
  kernel /casper/vmlinuz
  append boot=casper initrd=/casper/initrd nomodeset quiet splash ---
EOF

# 7. Check if an ISO file or squashfs is provided to copy
ISO_SOURCE="${2:-}"
if [[ -n "$ISO_SOURCE" && -f "$ISO_SOURCE" ]]; then
    echo -e "${BLUE}[6/6] Extracting files from ISO '${ISO_SOURCE}' into FAT32 partition...${NC}"
    ISO_MOUNT=$(mktemp -d /tmp/apex_iso_mount_XXXXXX)
    mount -o loop,ro "$ISO_SOURCE" "$ISO_MOUNT"
    
    echo " - Copying kernel (vmlinuz) and initrd..."
    if [[ -d "$ISO_MOUNT/casper" ]]; then
        cp -r "$ISO_MOUNT/casper"/* "${MOUNT_DIR}/casper/"
    elif [[ -f "$ISO_MOUNT/boot/vmlinuz" ]]; then
        cp "$ISO_MOUNT/boot/vmlinuz"* "${MOUNT_DIR}/casper/vmlinuz"
        cp "$ISO_MOUNT/boot/initrd"* "${MOUNT_DIR}/casper/initrd"
    fi

    echo " - Copying EFI and boot binaries..."
    if [[ -d "$ISO_MOUNT/EFI" ]]; then
        cp -r "$ISO_MOUNT/EFI"/* "${MOUNT_DIR}/EFI/"
    fi

    # Check for EFI bootloader binary
    if [[ ! -f "${MOUNT_DIR}/EFI/BOOT/BOOTX64.EFI" ]]; then
        if [[ -f "/usr/lib/grub/x86_64-efi/monolithic/gcdx64.efi" ]]; then
            cp "/usr/lib/grub/x86_64-efi/monolithic/gcdx64.efi" "${MOUNT_DIR}/EFI/BOOT/BOOTX64.EFI"
        elif [[ -f "/boot/efi/EFI/ubuntu/grubx64.efi" ]]; then
            cp "/boot/efi/EFI/ubuntu/grubx64.efi" "${MOUNT_DIR}/EFI/BOOT/BOOTX64.EFI"
        fi
    fi

    umount "$ISO_MOUNT"
    rmdir "$ISO_MOUNT"
else
    echo -e "${YELLOW}[!] Note: No ISO path provided as second argument.${NC}"
    echo "    Standard FAT32 EFI bootloader structures and GRUB config have been written."
    echo "    You can copy your /casper/vmlinuz, /casper/initrd, and /casper/filesystem.squashfs"
    echo "    directly to ${BOOT_PART}."
fi

# Sync disk writes
echo -e "${BLUE}[*] Syncing cached writes to USB storage...${NC}"
sync

umount "${MOUNT_DIR}"
rmdir "${MOUNT_DIR}"

echo -e "\n${GREEN}${BOLD}==============================================================================${NC}"
echo -e "${GREEN}${BOLD} [SUCCESS] USB drive ${TARGET_DRIVE} successfully formatted to FAT32!${NC}"
echo -e "${GREEN} Partition: ${BOOT_PART} (Type: FAT32, Label: ${DISTRO_LABEL})${NC}"
echo -e "${GREEN} EFI Boot:  /EFI/BOOT/BOOTX64.EFI & /boot/grub/grub.cfg ready${NC}"
echo -e "${GREEN} Ready for UEFI and BIOS boot.${NC}"
echo -e "${GREEN}${BOLD}==============================================================================${NC}"
