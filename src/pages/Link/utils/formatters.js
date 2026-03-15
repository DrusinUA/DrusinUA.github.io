/**
 * Format email with optional masking
 * @param {string} email - Email address
 * @param {boolean} isVisible - Whether to show full email
 * @returns {string} Formatted email
 */
export const formatEmail = (email, isVisible = false) => {
    if (!email) return "";
    if (isVisible) return email;

    const [localPart, domain] = email.split('@');
    if (!domain) return email;

    return `${localPart.charAt(0)}${'*'.repeat(6)}@${domain}`;
};

/**
 * Format wallet address with optional masking
 * @param {string} address - Wallet address
 * @param {boolean} isVisible - Whether to show full address
 * @returns {string} Formatted address
 */
export const formatAddress = (address, isVisible = false) => {
    if (!address) return "";
    if (isVisible) return address;

    return `${address.slice(0, 6)}${'*'.repeat(6)}${address.slice(-4)}`;
};

/**
 * Format address short version (for modals)
 * @param {string} address - Wallet address
 * @returns {string} Short address like "0x1234...5678"
 */
export const formatAddressShort = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
