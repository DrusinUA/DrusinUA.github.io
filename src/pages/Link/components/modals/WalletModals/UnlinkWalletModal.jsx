import React from 'react';
import {
    ModalBase,
    ErrorText,
    DangerButton,
    ModalSecondaryButton,
    WarningNote,
    WalletPreview,
} from '../ModalBase';
import { formatAddressShort } from '../../../utils/formatters';

export function UnlinkWalletModal({
    wallet,
    error,
    isLoading,
    onSubmit,
    onClose,
}) {
    const isPrimary = wallet?.isPrimary;

    return (
        <ModalBase
            title="Unlink Wallet"
            subtitle="Are you sure you want to unlink this wallet?"
            icon="⚠️"
            onClose={onClose}
        >
            {wallet && (
                <WalletPreview
                    label={isPrimary ? 'Primary Wallet' : 'Wallet to Unlink'}
                    address={formatAddressShort(wallet.address)}
                />
            )}

            {isPrimary && (
                <WarningNote>
                    <strong>Warning:</strong> This is your primary wallet. You will need to set another wallet as primary after unlinking.
                </WarningNote>
            )}

            <ErrorText>{error}</ErrorText>

            <DangerButton
                onClick={onSubmit}
                disabled={isLoading}
            >
                {isLoading ? 'Unlinking...' : 'Unlink Wallet'}
            </DangerButton>
            <ModalSecondaryButton onClick={onClose}>
                Cancel
            </ModalSecondaryButton>
        </ModalBase>
    );
}

export default UnlinkWalletModal;
