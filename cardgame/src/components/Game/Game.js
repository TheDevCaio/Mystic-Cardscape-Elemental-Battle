import React from "react";

const Game = () => {
  return (
    <html lang="pt-br">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jogo de Cartas</title>
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/card.css" />
      </head>
      <body>
        <main>
          <section>
            <nav id="menu">
              <ul>
                <li><a href="home.html">Home</a></li>
                <li><a href="index.html">Jogo</a></li>
                <li>
                  <a href="https://github.com/ufjf-dcc121/ufjf-dcc121-2023-1-atv12-soloplayer">Códigos</a>
                </li>
              </ul>
            </nav>
          </section>

          <section>
            <div id="popup" className="popup-show">
              <button className="button" id="start-btn">
                Iniciar Jogo
              </button>
              <p id="popup-msg"></p>
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
              <div
                id="location1"
                className="location"
                onDrop={(event) => drop(event)}
                onDragOver={(event) => allowDrop(event)}
              ></div>
              <div
                id="location2"
                className="location"
                onDrop={(event) => drop(event)}
                onDragOver={(event) => allowDrop(event)}
              ></div>
              <div
                id="location3"
                className="location"
                onDrop={(event) => drop(event)}
                onDragOver={(event) => allowDrop(event)}
              ></div>
            </div>
          </section>

          <section>
            <div className="buttons">
              <button className="button" id="endTurn">
                Finalizar Turno
              </button>
            </div>
          </section>

          <section>
            <div id="player">
              <div id="player-energy-bar">
                <span>
                  Energia: <span id="player-energy-value"></span>/
                  <span id="player-energy-max"></span>
                </span>
              </div>
              <div id="player-hand"></div>
            </div>
          </section>

          <script src="/assets/js/events/board.js"></script>
          <script src="/assets/js/data/cards.js"></script>
          <script src="/assets/js/events/player.js"></script>
          <script src="/assets/js/events/gameEvents.js" type="module"></script>
        </main>
        <footer></footer>
      </body>
    </html>
  );
};

export default Game;