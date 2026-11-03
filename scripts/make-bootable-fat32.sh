#!/usr/bin/env bash
# ==============================================================================
# ApexOS Distro: High-Level FAT32 Bootable USB Deployment Pipeline
# ==============================================================================
# Orchestrates building/verifying the ISO, preparing the FAT32 UEFI partition,
# installing GRUB 2.12 x86_64-efi binaries, and validating boot structures.
# ==============================================================================

set -euo pipefail

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FORMAT_SCRIPT="${SCRIPT_DIR}/format-fat32-usb.sh"

echo -e "${CYAN}${BOLD}"
echo "=============================================================================="
echo "         ApexOS - Automated FAT32 Bootable Distro Creator"
echo "=============================================================================="
echo -e "${NC}"

if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[!] Error: Run with sudo (sudo ./make-bootable-fat32.sh)${NC}" 1>&2
   exit 1
fi

chmod +x "${FORMAT_SCRIPT}"

# Step 1: Detect available ISO image or prompt to run build-iso.sh
ISO_PATH="${1:-}"

if [[ -z "$ISO_PATH" ]]; then
    POSSIBLE_ISOS=(output/*.iso ./*.iso /tmp/*.iso)
    for iso in "${POSSIBLE_ISOS[@]}"; do
        if [[ -f "$iso" ]]; then
            ISO_PATH="$iso"
            echo -e "${GREEN}[*] Found existing ISO: ${ISO_PATH}${NC}"
            break
        fi
    done
fi

if [[ -z "$ISO_PATH" || ! -f "$ISO_PATH" ]]; then
    echo -e "${YELLOW}[?] No existing ISO image found.${NC}"
    echo "Options:"
    echo "  1) Build fresh ISO now using ./build-iso.sh"
    echo "  2) Specify path to existing ISO manually"
    echo "  3) Format USB to FAT32 EFI boot structure only (empty payload for manual copy)"
    read -p "Select option [1-3]: " opt

    case "$opt" in
        1)
            echo -e "${CYAN}[*] Launching build-iso.sh...${NC}"
            if [[ -f "${SCRIPT_DIR}/../build-iso.sh" ]]; then
                bash "${SCRIPT_DIR}/../build-iso.sh"
            elif [[ -f "./build-iso.sh" ]]; then
                bash "./build-iso.sh"
            else
                echo -e "${RED}[!] build-iso.sh not found in current directory.${NC}"
                exit 1
            fi
            ISO_PATH=$(ls -t output/*.iso ./*.iso 2>/dev/null | head -n 1)
            ;;
        2)
            read -p "Enter full path to ISO file: " ISO_PATH
            if [[ ! -f "$ISO_PATH" ]]; then
                echo -e "${RED}[!] File '$ISO_PATH' does not exist.${NC}"
                exit 1
            fi
            ;;
        3)
            ISO_PATH=""
            ;;
        *)
            echo -e "${RED}[!] Invalid selection.${NC}"
            exit 1
            ;;
    esac
fi

# Step 2: Display target drive selection
echo ""
echo -e "${BOLD}Available Storage Devices:${NC}"
lsblk -d -o NAME,SIZE,TYPE,TRAN,MODEL,VENDOR

read -p "Enter USB device to format to FAT32 (e.g. /dev/sdb): " TARGET_DEV

if [[ -z "$TARGET_DEV" || ! -b "$TARGET_DEV" ]]; then
    echo -e "${RED}[!] Invalid block device: $TARGET_DEV${NC}"
    exit 1
fi

# Step 3: Run the FAT32 formatting and boot installation script
if [[ -n "$ISO_PATH" ]]; then
    echo -e "${CYAN}[*] Invoking FAT32 formatting with ISO payload: ${ISO_PATH}...${NC}"
    "${FORMAT_SCRIPT}" "${TARGET_DEV}" "${ISO_PATH}"
else
    echo -e "${CYAN}[*] Invoking FAT32 EFI structure formatting...${NC}"
    "${FORMAT_SCRIPT}" "${TARGET_DEV}"
fi

echo -e "\n${GREEN}${BOLD}[✓] Process Complete! You can now boot your PC from the FAT32 USB via UEFI or BIOS boot menu (F12/F11/Esc).${NC}"
