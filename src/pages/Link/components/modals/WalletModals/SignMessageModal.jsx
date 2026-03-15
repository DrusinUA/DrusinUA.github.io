import React from 'react';
import {
    ModalBase,
    ErrorText,
    ModalPrimaryButton,
    BackLink,
    WalletPreview,
} from '../ModalBase';
import { formatAddressShort } from '../../../utils/formatters';
import styles from './WalletModals.module.scss';

export function SignMessageModal({
    address,
    error,
    isLoading,
    onSubmit,
    onBackClick,
    onClose,
}) {
    return (
        <ModalBase
            title="Sign Message"
            subtitle="Verify ownership of your wallet"
            onClose={onClose}
        >
            <div className={styles.signMessageContent}>
                <WalletPreview
                    label="Connected Wallet"
                    address={formatAddressShort(address)}
                />

                <div className={styles.signMessageInfo}>
                    <div className={styles.signMessageIcon}>✍️</div>
                    <p>Sign a message in your wallet to verify you own this address. This is free and does not require any gas.</p>
                </div>
            </div>

            <ErrorText>{error}</ErrorText>

            <ModalPrimaryButton
                type="button"
                disabled={isLoading}
                onClick={onSubmit}
            >
                {isLoading ? 'Signing...' : 'Sign Message'}
            </ModalPrimaryButton>

            <BackLink onClick={onBackClick}>
                Use different wallet
            </BackLink>
        </ModalBase>
    );
}

export default SignMessageModal;
