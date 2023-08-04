import { cards } from "../data/cards.js";

var turno = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(name, imageSrc, power, attribute, cost) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card-element");
  cardDiv.classList.add("card");
  cardDiv.setAttribute("draggable", "true");
  cardDiv.setAttribute("id", "PC" + name);
  cardDiv.setAttribute("data-power", power);
  cardDiv.setAttribute("data-attribute", attribute);
  cardDiv.setAttribute("data-cost", cost);

  cardDiv.innerHTML = `
      <img class="card-image" draggable="false" src="${imageSrc}" alt="Card Image">
      <h2 class="card-name">${name}</h2>
      <p class="card-info card-power">Poder: ${power}</p>
      <p class="card-info card-attribute">Atributo: ${attribute}</p>
      <p class="card-info card-cost">Custo: ${cost}</p>
  `;

  const playerHandDiv = document.getElementById("player-hand");
  playerHandDiv.appendChild(cardDiv);
}

function createCardPc(name, power, attribute, cost) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card-element");
  cardDiv.classList.add("cardPC");
  cardDiv.setAttribute("id", name);
  cardDiv.setAttribute("data-power", power);
  cardDiv.setAttribute("data-attribute", attribute);
  cardDiv.setAttribute("data-cost", cost);

  cardDiv.innerHTML = `
      <img class="card-image" draggable="false" src="../../assets/imagens/background.png" alt="Card Image">
  `;

  const computerHandDiv = document.getElementById("computer-hand");
  computerHandDiv.appendChild(cardDiv);
}

const endTurnButton = document.getElementById("endTurn");
endTurnButton.addEventListener("click", newTurn);

const playerEnergiaValue = document.getElementById("player-energy-value");
const playerEnergiaMax = document.getElementById("player-energy-max");

const player = {
  energiaAtual: 1,
  energiaMaxima: 1,
  cartasNaMao: [],
  deck: shuffle([...cards]),
};

const computer = {
  energiaAtual: 1,
  energiaMaxima: 1,
  cartasNaMao: [],
  deck: shuffle([...cards]),
};

const locations = document.querySelectorAll(".location");

function drawCardPlayer() {
  if (player.deck.length === 0) {
    showPopupMessage("O deck está vazio!", 2000);
    return;
  }
  const card = player.deck.shift();
  createCard(card.nome, card.imgSrc, card.poder, card.tipo, card.custo);
  player.cartasNaMao.push(card);
}

function drawCardPC() {
  if (computer.deck.length === 0) {
    console.log("O deck do pc está vazio!");
    return;
  }

  const card = computer.deck.shift();
  createCardPc(card.nome, card.poder, card.tipo, card.custo);
  computer.cartasNaMao.push(card);
}

function startGame() {
  showPopupMessage("Sacando cartas...", 4000);
  playerEnergiaValue.textContent = player.energiaAtual;
  playerEnergiaMax.textContent = player.energiaMaxima;
  for (let i = 0; i < 4; i++) {
    setTimeout(drawCardPlayer, i * 500);
    setTimeout(drawCardPC, (i + 1) * 500);
  }
  setTimeout(computerPlay, 4000);
}

const startBTN = document.querySelector("#start-btn");
const gameActivity = document.querySelector(".game-inactive");
startBTN.addEventListener("click", function () {
  startBTN.style.display = "none";
  startBTN.style.visibility = "hidden";
  gameActivity.classList.remove("game-inactive");
  hidePopup();
  startGame();
});

function newTurn() {
  turno++;
  if (turno < 6) {
    player.energiaMaxima++;
    computer.energiaMaxima++;
    player.energiaAtual = player.energiaMaxima;
    computer.energiaAtual = computer.energiaMaxima;
    playerEnergiaValue.textContent = player.energiaAtual;
    playerEnergiaMax.textContent = player.energiaMaxima;
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
    const cardsJogadosPC = locations[i].querySelectorAll(".cardPC");
    const cardsJogadosPlayer = locations[i].querySelectorAll(".card");
    cardsJogadosPlayer.forEach((card) => {
      playerScore += parseInt(card.dataset.power);
    });
    cardsJogadosPC.forEach((card) => {
      computerScore += parseInt(card.dataset.power);
    });
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
  return;
}

function computerPlay() {
  showPopupMessage("O computador realizou a jogada!", 2000);
  for (let i = 0; i < computer.cartasNaMao.length; i++) {
    const card = computer.cartasNaMao[i];
    if (card.custo <= computer.energiaAtual) {
      const cardEl = document.getElementById(card.nome);
      cardEl.remove();
      while (true) {
        const randomLocation = Math.floor(Math.random() * 3);
        if (locations[randomLocation].childElementCount < 4) {
          locations[randomLocation].appendChild(cardEl);
          break;
        }
      }
      computer.cartasNaMao.splice(i, 1);
      computer.energiaAtual -= card.custo;
    }
  }
}

console.log(player.deck);
const cardsEl = document.querySelectorAll(".card");

const playerHandDiv = document.getElementById("player-hand");
playerHandDiv.addEventListener("dragstart", function (event) {
  if (
    event.target.closest(".card") ||
    event.target.classList.contains("card")
  ) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }
});

locations.forEach((location) => {
  location.addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  location.addEventListener("drop", function (event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const card = document.getElementById(cardId);

    if (event.target.classList.contains("location")) {
      if (event.target.children.length < 4) {
        if (player.energiaAtual >= parseInt(card.dataset.cost)) {
          event.target.appendChild(card);
          player.energiaAtual -= parseInt(card.dataset.cost);
          playerEnergiaValue.textContent = player.energiaAtual;
        } else {
          showPopupMessage("Você não tem energia suficiente!", 2000);
        }
      } else {
        showPopupMessage("Você não pode jogar mais cartas nesse campo!", 2000);
      }
    }
  });
});

const popup = document.getElementById("popup");
const popupMsg = document.getElementById("popup-msg");

function showPopup(message) {
  popup.style.display = "block";
  popupMsg.textContent = message;
}

function hidePopup() {
  popup.style.display = "none";
}

function showPopupMessage(mensagem, tempoExibicao) {
  popupMsg.textContent = mensagem;
  popup.style.display = "block";

  setTimeout(() => {
    hidePopup();
  }, tempoExibicao);
}
