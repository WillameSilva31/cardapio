import "./card.css"

interface CardProps{
    preco: number,
    nome: string,
    imagem: string,
    cozinheiroNome: string
}

export function Card({ preco, nome, imagem, cozinheiroNome }: Readonly<CardProps>) {
    return(
        <div className="card">
            <img alt="food-image" src={imagem}/>
            <h2>{nome}</h2>
            <p><b>Valor: </b>{preco} reais</p>
            <p><b>Vendido por: </b>{cozinheiroNome}</p>
            
        </div>
    )
}