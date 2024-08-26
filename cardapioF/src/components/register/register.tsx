import { useDadosUsuarioMutate } from "../../hooks/useDadosUsuarioMutate"
import { DadoUsuario } from "../../interface/DadoUsuario"
import "./register.css"
import { useEffect, useState } from "react"

interface InputProps {
    type: string,
    label: string,
    value: string | number,
    updateValue (value: any): void
}

interface LoginProps {
    closeModal() : void
    onRegisterSuccess(): void;
}

const Input = ({label, value, updateValue, type}: InputProps) =>{
    return(
        <>
        <label>{label}</label>
        <input type={type} value = {value} onChange = {e => updateValue(e.target.value)}></input>
        </>
    )
}

export function Registro({closeModal, onRegisterSuccess}: LoginProps){
    const[nome, setNome] = useState("");
    const[email, setEmail] = useState("");
    const[senha, setSenha] = useState("");
    const[eCozinheiro, setECozinheiro] = useState(false);
    const {mutate, isSuccess} = useDadosUsuarioMutate();

    const submit = () => {
        if (!nome || !email || !senha) {
            alert("Por favor, preencha todos os campos.");
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
                    <Input type="text" label="nome" value={nome} updateValue={setNome}/>
                    <Input type="email" label="email" value={email} updateValue={setEmail}/>
                    <Input type="password" label="senha" value={senha} updateValue={setSenha}/>
                    <div className="checkbox-group">
                        <label id="label-checkbox">deseja adicionar pratos ao cardápio?</label>
                        <input id="checkbox"
                            type="checkbox"
                            checked={eCozinheiro}
                            onChange={e => setECozinheiro(e.target.checked)}
                        />
                    </div>
                </form>
                <button  className="botaoEnviar" onClick={submit}> Enviar </button>
            </div>
        </div>
    )
}