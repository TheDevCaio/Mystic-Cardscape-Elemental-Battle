import React, { useContext, useState } from 'react';
import Card from '../Cards/CardsM.js';
import { GameFunction } from './GameContext.js'; // Certifique-se de ajustar o caminho correto

function Player() {
  const { player } = useContext(GameFunction); // Certifique-se de que o contexto esteja corretamente configurado

  const [playerHand, setPlayerHand] = useState(player.cartasNaMao);

  return (
    <div className="game">
      {/* Seu código do jogo aqui */}
      <div className="player-hand">
        {playerHand.map((card) => (
          <Card key={card.nome} card={card} />
        ))}
      </div>
    </div>
  );
}

export default Player;