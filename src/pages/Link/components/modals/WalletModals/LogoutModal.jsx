import React from 'react';
import {
    ModalBase,
    ModalSecondaryButton,
} from '../ModalBase';
import styles from './WalletModals.module.scss';

export function LogoutModal({
    isLoading,
    onLogout,
    onLogoutAll,
    onClose,
}) {
    return (
        <ModalBase
            title="Log Out"
            subtitle="Choose how you want to log out"
            icon="👋"
            onClose={onClose}
        >
            <div className={styles.logoutOptions}>
                <button
                    className={styles.logoutOption}
                    onClick={onLogout}
                    disabled={isLoading}
                >
                    <div className={styles.logoutOptionIcon}>📱</div>
                    <div className={styles.logoutOptionInfo}>
                        <span className={styles.logoutOptionTitle}>This device only</span>
                        <span className={styles.logoutOptionDesc}>Log out from this browser. Other sessions will remain active.</span>
                    </div>
                </button>

                <button
                    className={styles.logoutOption}
                    onClick={onLogoutAll}
                    disabled={isLoading}
                >
                    <div className={styles.logoutOptionIcon}>🌐</div>
                    <div className={styles.logoutOptionInfo}>
                        <span className={styles.logoutOptionTitle}>All devices</span>
                        <span className={styles.logoutOptionDesc}>Log out from all devices and sessions. You'll need to sign in again everywhere.</span>
                    </div>
                </button>
            </div>

            <ModalSecondaryButton onClick={onClose}>
                Cancel
            </ModalSecondaryButton>
        </ModalBase>
    );
}

export default LogoutModal;
