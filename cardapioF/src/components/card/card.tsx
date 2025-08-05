import { useDeleteDadosComida } from "../../hooks/deleteDadosComida";
import "./card.css"

interface CardProps{
    id:string,
    preco: number,
    nome: string,
    imagem: string,
    cozinheiroId: string,
    cozinheiroNome: string
}

export function Card({id, preco, nome, imagem,cozinheiroId ,cozinheiroNome }: Readonly<CardProps>) {
    const idLogged = localStorage.getItem('cozinheiroId');
    const eCozinheiro = localStorage.getItem('eCozinheiro') === 'true';
    const deleteMutation = useDeleteDadosComida();
    const exclude = eCozinheiro && idLogged === cozinheiroId;

    const handleDelete = async () => {
        if (!confirm(`Tem certeza que deseja deletar "${nome}"?`)) {
            return;
        }

        try {
            await deleteMutation.deleteComida(id); 
            alert('Comida deletada com sucesso!');
        } catch (error) {
            alert('Erro ao deletar: ' + (error as Error).message);
        }
    };


    return(
        <div className="card">
            <img alt="food-image" src={imagem}/>
            <h2>{nome}</h2>
            <p><b>Vendido por: </b>{cozinheiroNome}</p>
            <p><b>Valor: </b>{preco} reais</p>
            {exclude && (
                <button 
                    className="btn-delete"
                    onClick={handleDelete}
                > 
                </button>
            )}
        </div>
    )
}