import React from 'react';
import {
    ModalBase,
    ErrorText,
    ModalPrimaryButton,
    ModalSecondaryButton,
    WalletPreview,
} from '../ModalBase';
import { formatAddressShort } from '../../../utils/formatters';

export function SetPrimaryModal({
    wallet,
    error,
    isLoading,
    onSubmit,
    onClose,
}) {
    return (
        <ModalBase
            title="Set as Primary Wallet"
            subtitle="This wallet will be used for all reward distributions"
            icon="👑"
            onClose={onClose}
        >
            {wallet && (
                <WalletPreview
                    label="New Primary Wallet"
                    address={formatAddressShort(wallet.address)}
                />
            )}

            <ErrorText>{error}</ErrorText>

            <ModalPrimaryButton
                type="button"
                disabled={isLoading}
                onClick={onSubmit}
            >
                {isLoading ? 'Setting...' : 'Confirm'}
            </ModalPrimaryButton>
            <ModalSecondaryButton onClick={onClose}>
                Cancel
            </ModalSecondaryButton>
        </ModalBase>
    );
}

export default SetPrimaryModal;
