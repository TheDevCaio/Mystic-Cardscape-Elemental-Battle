/* global handleLocationDragOver, handleLocationDrop */
/* eslint-disable */
import ReactDOM from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import { cards } from '../Data/Object';
import { Location1, Location2, Location3 } from './Location';
import '../Card/Card.css'
import '../Card/Game.css'

function Game() {

  const [player, setPlayer] = useState({
    energiaAtual: 0,
    energiaMaxima: 1,
    cartasNaMao: [],
    deck: shuffle([...cards]),
  });

  const [playerHand, setPlayerHand] = useState([
    
  ]);

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


  const [locations, setLocations] = useState([
   [], 
   [], 
   [], 
  ]);

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
      <div key={index} className="card-element card" draggable="true" data-power={card.poder} data-attribute={card.tipo} data-cost={card.custo}  onDragStart={(event) => handleDragStart(event, card)}>
        
        <img className="card-image" draggable="false" src={card.imgSrc} alt="Card Image" />
        <h2 className="card-name">{card.nome}</h2>
        <p className="card-info card-power">Poder: {card.poder}</p>
        <p className="card-info card-attribute">Atributo: {card.tipo}</p>
        <p className="card-info card-cost">Custo: {card.custo}</p>
      </div>
    );
  }

  function createCardPc(card) {
  return (
    <div className="cardPC" id={card.nome} data-power={card.poder} data-attribute={card.tipo} data-cost={card.custo} key={card.nome}>
      <img className="card" draggable="false" src="assets/background.png" alt="Card Image" />
    </div>
  );
}

function drawCardPlayer() {
 
  if (player.deck.length === 0) {
    console.log('Ausência de energia')
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

  function computerPlay() {
    showPopupMessage("O computador realizou a jogada!", 2000);
  
    for (let i = 0; i < computer.cartasNaMao.length; i++) {
      const card = computer.cartasNaMao[i];
      if (card.custo <= computer.energiaAtual) {
        const randomLocation = Math.floor(Math.random() * 3);
        const targetRef = locationRefs[randomLocation];
  
        if (targetRef && targetRef.current && targetRef.current.childElementCount < 2) {
          setComputer(prevComputer => ({
            ...prevComputer,
            cartasNaMao: prevComputer.cartasNaMao.filter((_, index) => index !== i),
            energiaAtual: prevComputer.energiaAtual - card.custo,
          }));
  
          const newCardElement = document.createElement("div");
          newCardElement.className = "cardPC";
          newCardElement.style.marginRight = "1px"; 
          newCardElement.id = card.nome;
          newCardElement.dataset.power = card.poder;
          newCardElement.dataset.attribute = card.tipo;
          newCardElement.dataset.cost = card.custo;
  
          const img = document.createElement("img");
          img.className = "cardPC";
          img.draggable = "false";
          img.src = "assets/background.png";
          img.alt = "Card Image";
  
          newCardElement.appendChild(img);
  
          targetRef.current.appendChild(newCardElement);
          
        }
      }
    }
  }

  const handleDragStart = (event, card) => {
    console.log("Iniciando arrasto da carta:", card.nome);
    console.log("Card data:", card);
  
    event.dataTransfer.setData('application/json', JSON.stringify(card));
    event.dataTransfer.setDragImage(event.target, 0, 0);
  };

   function showPopupMessage(mensagem, tempoExibicao) {
    setPopupVisible(true);
    setPopup(true);

    setTimeout(() => {
      hidePopup();
    }, 2000);
  }

  function hidePopup() {
    setPopupVisible(false);
    setPopup(false);
  }

  return (
  <main>
    <section>
      <nav id="menu">
        <ul>
          <li><a href="home.html">Home</a></li>
          <li><a href="index.html">Jogo</a></li>
          <li><a href="https://github.com/ufjf-dcc121/ufjf-dcc121-2023-1-atv12-soloplayer">Códigos</a></li>
        </ul>
      </nav>
    </section>

    <section>
      <div id="popup" style={{ display: popupVisible ? 'popup-show' : 'none' }}>
        <button className="button" id="start-btn" onClick={startGame}>Iniciar Jogo</button>
        <p id="popup-msg">{popupMsg}</p>
      </div>
    </section>

    <section>
      <div id="container" className={popupVisible ? 'game-inactive' : ''}>
        <div id="computer">
          <div id="computer-hand" className="display-hand"></div>
          <div id="computer-energy"></div>
        </div>
      </div>
    </section>

   
    <section>
  <div id="board">
    <div
      ref={locationRef1}
      id="location1"
      className="location droppable-location location1"
      onDragOver={(event) => handleLocationDragOver(event, 0)}
      onDrop={(event) => handleLocationDrop(event, 0)}
    ></div>
    <div
      ref={locationRef2}
      id="location2"
      className="location droppable-location location2"
      onDragOver={(event) => handleLocationDragOver(event, 1)}
      onDrop={(event) => handleLocationDrop(event, 1)}
    ></div>
    <div
      id="location3"
      className="location droppable-location location3"
      onDragOver={(event) => handleLocationDragOver(event, 2)}
      onDrop={(event) => handleLocationDrop(event, 2)}
     ></div>


<div id="board">
  <Location1 cards={locations[0]} onDrop={handleLocationDrop} index={0} handleLocationDragOver={handleLocationDragOver} />
  <Location2 cards={locations[1]} onDrop={handleLocationDrop} index={1} handleLocationDragOver={handleLocationDragOver} />
  <Location3 cards={locations[2]} onDrop={handleLocationDrop} index={2} handleLocationDragOver={handleLocationDragOver} />
</div>

  </div>
</section>


    <section>
      <div className="buttons">
        <button className="button" id="endTurn" onClick={newTurn}>Finalizar Turno</button>
      </div>
    </section>

    <section>
      <div id="player">
        <div id="player-energy-bar">
          <span>Energia: <span id="player-energy-value">{player.energiaAtual}</span>/<span id="player-energy-max">{player.energiaMaxima}</span></span>
        </div>
        <div id="player-hand">
           {renderPlayerHand()}
        </div>
      </div>
    </section>
  </main>
); }
export default Game; 