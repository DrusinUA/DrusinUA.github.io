import React from 'react';

export const ShopModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="transaction-container" onClick={e => e.stopPropagation()}>
                <h1 className="title">Shop</h1>
                <p className="supporting-text">Shopping functionality is disabled in preview mode.</p>
                <button onClick={onClose} className="close-button">
                    <span className="button-label">Close</span>
                </button>
            </div>
        </div>
    );
};
