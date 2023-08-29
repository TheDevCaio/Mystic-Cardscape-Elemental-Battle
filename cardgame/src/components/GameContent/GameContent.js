/*import Game from '../Game/Game';
import { cards } from '../Data/Object';


const GameContent = () => {
  const locationRefs = Array.from({ length: 3 }, () => React.createRef());

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
          <div ref={locationRefs[0]} id="location1" className="location"></div>
          <div ref={locationRefs[1]} id="location2" className="location"></div>
          <div ref={locationRefs[2]} id="location3" className="location"></div>
        </div>
      </section>

      <section>
        <div className="buttons">
          <button className="button" id="endTurn">Finalizar Turno</button>
        </div>
      </section>

      <section>
        <div id="player">
          <div id="player-energy-bar">
            <span>Energia: <span id="player-energy-value"></span>/<span id="player-energy-max"></span></span>
          </div>
          <div id="player-hand"></div>
        </div>
      </section>

      <Game locationRefs={locationRefs} cards={cards} />
    </main>

   
  );
};

export default GameContent; */