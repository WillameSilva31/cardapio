import { useDadosUsuarioLoginMutate } from "../../hooks/useDadosLogin"
import { DadoUsuarioLogin } from "../../interface/DadoUsuarioLogin"
import "./login.css"
import { useEffect, useState } from "react"
import {LuEye, LuEyeClosed } from "react-icons/lu";
import { PasswordInputProps } from "../../interface/PasswordInputProps";
import { InputProps } from "../../interface/InputProps";
import { LoginProps } from "../../interface/LoginProps";


const Input = ({ label, value, updateValue, type = "text", error }: InputProps) => {
    return (
        <div className="input-field">
            <label>{label}</label>
            <input 
                type={type}
                value={value} 
                onChange={e => updateValue(e.target.value)}
                className={error ? "input-error" : ""}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    )
}

const PasswordInput = ({ label, value, updateValue, error }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="input-field">
            <label>{label}</label>
            <div className="password-container">
                <input 
                    type={showPassword ? "text" : "password"}
                    value={value} 
                    onChange={e => updateValue(e.target.value)}
                    className={error ? "input-error" : ""}
                />
                <button 
                    type="button"
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                >
                    {showPassword ? <LuEye color="#3a44f8"/> : <LuEyeClosed color="#3a44f8"/>}
                </button>
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    )
}

export function Login({ closeModal, onLoginSuccess }: Readonly<LoginProps>) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [emailError, setEmailError] = useState("");
    const [senhaError, setSenhaError] = useState("");
    const { mutate, isSuccess } = useDadosUsuarioLoginMutate();


    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("Email é obrigatório");
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError("Digite um email válido");
            return false;
        }
        setEmailError("");
        return true;
    };


    const validatePassword = (password: string) => {
        if (!password) {
            setSenhaError("Senha é obrigatória");
            return false;
        }
        if (password.length < 6) {
            setSenhaError("Senha deve ter pelo menos 6 caracteres");
            return false;
        }
        setSenhaError("");
        return true;
    };


    const handleEmailChange = (value: string) => {
        setEmail(value.toLowerCase());
        if (value.trim()) {
            validateEmail(value);
        } else {
            setEmailError("");
        }
    };

    const handlePasswordChange = (value: string) => {
        setSenha(value);
        if (value.trim()) {
            validatePassword(value);
        } else {
            setSenhaError("");
        }
    };

    const submit = async () => {
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(senha);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        const dadoUsuarioLogin: DadoUsuarioLogin = {
            email,
            senha,
        }

        mutate(dadoUsuarioLogin)
    }

    useEffect(() => {
        if (isSuccess) {
            closeModal()
            onLoginSuccess();
        }
    }, [isSuccess])

    return (
        <div className="login-overflow">
            <div className="login-body">
                <div className="login-header">
                    <h2>Login</h2>
                    <div className="botaoFechar" onClick={closeModal}> X </div>
                </div>
                <form className="input-container" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    <Input 
                        label="Email" 
                        value={email} 
                        updateValue={handleEmailChange}
                        type="email"
                        error={emailError}
                    />
                    <PasswordInput 
                        label="Senha" 
                        value={senha} 
                        updateValue={handlePasswordChange}
                        error={senhaError}
                    />
                </form>
                <button className="botaoEnviar" onClick={submit}> Entrar </button>
            </div>
        </div>
    )
}