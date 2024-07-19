import React, { useState, useEffect, useRef } from 'react';
import { cards } from '../Data/Object';
import { Location1, Location2, Location3 } from './Location';
import '../Card/Card.css';
import '../Card/Game.css';

function Game() {
  const [player, setPlayer] = useState({
    energiaAtual: 0,
    energiaMaxima: 1,
    cartasNaMao: [],
    deck: shuffle([...cards]),
  });

  const [playerHand, setPlayerHand] = useState([]);

  const [computer, setComputer] = useState({
    energiaAtual: 0,
    energiaMaxima: 1,
    cartasNaMao: [],
    deck: shuffle([...cards]),
  });

  const [popup, setPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');
  const [turno, setTurno] = useState(0);
  const [popupVisible, setPopupVisible] = useState(true);

  const [locations, setLocations] = useState([[], [], []]);

  const locationRef1 = useRef(null);
  const locationRef2 = useRef(null);
  const locationRef3 = useRef(null);

  const [locationRefs, setLocationRefs] = useState([
    { ref: locationRef1, index: 0 },
    { ref: locationRef2, index: 1 },
    { ref: locationRef3, index: 2 },
  ]);

  function renderPlayerHand() {
    return (
      <div id="player-hand">
        {playerHand.map((card, index) => createCard(card, index))}
      </div>
    );
  }

  const handleLocationDrop = (event, locationIndex) => {
    console.log("Soltando carta na location:", locationIndex);
    event.preventDefault();

    const cardData = JSON.parse(event.dataTransfer.getData('application/json'));

    if (event.target.classList.contains('droppable-location')) {
      if (event.target.children.length < 2) {
        if (player.energiaAtual >= cardData.custo) {
          const updatedPlayer = { ...player };
          const cardIndex = updatedPlayer.cartasNaMao.findIndex((card) => card.nome === cardData.nome);

          if (cardIndex !== -1) {
            updatedPlayer.cartasNaMao.splice(cardIndex, 1);

            setPlayer(updatedPlayer);
            setPlayerHand([...updatedPlayer.cartasNaMao]);

            const updatedLocations = [...locations];
            updatedLocations[locationIndex] = [
              ...updatedLocations[locationIndex],
              {
                image: cardData.imgSrc,
                nome: cardData.nome,
                tipo: cardData.tipo,
                poder: cardData.poder,
                custo: cardData.custo,
              },
            ];
            setLocations(updatedLocations);
          }
        } else {
          showPopupMessage('Você não tem energia suficiente!', 2000);
        }
      } else {
        showPopupMessage('Você não pode jogar mais cartas nesse campo!', 2000);
      }
    }
  };

  const handleLocationDragOver = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    setLocationRefs([locationRef1, locationRef2, locationRef3]);

    locationRefs.forEach((locationRef, index) => {
      if (locationRef && locationRef.current) {
        locationRef.current.addEventListener("dragover", (event) => handleLocationDragOver(event, index));
        locationRef.current.addEventListener("drop", (event) => handleLocationDrop(event, index));
      }
    });
  }, [player, locations]);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createCard(card, index) {
    return (
      <div key={index} className="card-element card" draggable="true" data-power={card.poder} data-attribute={card.tipo} data-cost={card.custo} onDragStart={(event) => handleDragStart(event, card)}>
        <img className="card-image" draggable="false" src={card.imgSrc} alt={card.nome} />
        <h2 className="card-name">{card.nome}</h2>
        <p className="card-info card-power">Poder: {card.poder}</p>
        <p className="card-info card-attribute">Atributo: {card.tipo}</p>
        <p className="card-info card-cost">Custo: {card.custo}</p>
      </div>
    );
  }

  function handleDragStart(event, card) {
    event.dataTransfer.setData('application/json', JSON.stringify(card));
  }

  function createCardPc(card) {
    return (
      <div className="cardPC" id={card.nome} data-power={card.poder} data-attribute={card.tipo} data-cost={card.custo} key={card.nome}>
        <img className="card" draggable="false" src="assets/background.png" alt={card.nome} />
      </div>
    );
  }

  function drawCardPlayer() {
    if (player.deck.length === 0) {
      console.log('Ausência de energia');
      return;
    }
    const card = player.deck.shift();
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      cartasNaMao: [...prevPlayer.cartasNaMao, card],
    }));
    setPlayerHand((prevHand) => [...prevHand, card]);
  }

  function drawCardPC() {
    if (computer.deck.length === 0) {
      console.log("O deck do pc está vazio!");
      return;
    }

    const card = computer.deck.shift();
    setComputer(prevComputer => ({
      ...prevComputer,
      cartasNaMao: [...prevComputer.cartasNaMao, card]
    }));
  }

  function startGame() {
    showPopupMessage("Sacando cartas...", 4000);

    setPlayer(prevPlayer => ({
      ...prevPlayer,
      energiaAtual: prevPlayer.energiaMaxima
    }));
    setComputer(prevComputer => ({
      ...prevComputer,
      energiaAtual: prevComputer.energiaMaxima
    }));

    for (let i = 0; i < 4; i++) {
      setTimeout(drawCardPlayer, i * 500);
      setTimeout(drawCardPC, (i + 1) * 500);
    }

    setTimeout(computerPlay, 4000);

    setTimeout(() => {
      hidePopup();
    }, 2000);
  }

  function computerPlay() {
    // Lógica para o computador jogar suas cartas
  }

  function newTurn() {
    setTurno(prevTurno => prevTurno + 1);

    if (turno < 6) {
      setPlayer(prevPlayer => ({
        ...prevPlayer,
        energiaMaxima: prevPlayer.energiaMaxima + 1,
        energiaAtual: prevPlayer.energiaMaxima + 1
      }));
      setComputer(prevComputer => ({
        ...prevComputer,
        energiaMaxima: prevComputer.energiaMaxima + 1,
        energiaAtual: prevComputer.energiaMaxima + 1
      }));

      drawCardPlayer();
      drawCardPC();
      computerPlay();
    } else {
      checkWinner();
    }
  }

  function checkWinner() {
    let playerWins = 0;
    let computerWins = 0;

    for (let i = 0; i < 3; i++) {
      let playerScore = 0;
      let computerScore = 0;
      const cardsJogadosPC = Array.from(
        locationRefs[i].current.querySelectorAll(".cardPC")
      );
      const cardsJogadosPlayer = Array.from(
        locationRefs[i].current.querySelectorAll(".card")
      );
      cardsJogadosPlayer.forEach((card) => {
        playerScore += parseInt(card.dataset.power);
      });
      cardsJogadosPC.forEach((card) => {
        computerScore += parseInt(card.dataset.power);
      });
      console.log("Poder total do player: " + playerScore);
      console.log("Poder total do computador: " + computerScore);
      if (playerScore > computerScore) {
        playerWins++;
      } else if (playerScore < computerScore) {
        computerWins++;
      } else {
        playerWins++;
        computerWins++;
      }
    }
    if (playerWins > computerWins) {
      showPopupMessage("Você venceu!", 2000);
    } else if (playerWins < computerWins) {
      showPopupMessage("Você perdeu!", 2000);
    } else {
      showPopupMessage("Empate!", 2000);
    }
  }

  function showPopupMessage(message, duration) {
    setPopupMsg(message);
    setPopupVisible(true);

    setTimeout(() => {
      setPopupVisible(false);
    }, duration);
  }

  function hidePopup() {
    setPopupVisible(false);
  }

  return (
    <div>
      <div className="board">
        <div className="location droppable-location" ref={locationRef1}>
          <Location1>
            {locations[0].map((card, index) => (
              <div key={index} className="card">
                <img
                  className="card-image"
                  draggable="false"
                  src={card.image}
                  alt={card.nome}
                />
                <h2 className="card-name">{card.nome}</h2>
                <p className="card-info card-power">Poder: {card.poder}</p>
                <p className="card-info card-attribute">Atributo: {card.tipo}</p>
                <p className="card-info card-cost">Custo: {card.custo}</p>
              </div>
            ))}
          </Location1>
        </div>
        <div className="location droppable-location" ref={locationRef2}>
          <Location2>
            {locations[1].map((card, index) => (
              <div key={index} className="card">
                <img
                  className="card-image"
                  draggable="false"
                  src={card.image}
                  alt={card.nome}
                />
                <h2 className="card-name">{card.nome}</h2>
                <p className="card-info card-power">Poder: {card.poder}</p>
                <p className="card-info card-attribute">Atributo: {card.tipo}</p>
                <p className="card-info card-cost">Custo: {card.custo}</p>
              </div>
            ))}
          </Location2>
        </div>
        <div className="location droppable-location" ref={locationRef3}>
          <Location3>
            {locations[2].map((card, index) => (
              <div key={index} className="card">
                <img
                  className="card-image"
                  draggable="false"
                  src={card.image}
                  alt={card.nome}
                />
                <h2 className="card-name">{card.nome}</h2>
                <p className="card-info card-power">Poder: {card.poder}</p>
                <p className="card-info card-attribute">Atributo: {card.tipo}</p>
                <p className="card-info card-cost">Custo: {card.custo}</p>
              </div>
            ))}
          </Location3>
        </div>
      </div>
      <div id="popup" style={{ display: popupVisible ? 'block' : 'none' }}>
        {popupMsg}
      </div>
      <div id="playerHand">{renderPlayerHand()}</div>
      <button id="start-button" onClick={startGame}>Iniciar Jogo</button>
      <button id="turn-button" onClick={newTurn}>Novo Turno</button>
    </div>
  );
}

export default Game;
