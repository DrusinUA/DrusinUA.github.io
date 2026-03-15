import React from 'react';
import styles from './ModalBase.module.scss';

/**
 * Base modal component with overlay, container, title and subtitle
 */
export function ModalBase({
    children,
    onClose,
    title,
    subtitle,
    icon,
    className = ''
}) {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={`${styles.modalContainer} ${className}`} onClick={e => e.stopPropagation()}>
                {icon && <div className={styles.modalIconLarge}>{icon}</div>}
                {title && <h2 className={styles.modalTitle}>{title}</h2>}
                {subtitle && <p className={styles.modalSubtitle}>{subtitle}</p>}
                {children}
            </div>
        </div>
    );
}

/**
 * Modal form wrapper
 */
export function ModalForm({ children, onSubmit, className = '' }) {
    return (
        <form className={`${styles.modalForm} ${className}`} onSubmit={onSubmit}>
            {children}
        </form>
    );
}

/**
 * Input group with label
 */
export function InputGroup({ label, hint, children }) {
    return (
        <div className={styles.inputGroup}>
            {label && <label className={styles.inputLabel}>{label}</label>}
            {children}
            {hint && <span className={styles.inputHint}>{hint}</span>}
        </div>
    );
}

/**
 * Input wrapper with optional icon button
 */
export function InputWrapper({ children, hasError = false }) {
    return (
        <div className={`${styles.inputWrapper} ${hasError ? styles.hasError : ''}`}>
            {children}
        </div>
    );
}

/**
 * Styled input
 */
export function Input({ className = '', ...props }) {
    return <input className={`${styles.input} ${className}`} {...props} />;
}

/**
 * Icon button inside input
 */
export function InputIconButton({ children, onClick }) {
    return (
        <button type="button" className={styles.inputIcon} onClick={onClick}>
            {children}
        </button>
    );
}

/**
 * Error text display
 */
export function ErrorText({ children }) {
    if (!children) return null;
    return <p className={styles.errorText}>{children}</p>;
}

/**
 * Primary modal button
 */
export function ModalPrimaryButton({ children, disabled, type = 'submit', onClick }) {
    return (
        <button type={type} className={styles.modalPrimaryButton} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
}

/**
 * Secondary modal button
 */
export function ModalSecondaryButton({ children, onClick, type = 'button' }) {
    return (
        <button type={type} className={styles.modalSecondaryButton} onClick={onClick}>
            {children}
        </button>
    );
}

/**
 * Danger button for destructive actions
 */
export function DangerButton({ children, onClick, disabled, type = 'button' }) {
    return (
        <button type={type} className={styles.dangerButton} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}

/**
 * Back/link button
 */
export function BackLink({ children, onClick }) {
    return (
        <button type="button" className={styles.backLink} onClick={onClick}>
            {children}
        </button>
    );
}

/**
 * Forgot password link
 */
export function ForgotLink({ children, onClick }) {
    return (
        <button type="button" className={styles.forgotLink} onClick={onClick}>
            {children}
        </button>
    );
}

/**
 * Modal divider with text
 */
export function ModalDivider({ text = 'or' }) {
    return (
        <div className={styles.modalDivider}>
            <span>{text}</span>
        </div>
    );
}

/**
 * Modal actions container
 */
export function ModalActions({ children }) {
    return <div className={styles.modalActions}>{children}</div>;
}

/**
 * Warning note box
 */
export function WarningNote({ children }) {
    return <div className={styles.warningNote}>{children}</div>;
}

/**
 * Wallet preview box
 */
export function WalletPreview({ label, address }) {
    return (
        <div className={styles.walletPreview}>
            <div className={styles.walletPreviewLabel}>{label}</div>
            <div className={styles.walletPreviewAddress}>
                <code>{address}</code>
            </div>
        </div>
    );
}

export default ModalBase;
