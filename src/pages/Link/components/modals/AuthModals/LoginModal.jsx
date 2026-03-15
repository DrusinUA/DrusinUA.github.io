import React from 'react';
import {
    ModalBase,
    ModalForm,
    InputGroup,
    InputWrapper,
    Input,
    InputIconButton,
    ErrorText,
    ModalPrimaryButton,
} from '../ModalBase';
import { EyeIcon } from '../../EyeIcon';

export function LoginModal({
    email,
    password,
    showPassword,
    error,
    isLoading,
    onEmailChange,
    onPasswordChange,
    onShowPasswordToggle,
    onSubmit,
    onClose,
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <ModalBase
            title="Sign In"
            subtitle="Enter your credentials to access your account"
            onClose={onClose}
        >
            <ModalForm onSubmit={handleSubmit}>
                <InputGroup label="Email">
                    <InputWrapper>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => onEmailChange(e.target.value)}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                    </InputWrapper>
                </InputGroup>

                <InputGroup label="Password">
                    <InputWrapper>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => onPasswordChange(e.target.value)}
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                        <InputIconButton onClick={onShowPasswordToggle}>
                            <EyeIcon visible={showPassword} />
                        </InputIconButton>
                    </InputWrapper>
                </InputGroup>

                <ErrorText>{error}</ErrorText>

                <ModalPrimaryButton disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </ModalPrimaryButton>
            </ModalForm>
        </ModalBase>
    );
}

export default LoginModal;
