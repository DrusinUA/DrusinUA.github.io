import React from 'react';
import CraftRing from '@assets/images/CraftRing.gif';

export const TransactionModal = ({ isOpen, onClose, txHash, step, totalSteps }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="transaction-container">
                {step && totalSteps && (
                    <div className="transaction-step-badge">
                        Step {step} of {totalSteps}
                    </div>
                )}
                <h1 className="title">
                    {!txHash && 'Sign transaction'}
                    {txHash && 'Transaction sent'}
                </h1>

                <div className="image-container">
                    <img src={CraftRing} alt="Craft Ring" className="craft-ring" />
                </div>
                <p className="supporting-text" style={{ textAlign: "center" }}>
                    {!txHash && 'Please sign transaction in your wallet'}
                    {txHash && 'Transaction sent successfully'}
                </p>
                <button onClick={onClose} className="close-button">
                    <span className="button-label">Close</span>
                </button>
            </div>
        </div>
    );
};
