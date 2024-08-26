import { useEffect, useState } from "react"
import "./modal.css"
import { useDadosComidaMutate } from "../../hooks/useDadosComidaMutate";
import { DadoComida } from "../../interface/DadoComida";

interface InputProps {
    label: string,
    value: string | number,
    updateValue (value: any): void
}

interface  ModalProps {
    closeModal(): void
}

const Input = ({label, value, updateValue}: InputProps) =>{
    return(
        <>
        <label>{label}</label>
        <input value = {value} onChange = {e => updateValue(e.target.value)}></input>
        </>
    )
}

export function CreateModal ({ closeModal}: ModalProps) {
    const [nome, setNome] = useState("");
    const [imagem, setImagem] = useState("");
    const [preco, setPreco] = useState(0);
    const {mutate, isSuccess} = useDadosComidaMutate();
    
    const submit = () => {
        const cozinheiroId = localStorage.getItem('cozinheiroId');
    
        if (!cozinheiroId) {
            alert("ID do cozinheiro não encontrado");
            return;
        }
        
        const dadoComida: DadoComida = {
            nome,
            imagem,
            preco,
            cozinheiroId   
        };
    
        mutate(dadoComida, {
            onError: (error) => {
                console.error('Erro na mutação:', error);
            }
        });
    };

    useEffect(() => {
        if (isSuccess) {
            closeModal();
        }
    }, [isSuccess]);
    
    return(
        <div className="modal-overflow">
            <div className="modal-body">
                <div className="modal-header">
                <h2>Cadastre um prato no cardápio</h2>
                <div className="botaoFechar" onClick={closeModal}> X </div>
                </div>
                <form className="input-container">
                    <Input label="nome" value={nome} updateValue={setNome}/>
                    <Input label="imagem" value={imagem} updateValue={setImagem}/>
                    <Input label="preco" value={preco} updateValue={setPreco}/>
                </form>
                <button onClick={submit} className="botaoEnviar"> Enviar </button>
            </div>
        </div>
    )
}