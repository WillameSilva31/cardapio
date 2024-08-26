import { useDadosUsuarioLoginMutate } from "../../hooks/useDadosLogin"
import { DadoUsuarioLogin } from "../../interface/DadoUsuarioLogin"
import "./login.css"
import { useEffect, useState } from "react"

interface InputProps {
    label: string,
    value: string | number,
    updateValue (value: any): void
}

interface LoginProps {
    closeModal() : void
    onLoginSuccess(): void
}

const Input = ({label, value, updateValue}: InputProps) =>{
    return(
        <>
        <label>{label}</label>
        <input value = {value} onChange = {e => updateValue(e.target.value)}></input>
        </>
    )
}


export function Login({closeModal, onLoginSuccess}: LoginProps){
    const[email, setEmail] = useState("");
    const[senha, setSenha] = useState("");
    const [cozinheiroId] = useState(localStorage.getItem('cozinheiroId')as string)
    const [token] = useState(localStorage.getItem('token')as string)
    const { mutate, isSuccess} = useDadosUsuarioLoginMutate();


    const submit = async () => {
        if (!email || !senha) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const dadoUsuarioLogin: DadoUsuarioLogin = {
            email,
            senha,
            cozinheiroId,
            token
        }

        mutate(dadoUsuarioLogin)
    }    

    useEffect(()=> {
        if(isSuccess){
            closeModal()
            onLoginSuccess();
        }
    },[isSuccess])

    return(
        <div className="login-overflow">
            <div className="login-body">
                <div className="login-header">
                <h2>Login</h2>
                <div className="botaoFechar" onClick={closeModal}> X </div>
                </div>
                <form className="input-container" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    <Input label="email" value={email} updateValue={setEmail}/>
                    <Input label="senha" value={senha} updateValue={setSenha}/>
                </form>
                <button  className="botaoEnviar" onClick={submit}> Enviar </button>
            </div>
        </div>
    )
}