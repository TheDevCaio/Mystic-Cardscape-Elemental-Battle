import './Game.css';
import React, { useState, useEffect, useRef } from 'react';
import { cards } from '../Data/Object';

function Game() {
  const [player, setPlayer] = useState({
    energiaAtual: 1,
    energiaMaxima: 8,
    cartasNaMao: [],
    deck: shuffle([...cards]),
  });

  const [computer, setComputer] = useState({
    energiaAtual: 1,
    energiaMaxima: 1,
    cartasNaMao: [],
    deck: shuffle([...cards]),
  });

  const [popup, setPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');
  const [turno, setTurno] = useState(0);

  const locationRefs = useRef([]);

  useEffect(() => {
    if (turno === 0) {
      startGame();
    }
  }, [turno]);


  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createCard(card) {
    return (
      <div key={card.nome} className="card-element card" draggable="true" data-power={card.poder} data-attribute={card.tipo} data-cost={card.custo}>
        <img className="card-image" draggable="false" src={card.imageSrc} alt="Card Image" />
        <h2 className="card-name">{card.nome}</h2>
        <p className="card-info card-power">Poder: {card.power}</p>
        <p className="card-info card-attribute">Atributo: {card.tipo}</p>
        <p className="card-info card-cost">Custo: {card.custo}</p>
      </div>
    );
  }

  function createCardPc(card) {
    return (
      <div key={card.nome} className="card-element cardPC" id={card.nome} data-power={card.poder} data-attribute={card.tipo} data-cost={card.custo}>
        <img className="card-image" draggable="false" src="../../assets/imagens/background.png" alt="Card Image" />
      </div>
    );
  }

  function drawCardPlayer() {
    if (player.deck.length === 0) {
      showPopupMessage("O deck está vazio!", 2000);
      return;
    }
    const card = player.deck.shift();
    setPlayer(prevPlayer => ({
      ...prevPlayer,
      cartasNaMao: [...prevPlayer.cartasNaMao, card]
    }));
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
        const cardEl = document.getElementById(card.nome);
        cardEl.remove();

        const randomLocation = Math.floor(Math.random() * 3);
        if (locationRefs[randomLocation].current.childElementCount < 4) {
          locationRefs[randomLocation].current.appendChild(
            createCardPc(card)
          );
        }

        setComputer(prevComputer => ({
          ...prevComputer,
          cartasNaMao: prevComputer.cartasNaMao.filter((_, index) => index !== i),
          energiaAtual: prevComputer.energiaAtual - card.custo,
        }));
      }
    }
  }

  useEffect(() => {
    locationRefs.current.forEach((locationRef) => {
      if (locationRef.current) {
        locationRef.current.addEventListener("dragover", (event) => {
          event.preventDefault();
        });

        locationRef.current.addEventListener("drop", (event) => {
          event.preventDefault();
          const cardId = event.dataTransfer.getData("text/plain");
          const card = locationRefs.current.find(cardRef => cardRef.current.id === cardId);

          if (event.target.classList.contains("location")) {
            if (event.target.children.length < 4) {
              if (player.energiaAtual >= parseInt(card.dataset.cost)) {
                event.target.appendChild(card);
                setPlayer((prevPlayer) => ({
                  ...prevPlayer,
                  energiaAtual: prevPlayer.energiaAtual - parseInt(card.dataset.cost),
                }));
              } else {
                showPopupMessage("Você não tem energia suficiente!", 2000);
              }
            } else {
              showPopupMessage("Você não pode jogar mais cartas nesse campo!", 2000);
            }
          }
        });
      }
    });
  }, [locationRefs, player]);


  function showPopupMessage(mensagem, tempoExibicao) {
    setPopupMsg(mensagem);
    setPopup(true);

    setTimeout(() => {
      hidePopup();
    }, tempoExibicao);
  }

  function hidePopup() {
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
        <div id="popup" className="popup-show">
          <button className="button" id="start-btn">Iniciar Jogo</button>
          <p id="popup-msg">{popupMsg}</p>
        </div>
      </section>

      <section>
        <div id="container" className="game-inactive">
          <div id="computer">
            <div id="computer-hand" className="display-hand"></div>
            <div id="computer-energy"></div>
          </div>
        </div>
      </section>

      <section>
        <div id="board">
          <div ref={locationRefs[0]} id="location1" className="location"></div>
          <div ref={locationRefs[1]} id="location2" className="location"></div>
          <div ref={locationRefs[2]} id="location3" className="location"></div>
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
          <div id="player-hand">{player.cartasNaMao.map(createCard)}</div>
        </div>
      </section>
    </main>
  );
}

export default Game;
