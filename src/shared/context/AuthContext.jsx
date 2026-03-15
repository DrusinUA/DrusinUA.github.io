import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

const stubValue = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => { alert('Login disabled in preview'); },
    loginLoading: false,
    loginError: null,
    clearLoginError: () => {},
    logout: async () => {},
    logoutAll: async () => {},
    logoutLoading: false,
    checkAuth: async () => null,
    clearAuth: () => {},
};

export function AuthProvider({ children }) {
    return (
        <AuthContext.Provider value={stubValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    return context || stubValue;
}
