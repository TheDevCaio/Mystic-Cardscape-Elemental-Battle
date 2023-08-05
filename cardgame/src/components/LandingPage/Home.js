import React from "react";
import "../../styles/card.css";;

const Home = () => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <header>
          {" "}
          <title>Home</title>{" "}
        </header>
      </head>
      <body>
        <main>
          <section>
            <nav id="menu">
              <ul>
                <li>
                  <a href="home.html">Home</a>
                </li>

                <li>
                  <a href="index.html">Jogo</a>
                </li>
                <li>
                  <a href="https://github.com/ufjf-dcc121/ufjf-dcc121-2023-1-atv12-soloplayer">Códigos</a>
                </li>
              </ul>
            </nav>
          </section>

          <section>
            <header id="NomeJ">
              <h1>Estalo Lastimável</h1>
            </header>
          </section>

          <section>
            <ul id="leads">
              <li>
                1: Uma partida é disputada entre o jogador e o computador.
              </li>
              <br />
              <li>
                2: Cada partida consiste em exatamente 6 rodadas, terminando
                imediatamente após a resolução da 6ª rodada.
              </li>
              <br />
              <li>
                3: O objetivo do jogo é controlar a maioria dos 3 locais
                disponíveis.
              </li>
              <br />
              <li>
                4: O jogador controla um local se a soma das forças dos seus
                personagens no local for maior do que a soma dos personagens do
                oponente também no local.
              </li>
              <br />
              <li>
                5: Cada jogador começa com um baralho contendo as mesmas 12
                cartas de personagens. Cada carta possui um nome, um custo em
                energia e uma força.
              </li>
              <br />
              <li>
                6: No início da partida, os jogadores sacam aleatoriamente 4
                cartas para suas mãos.
              </li>
              <br />
              <li>
                7: No início de cada rodada, cada jogador recebe:
                <br />
                - Nova carta sacada aleatoriamente e adicionada à mão;
                <br />
                - Total de energia igual à rodada atual (de 1 a 6).
              </li>
              <br />
              <li>
                8: O jogador pode gastar energia para colocar as cartas da mão
                em um local válido.
              </li>
              <br />
              <li>
                9: O jogador não pode colocar uma carta se não tiver energia
                suficiente para baixá-la.
              </li>
              <br />
              <li>
                10: O jogador não pode colocar mais de 4 cartas em um local.
              </li>
              <br />
              <li>11: A energia não utilizada é perdida ao final da rodada.</li>
              <br />
              <li>
                12: O vencedor será aquele que, ao final da partida, controlar a
                maioria dos 3 locais em disputa.
              </li>
            </ul>
          </section>

          <section>
            <button id="Button2">
              <a href="index.html">Jogue Agora</a>
            </button>
          </section>

          <section>
            <footer></footer>
          </section>
        </main>
      </body>
    </html>
  );
};

export default Home;