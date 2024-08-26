import "./card.css"

interface CardProps{
    preco: number,
    nome: string,
    imagem: string
}

export function Card({ preco, nome, imagem }: CardProps) {
    return(
        <div className="card">
            <img src={imagem}/>
            <h2>{nome}</h2>
            <p><b>Valor: </b>{preco} reais</p>
        </div>
    )
}