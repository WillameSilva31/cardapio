import { useDadosUsuarioMutate } from "../../hooks/useDadosUsuarioMutate"
import { DadoUsuario } from "../../interface/DadoUsuario"
import "./register.css"
import { useEffect, useState } from "react"
import { PasswordInputProps } from "../../interface/PasswordInputProps";
import { InputProps } from "../../interface/InputProps";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { RegisterProps } from "../../interface/RegisterProps";


const Input = ({label, value, updateValue, type, error}: InputProps) =>{
    return(
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

export function Registro({closeModal, onRegisterSuccess}: Readonly<RegisterProps>) {
    const[nome, setNome] = useState("");
    const[email, setEmail] = useState("");
    const[senha, setSenha] = useState("");
    const[eCozinheiro, setECozinheiro] = useState(false);
    const[nomeError, setNomeError] = useState("");
    const[emailError, setEmailError] = useState("");
    const[senhaError, setSenhaError] = useState("");
    const {mutate, isSuccess} = useDadosUsuarioMutate();

    const validateName = (name: string) => {
        if (!name.trim()) {
            setNomeError("Nome é obrigatório");
            return false;
        }
        if (name.trim().length < 2) {
            setNomeError("Nome deve ter pelo menos 2 caracteres");
            return false;
        }
        setNomeError("");
        return true;
    };


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
        if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
            setSenhaError("Senha deve ter ao menos 1 letra maiúscula e 1 minúscula");
            return false;
        }
        setSenhaError("");
        return true;
    };

    const handleNameChange = (value: string) => {
        setNome(value);
        if (value.trim()) {
            validateName(value);
        } else {
            setNomeError("");
        }
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

    const submit = () => {
        const isNameValid = validateName(nome);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(senha);

        if (!isNameValid || !isEmailValid || !isPasswordValid) {
            return;
        }

        const dadoUsuario: DadoUsuario = {
            nome,
            email,
            senha,
            e_cozinheiro: eCozinheiro
        }

        mutate(dadoUsuario)
    }

    useEffect(()=> {
        if(isSuccess){
            closeModal();
            alert("Cadastro realizado!");
            onRegisterSuccess();
        }
    },[isSuccess])

    return(
        <div className="registro-overflow">
            <div className="registro-body">
                <div className="registro-header">
                    <h2>Registro</h2>
                    <div className="botaoFechar" onClick={closeModal}> X </div>
                </div>
                <form className="input-container">
                    <Input 
                        type="text" 
                        label="Nome" 
                        value={nome} 
                        updateValue={handleNameChange}
                        error={nomeError}
                    />
                    <Input 
                        type="email" 
                        label="Email" 
                        value={email} 
                        updateValue={handleEmailChange}
                        error={emailError}
                    />
                    <PasswordInput 
                        label="Senha" 
                        value={senha} 
                        updateValue={handlePasswordChange}
                        error={senhaError}
                    />
                    <div className="checkbox-group">
                        <label htmlFor="checkbox">Deseja adicionar pratos ao cardápio?</label>
                        <input id="checkbox"
                            type="checkbox"
                            checked={eCozinheiro}
                            onChange={e => setECozinheiro(e.target.checked)}
                        />
                    </div>
                </form>
                <button className="botaoEnviar" onClick={submit}> Cadastrar </button>
            </div>
        </div>
    )
}