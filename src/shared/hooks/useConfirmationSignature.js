import { useState, useEffect, useCallback } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import axios from 'axios';
import {SERVER_URL} from "../lib/constants/constants.js";

const useConfirmationSignature = () => {
    const { address: activeAddress } = useAccount();
    const { signTypedDataAsync } = useSignTypedData();
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authData, setAuthData] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    // Check localStorage for existing valid signature
    useEffect(() => {
        const checkStoredSignature = async () => {
            if (!activeAddress) {
                setIsAuthenticated(false);
                setAuthData(null);
                setUserEmail(null);
                return;
            }

            const storageKey = `${activeAddress}`;
            const storedData = localStorage.getItem(storageKey);
            
            if (!storedData) {
                setIsAuthenticated(false);
                setAuthData(null);
                setUserEmail(null);
                return;
            }

            try {
                const parsedData = JSON.parse(storedData);
                const { signature, r, s, v, nonce, expirationDate } = parsedData;
                
                // Check if data is complete and not expired
                if (signature && r && s && v && nonce && expirationDate) {
                    const now = Math.floor(Date.now() / 1000);
                    if (expirationDate > now) {
                        // Verify with server
                        const response = await axios.post(`${SERVER_URL}/wallet/auth`, {
                            address: activeAddress.toLowerCase(),
                            signature,
                            r,
                            s,
                            v,
                            nonce,
                            expirationDate
                        });
                        
                        if (response.status === 200) {
                            setIsAuthenticated(true);
                            setAuthData(parsedData);
                            // Check if user has email registered
                            if (response.data && response.data.email) {
                                setUserEmail(response.data.email);
                            } else {
                                setUserEmail(null);
                            }
                        } else {
                            // Invalid signature, clear localStorage
                            localStorage.removeItem(storageKey);
                            setIsAuthenticated(false);
                            setAuthData(null);
                            setUserEmail(null);
                        }
                    } else {
                        // Expired, clear localStorage
                        localStorage.removeItem(storageKey);
                        setIsAuthenticated(false);
                        setAuthData(null);
                        setUserEmail(null);
                    }
                } else {
                    setIsAuthenticated(false);
                    setAuthData(null);
                    setUserEmail(null);
                }
            } catch (error) {
                console.error('Error checking stored signature:', error);
                setIsAuthenticated(false);
                setAuthData(null);
                setUserEmail(null);
            }
        };

        checkStoredSignature();
    }, [activeAddress]);

    // Handler for signing button
    const handleSign = useCallback(async () => {
        if (!activeAddress) {
            throw new Error('No active address');
        }

        setIsLoading(true);
        
        try {
            // Get signing params from server
            const paramsResponse = await axios.get(`${SERVER_URL}/wallet/signing-params`);
            
            const { nonce, expirationDate } = paramsResponse.data;
            
            // Create EIP-712 domain and types
            const domain = {
                name: "CalamityWebApp",
                version: "1",
                verifyingContract: "0x0000000000000000000000000000000000000000",
            };

            const types = {
                CalamityWebApp: [
                    { name: "nonce", type: "bytes32" },
                    { name: "expirationDate", type: "uint256" }
                ],
            };

            const message = {
                nonce,
                expirationDate
            };

            // Sign the typed data
            const signature = await signTypedDataAsync({
                domain,
                types,
                primaryType: 'CalamityWebApp',
                message,
            });

            // Extract r, s, v from signature
            const r = '0x' + signature.slice(2, 66);
            const s = '0x' + signature.slice(66, 130);
            const v = parseInt(signature.slice(130, 132), 16);

            const signatureData = {
                signature,
                r,
                s,
                v,
                nonce,
                expirationDate
            };

            // Send to server for authentication
            const authResponse = await axios.post(`${SERVER_URL}/wallet/auth`, {
                address: activeAddress.toLowerCase(),
                ...signatureData
            });

            if (authResponse.status === 200) {
                // Store in localStorage
                const storageKey = `${activeAddress}`;
                localStorage.setItem(storageKey, JSON.stringify(signatureData));
                
                setIsAuthenticated(true);
                setAuthData(signatureData);
                // Check if user has email registered
                if (authResponse.data && authResponse.data.email) {
                    setUserEmail(authResponse.data.email);
                } else {
                    setUserEmail(null);
                }
            } else {
                throw new Error('Authentication failed');
            }
        } catch (error) {
            console.error('Error during signing:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [activeAddress, signTypedDataAsync]);

    // Refresh authentication status
    const refreshAuthStatus = useCallback(async () => {
        if (!activeAddress) return;
        
        const storageKey = `${activeAddress}`;
        const storedData = localStorage.getItem(storageKey);
        
        if (!storedData) return;
        
        try {
            const parsedData = JSON.parse(storedData);
            const { signature, r, s, v, nonce, expirationDate } = parsedData;
            
            // Re-check with server to get updated email status
            const response = await axios.post(`${SERVER_URL}/wallet/auth`, {
                address: activeAddress.toLowerCase(),
                signature,
                r,
                s,
                v,
                nonce,
                expirationDate
            });
            
            if (response.status === 200) {
                // Update email if present
                if (response.data && response.data.email) {
                    setUserEmail(response.data.email);
                }
            }
        } catch (error) {
            console.error('Error refreshing auth status:', error);
        }
    }, [activeAddress]);

    // Clear authentication
    const clearAuth = useCallback(() => {
        if (activeAddress) {
            const storageKey = `${activeAddress}`;
            localStorage.removeItem(storageKey);
        }
        setIsAuthenticated(false);
        setAuthData(null);
        setUserEmail(null);
    }, [activeAddress]);

    return {
        isAuthenticated,
        isLoading,
        authData,
        userEmail,
        handleSign,
        clearAuth,
        refreshAuthStatus,
        activeAddress
    };
};

export default useConfirmationSignature;