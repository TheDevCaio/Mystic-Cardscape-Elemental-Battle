
import { cards } from '../Data/Object';

export function Location1({ cards, onDrop, index, handleLocationDragOver }) {
  return (
    <div
      id="location1"
      className={`location droppable-location location${index + 1}`}
      onDragOver={(event) => handleLocationDragOver(event)}
      onDrop={(event) => onDrop(event, index)}
    >
      {cards.map((card, cardIndex) => (
        <div key={cardIndex} className="card-container">
          <div className="card">
          <img className="card-image" draggable="false" src={card.image} alt="Card Image" />
            <h2 className="card-name">{card.nome}</h2>
            <p className="card-info card-power">Poder: {card.poder}</p>
            <p className="card-info card-attribute">Atributo: {card.tipo}</p>
            <p className="card-info card-cost">Custo: {card.custo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Location2({ cards, onDrop, index, handleLocationDragOver }) {
  return (
    <div
      id="location2"
      className={`location droppable-location location${index + 1}`}
      onDragOver={(event) => handleLocationDragOver(event)}
      onDrop={(event) => onDrop(event, index)}
    >
      {cards.map((card, cardIndex) => (
        <div key={cardIndex} className="card-container">
          <div className="card">
          <img className="card-image" draggable="false" src={card.image} alt="Card Image" />
            <h2 className="card-name">{card.nome}</h2>
            <p className="card-info card-power">Poder: {card.poder}</p>
            <p className="card-info card-attribute">Atributo: {card.tipo}</p>
            <p className="card-info card-cost">Custo: {card.custo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Location3({ cards, onDrop, index, handleLocationDragOver }) {
  return (
    <div
      id="location3"
      className={`location droppable-location location${index + 1}`}
      onDragOver={(event) => handleLocationDragOver(event)}
      onDrop={(event) => onDrop(event, index)}
    >
      {cards.map((card, cardIndex) => (
        <div key={cardIndex} className="card-container">
          <div className="card">
          <img className="card-image" draggable="false" src={card.image} alt="Card Image" />
            <h2 className="card-name">{card.nome}</h2>
            <p className="card-info card-power">Poder: {card.poder}</p>
            <p className="card-info card-attribute">Atributo: {card.tipo}</p>
            <p className="card-info card-cost">Custo: {card.custo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
