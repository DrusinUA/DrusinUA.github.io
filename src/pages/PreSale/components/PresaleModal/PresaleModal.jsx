import React, {useEffect, useState} from 'react';
import presaleModalBack from '../../assets/presale/presaleModalBack.png';
// import TierTable from "../TierTable/TierTable.jsx";
import {ButtonConnectWallet} from "@shared/components/web3/ConnectButton/ConnectButton.jsx";
import {useAccount} from "wagmi";
import {ETHEREUM_CHAIN_ID, PRESALE_CONTRACT, RONIN_CHAIN_ID, USDC} from "@shared/lib/constants/constants.js";
import {useTokenBalanceOf} from "@shared/hooks/web3/useTokenBalance.js";
import {useTokenApprove} from "@shared/hooks/web3/useTokenApprove.js";
import {TransactionModal} from "@shared/components/ui/TransactionModal/TransactionModal.jsx";
import {useFactoryBuy} from "../../hooks/useFactoryBuy.js";
import {useFactoryBalance} from "../../hooks/useFactoryBalance.js";
import {useTotalFactoriesMinted} from "../../hooks/useTotalFactoriesMinted.js";
import infoImg from "../../assets/presale/info.png"


const TOKEN_NAME = {
    [RONIN_CHAIN_ID]: 'USDC',
    [ETHEREUM_CHAIN_ID]: 'USDT',
}


export const PreSaleModal = ({isOpen, onClose}) => {
    const {isConnected} = useAccount()
    const price = 40;

    const [activeNetwork, setActiveNetwork] = useState(RONIN_CHAIN_ID);

    const [quantity, setQuantity] = useState('1');
    const [referralCode, setReferralCode] = useState('');
    const [showTierTable, setShowTierTable] = useState(false);

    const {totalBalance: factoryBalances} = useFactoryBalance()
    const {totals, totalSum} = useTotalFactoriesMinted()

    const {
        balanceFormatted,
        isLoading,
        error,
    } = useTokenBalanceOf(activeNetwork, USDC[activeNetwork]);

    const {
        allowanceFormatted,
        handleApprove,
        isApproving,
        isLoadingAllowance,
        txHash: approveTxHash,
        txError,
        refetchAllowance,
    } = useTokenApprove({
        chainId: activeNetwork,
        tokenAddress: USDC[activeNetwork],
        spenderAddress: PRESALE_CONTRACT[activeNetwork],
    });

    const {
        buy: handleBuy,
        isLoading: isLoadingBuy,
        txHash: buyTxHash,
        error: buyError,
    } = useFactoryBuy({
        chainId: activeNetwork,
        tokenAddress: PRESALE_CONTRACT[activeNetwork],
    })

    const [isEnoughBalance, setIsEnoughBalance] = useState(false);
    const isEnoughApprove = allowanceFormatted !== null && allowanceFormatted >= quantity * price.toFixed(0);
    const notEmpty = parseInt(quantity) > 0;

    const isEnoughFactoryBalance = factoryBalances !== null && factoryBalances <= 27;
    const isSaleOver = totalSum !== null && totalSum >= 2160;

    const maxAvailableBuy = 27 - parseInt(factoryBalances.toString());

    useEffect(() => {
        if (balanceFormatted === null) {
            return;
        }
        if (quantity * price.toFixed(0) > balanceFormatted) {
            setIsEnoughBalance(false);
        } else {
            setIsEnoughBalance(true);
        }
    }, [activeNetwork, balanceFormatted, quantity]);

    /* ───────────────── base styles ───────────────── */
    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
    };

    const contentStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '988px',
        height: "701px",
        borderRadius: '12px',
        padding: '20px',
        position: 'relative',
        overflow: 'visible',
        background:
            'linear-gradient(89.86deg, rgba(46,37,81,1) 0.1%, rgba(46,37,81,1) 99.86%)',
    };

    /* ───────────────── network button styles ───────────────── */
    const buttonContainerStyle = {
        display: 'flex',
        gap: 0,                 // buttons touch without gap
        width: '890px',
        height: '56px',
        margin: '0 18px 30px',  // center of modal
    };

    const baseNetworkButtonStyle = {
        flex: 1,
        height: '100%',
        border: '1px solid #844acb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Work Sans, sans-serif',
        fontSize: '16px',
        fontWeight: 600,
        color: '#f9fefd',
        cursor: 'pointer',
        transition: 'opacity 0.2s ease',
    };

    const getNetworkStyle = (network) => {
        const isLeft = network === RONIN_CHAIN_ID;
        const isActive = network === activeNetwork;

        return {
            ...baseNetworkButtonStyle,
            backgroundColor: isActive ? '#844ACB' : '#4A357A',

            /* borders only on outer edges (none between buttons) */
            borderTop: '1px solid #844acb',
            borderBottom: '1px solid #844acb',
            borderLeft: isLeft ? '1px solid #844acb' : 'none',
            borderRight: isLeft ? 'none' : '1px solid #844acb',

            /* rounding only on outer corners */
            borderTopLeftRadius: isLeft ? '4px' : 0,
            borderBottomLeftRadius: isLeft ? '4px' : 0,
            borderTopRightRadius: !isLeft ? '4px' : 0,
            borderBottomRightRadius: !isLeft ? '4px' : 0,
        };
    };

    /* ───────────────── remaining styles (unchanged) ───────────────── */
    const titleStyle = {
        fontSize: '36px',
        fontFamily: 'Work Sans, sans-serif',
        fontWeight: 700,
        letterSpacing: '-1px',
        lineHeight: '130%',
        background:
            'linear-gradient(90deg, rgba(255,236,109,1) 11.82%, rgba(255,180,50,1) 90.23%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginTop: "12px",
        marginBottom: '6px',
        textAlign: 'left',
        marginLeft: "16px",
    };

    const mainContentStyle = {
        display: 'flex',
        width: '100%',
        padding: '0 20px',
        gap: '40px',
        marginBottom: '30px',
    };

    const leftColumnStyle = {
        flex: 1,
        color: '#F9FEFD',
        fontFamily: 'Work Sans, sans-serif',
    };

    const rightColumnStyle = {
        flex: 1,
        padding: '0 20px 20px',   // top = 0, keep sides and bottom
    };

    const infoGroupStyle = {marginBottom: '28px'};
    const labelStyle = {
        fontSize: '18px',
        fontWeight: 700,
        marginBottom: '12px',
        lineHeight: '24px'
    };
    const valueStyle = {fontSize: '16px', fontWeight: 400, lineHeight: '24px'};

    const inputContainerStyle = {
        marginBottom: '24px', width: '100%',
        maxWidth: "427px",
    };

    const inputWrapperStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '41px',
        padding: '0 12px',
        background: '#3F2E66',
        border: '1px solid #844ACB',
        borderRadius: '4px',
        width: '100%',
        maxWidth: "427px",
    };

    const inputStyle = {
        background: 'transparent',
        border: 'none',
        color: '#F9FEFD',
        fontFamily: 'Work Sans',
        fontSize: '18px',
        fontWeight: 400,
        width: '100%',
        maxWidth: "427px",
        outline: 'none',
    };

    const actionButtonsStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '24px',
        width: '100%',
    };


    useEffect(() => {
        setReferralCode(localStorage.getItem("ref"));
        setInterval(() => {
            setReferralCode(localStorage.getItem("ref"));
        }, 5000);
    });

    const handleQuantityChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value === '') {
            setQuantity('');
            return;
        }

        const num = Math.max(1, Math.min(maxAvailableBuy, Number(value)));
        setQuantity(num.toString());
    };


    useEffect(() => {
        handleQuantityChange({ target: { value: quantity } });
    }, [maxAvailableBuy]);
    const baseButtonStyle = {
        width: '180px',
        height: '50px',
        borderRadius: '4px',
        border: 'none',
        color: '#f9fefd',
        fontFamily: 'Work Sans',
        fontSize: '16px',
        fontWeight: 600,
        cursor: 'pointer',
    };

    const [isModalApproveTxOpen, setIsModalApproveTxOpen] = useState(false);
    const openApproveTxModal = () => setIsModalApproveTxOpen(true);
    const closeApproveTxModal = () => setIsModalApproveTxOpen(false);


    const [isModalBuyTxOpen, setIsModalBuyTxOpen] = useState(false);
    const openBuyTxModal = () => setIsModalBuyTxOpen(true);
    const closeBuyTxModal = () => setIsModalBuyTxOpen(false);

    const renderActionButton = () => {
        if (!isConnected) {
            return <ButtonConnectWallet/>;
        }

        if (!notEmpty) {
            return (
                <button disabled style={{...baseButtonStyle, backgroundColor: 'rgba(74,56,143,0.8)'}}>
                    Please enter quantity
                </button>
            );
        }

        if (!isEnoughBalance) {
            return (
                <button disabled style={{...baseButtonStyle, backgroundColor: 'rgba(74,56,143,0.8)'}}>
                    Not Enough Balance
                </button>
            );
        }

        if (!isEnoughApprove) {
            return (
                <button
                    onClick={() => {
                        handleApprove(27 * price.toFixed(0));
                        openApproveTxModal();
                    }}
                    style={{...baseButtonStyle, backgroundColor: '#844ACB'}}
                >
                    Approve {TOKEN_NAME[activeNetwork]}
                </button>
            );
        }

        if (!isEnoughFactoryBalance) {
            return (
                <button disabled style={{...baseButtonStyle, backgroundColor: 'rgba(74,56,143,0.8)'}}>
                    All Factory Units Bought
                </button>
            );

        }

        if(isSaleOver){
            return (
                <button disabled style={{...baseButtonStyle, backgroundColor: 'rgba(74,56,143,0.8)'}}>
                    Sale is over
                </button>
            );
        }

        return (
            <button
                style={{...baseButtonStyle, backgroundColor: '#844ACB'}}
                onClick={() => {
                    handleBuy({amount: quantity, refCode: referralCode});
                    openBuyTxModal();
                }}
            >
                Buy
            </button>
        );
    };


    if (!isOpen) return null;

    return (
        <>
            <TransactionModal isOpen={isModalApproveTxOpen} onClose={closeApproveTxModal} txHash={approveTxHash}/>
            <TransactionModal isOpen={isModalBuyTxOpen} onClose={closeBuyTxModal} txHash={buyTxHash}/>
            <div
                style={modalStyle}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}>
                <div style={contentStyle}>
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${presaleModalBack})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            zIndex: 0,
                        }}
                    />
                    <div style={{position: 'relative', zIndex: 1, width: '100%'}}>
                        <h1 style={titleStyle}>Buy Your Factory</h1>

                        <div style={buttonContainerStyle}>
                            <button
                                style={getNetworkStyle(RONIN_CHAIN_ID)}
                                onClick={() => setActiveNetwork(RONIN_CHAIN_ID)}
                            >
                                Buy on Ronin
                            </button>
                            <button
                                style={getNetworkStyle(ETHEREUM_CHAIN_ID)}
                                onClick={() => setActiveNetwork(ETHEREUM_CHAIN_ID)}
                            >
                                Buy on Ethereum
                            </button>
                        </div>


                        <div style={mainContentStyle}>
                            <div style={leftColumnStyle}>
                                <div style={infoGroupStyle}>
                                    <div style={labelStyle}>Price per NFT:</div>
                                    <div style={valueStyle}>${price} {TOKEN_NAME[activeNetwork]} (Pre-Sale Price)</div>
                                </div>
                                <div style={infoGroupStyle}>
                                    <div style={labelStyle}>Bonus:</div>
                                    <div style={valueStyle}>
                                        Buy 27 to unlock exclusive "Factory Unit" cosmetic skin NFT.
                                    </div>
                                </div>
                                <div style={infoGroupStyle}>
                                    <div style={labelStyle}>Referral Bonus:</div>
                                    <div style={valueStyle}>Earn +100 WYRM per Factory purchased.</div>
                                </div>
                                <div style={infoGroupStyle}>
                                    <div                 // anchor container
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            position: 'relative',    // needed for absolute tooltip
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <img
                                            src={infoImg}
                                            onMouseEnter={() => setShowTierTable(true)}
                                            onMouseLeave={() => setShowTierTable(false)}
                                            alt="info"
                                            style={{width: '26px', height: '26px', marginBottom: "10px"}}
                                        />

                                        <span style={labelStyle}>Merge Info:</span>

                                        {showTierTable && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '36px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                }}
                                            >
                                                {/*<TierTable/>*/}
                                            </div>
                                        )}
                                    </div>
                                    <div style={valueStyle}>
                                        Each merge grants +15% staking power — reaching up to +74% at Tier 5 for maximum
                                        efficiency and rewards.
                                        <br/>
                                        <br/>
                                        Hover on&nbsp;"i" to view merging chart and staking power boosts.
                                    </div>
                                </div>
                            </div>

                            <div style={rightColumnStyle}>
                                <div style={inputContainerStyle}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <span style={labelStyle}>Enter Quantity</span>

                                        <span style={{color: '#9589C0', marginTop: "4px"}}>{maxAvailableBuy} max</span>
                                    </div>
                                    <div style={inputWrapperStyle}>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            style={inputStyle}
                                        />
                                        <button
                                            onClick={() => setQuantity(maxAvailableBuy.toString())}
                                            style={{
                                                color: '#F6FBFA',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Max
                                        </button>
                                    </div>
                                </div>

                                <div style={inputContainerStyle}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <div style={labelStyle}>Total</div>

                                        <span style={{color: '#9589C0', marginTop: "4px"}}>Your balance: {balanceFormatted}</span>
                                    </div>
                                    <div style={{...inputWrapperStyle, border: '1px solid #FECE4F'}}>
                                        <span
                                            style={{color: '#F9FEFD'}}>{quantity * price.toFixed(0)} {TOKEN_NAME[activeNetwork]}</span>
                                    </div>
                                </div>

                                <div style={inputContainerStyle}>
                                    <div style={labelStyle}>Referral Code</div>
                                    <div style={inputWrapperStyle}>
                                        <input
                                            type="text"
                                            value={referralCode}
                                            placeholder="Please use ref link to get bonus"
                                            style={inputStyle}
                                            disabled={true}
                                        />
                                    </div>
                                </div>

                                <div style={actionButtonsStyle}>
                                    {renderActionButton()}
                                    <div
                                        style={{
                                            width: '180px',
                                            height: '50px',
                                            backgroundColor: 'rgba(46, 37, 81, 0.8)',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#9589c0',
                                            fontFamily: 'Work Sans',
                                            fontSize: '18px',
                                        }}
                                    >
                                        {totalSum}/2160 bought
                                    </div>
                                </div>
                                <div style={{
                                    marginTop: "20px",
                                    color: "#56F721",
                                    fontFamily: "Work Sans",
                                    fontSize: "20px",
                                    fontWeight: 400,
                                }}>You have bought total {factoryBalances} Factories
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
