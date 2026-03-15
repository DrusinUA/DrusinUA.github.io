import React, { useState } from 'react';
import {
    ModalBase,
    ModalForm,
    InputGroup,
    InputWrapper,
    Input,
    ErrorText,
    ModalPrimaryButton,
    ModalSecondaryButton,
    WalletPreview,
} from '../ModalBase';
import { formatAddressShort } from '../../../utils/formatters';
import { WALLET_LIMITS } from '../../../constants/modal.constants';

export function SetLabelModal({
    wallet,
    initialLabel = '',
    error,
    isLoading,
    onSubmit,
    onClose,
}) {
    const [label, setLabel] = useState(initialLabel);
    const maxLength = WALLET_LIMITS.LABEL_MAX_LENGTH;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (label.trim()) {
            onSubmit(label);
        }
    };

    const handleLabelChange = (e) => {
        const value = e.target.value.slice(0, maxLength);
        setLabel(value);
    };

    return (
        <ModalBase
            title="Edit Wallet Label"
            subtitle="Give your wallet a custom name"
            onClose={onClose}
        >
            {wallet && (
                <WalletPreview
                    label="Wallet Address"
                    address={formatAddressShort(wallet.address)}
                />
            )}

            <ModalForm onSubmit={handleSubmit}>
                <InputGroup
                    label={`Label (max ${maxLength} characters)`}
                    hint={`${label.length}/${maxLength}`}
                >
                    <InputWrapper>
                        <Input
                            type="text"
                            placeholder="e.g. My Main Wallet"
                            value={label}
                            onChange={handleLabelChange}
                            maxLength={maxLength}
                            disabled={isLoading}
                        />
                    </InputWrapper>
                </InputGroup>

                <ErrorText>{error}</ErrorText>

                <ModalPrimaryButton disabled={isLoading || !label.trim()}>
                    {isLoading ? 'Saving...' : 'Save Label'}
                </ModalPrimaryButton>
            </ModalForm>

            <ModalSecondaryButton onClick={onClose}>
                Cancel
            </ModalSecondaryButton>
        </ModalBase>
    );
}

export default SetLabelModal;
