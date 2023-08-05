import React from 'react';
import "../../styles/card.css";;

function Card({ card }) {
  return (
    <div className="card">
      <img className="card-image" src={card.imgSrc} alt="Card Image" />
      <h2 className="card-name">{card.nome}</h2>
      <p className="card-info card-power">Poder: {card.poder}</p>
      <p className="card-info card-attribute">Atributo: {card.tipo}</p>
      <p className="card-info card-cost">Custo: {card.custo}</p>
    </div>
  );
}

export default Card;