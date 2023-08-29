import React from 'react';

export function Card({ card }) {
  return (
    <div className="card-element card">
      <img className="card-image" draggable="false" src={card.imgSrc} alt="Card Image" />
      <h2 className="card-name">{card.nome}</h2>
      <p className="card-info card-power">Poder: {card.poder}</p>
      <p className="card-info card-attribute">Atributo: {card.tipo}</p>
      <p className="card-info card-cost">Custo: {card.custo}</p>
    </div>
  );
}

