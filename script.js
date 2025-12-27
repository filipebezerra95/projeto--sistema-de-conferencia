const checkResultsButton = document.querySelector("#checkResultsBtn");
const showPassButton = document.querySelector("#showPassBtn");
const list = document.querySelector(".ticketGames");
const sixResults = document.querySelector("#sixResults");
const fiveResults = document.querySelector("#fiveResults");
const fourResults = document.querySelector("#fourResults");
const threeResults = document.querySelector("#threeResults");

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

const championMusic = document.getElementById("championMusic");

const noWinnersMessage = document.querySelector("#noWinnersMessage");

let partyActive = false;
let moneyInterval = null;
let fireworksInterval = null;
let fireworksAnimationId = null;
let musicTimeout = null;

let jogosComAcertos = new Set();

//let myLi = '';

function checkResults() {
  jogosComAcertos.clear();
  let someoneAboveThree = false;
  stopCelebration();

  // contador de resultados
  const counters = {
    six: 0,
    five: 0,
    four: 0,
    three: 0,
  };

  // limpa containers
  sixResults.innerHTML = "";
  fiveResults.innerHTML = "";
  fourResults.innerHTML = "";
  threeResults.innerHTML = "";

  // pega os números sorteados
  const drawnNumbers = [];

  for (let i = 1; i <= 6; i++) {
    const value = document.querySelector(`#num${i}`).value;
    if (value) drawnNumbers.push(Number(value));
  }

  if (drawnNumbers.length !== 6) {
    alert("Digite os 6 números sorteados, sem migué 😅");
    return;
  }

  window.drawnNumbersGlobal = drawnNumbers;

  // confere os jogos
  gameChoice.forEach((game) => {
    const hits = game.numbers.filter((num) => drawnNumbers.includes(num));

    if (hits.length >= 3) {
      jogosComAcertos.add(`${game.group}-${game.game}`);
      const div = document.createElement("div");
      div.classList.add("jogo");

      div.innerHTML = `
        <strong>Grupo:</strong> ${game.group} |
        <strong>Jogo:</strong> ${game.game}<br>
        <strong>Números:</strong> ${game.numbers.join(" - ")}<br>
        <strong>Acertos (${hits.length}):</strong> ${hits.join(" - ")}
      `;

      if (hits.length === 6) {
        counters.six++;
        someoneAboveThree = true;
        div.classList.add("winner");
        sixResults.appendChild(div);

        // show da vitoria
        launchFirework();
        rainMoney();
        startMoneyRain();
        playChampionMusic();
        // parar o show
        if (!partyActive) {
          partyActive = true;
          playChampionMusic();
          startMoneyRain();
        }

        if (!someoneAboveThree) {
          noWinnersMessage.innerHTML = `
            <p class="no-winner">
              SOMOS BILIONARIOSS!!!!!!
            </p>
          `;
        }
      } else if (hits.length === 5) {
        counters.five++;
        someoneAboveThree = true;
        div.classList.add("winner-silver");
        fiveResults.appendChild(div);
      } else if (hits.length === 4) {
        counters.four++;
        someoneAboveThree = true;
        div.classList.add("winner-bronze");
        fourResults.appendChild(div);
      } else if (hits.length === 3) {
        counters.three++;
        threeResults.appendChild(div);
        div.classList.add("winner-fifth");
      }
    }
  });

  // atualiza títulos com contadores
  sixResults.insertAdjacentHTML(
    "afterbegin",
    `<h3>🏆 6 dezenas (${counters.six})</h3>`
  );
  fiveResults.insertAdjacentHTML(
    "afterbegin",
    `<h3>🔥 5 dezenas (${counters.five})</h3>`
  );
  fourResults.insertAdjacentHTML(
    "afterbegin",
    `<h3>😎 4 dezenas (${counters.four})</h3>`
  );
  threeResults.insertAdjacentHTML(
    "afterbegin",
    `<h3>🙂 3 dezenas (${counters.three})</h3>`
  );

  // mensagem de derrota coletiva
  if (!someoneAboveThree) {
    noWinnersMessage.innerHTML = `
      <p class="no-winner">
        😭 Ninguém acertou mais que 3 dezenas...  
        seguimos firmes e CLT amanhã.
      </p>
    `;
  }
}

// logica da animação quando acertar 6 dezenas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// função para os fogos de artificio
function launchFirework() {
  const particles = [];

  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = (Math.random() * canvas.height) / 2;

    for (let i = 0; i < 50; i++) {
      particles.push({
        x,
        y,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 5 + 2,
        life: 100,
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.life--;

      ctx.fillstyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
      ctx.fillRect(p.x, p.y, 3, 3);

      if (p.life <= 0) particles.splice(i, 1);
    });

    // requestAnimationFrame(animate);
    fireworksAnimationId = requestAnimationFrame(animate);
  }

  fireworksInterval = setInterval(createFirework, 600);
  animate();
  //setInterval(createFirework, 500);
  // animate();
}
//função para parar os fogos
function stopFireWorks() {
  clearInterval(fireworksInterval);
  fireworksInterval = null;

  if (fireworksAnimationId) {
    cancelAnimationFrame(fireworksAnimationId);
    fireworksAnimationId = null;
  }

  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// função para dinheiro voar na tela

function rainMoney() {
  for (let i = 0; i < 100; i++) {
    const money = document.createElement("div");
    money.classList.add("money");
    money.innerText = "💸💰 🪙 💵";
    money.style.left = Math.random() * window.innerWidth + "px";
    money.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.body.appendChild(money);

    setTimeout(() => money.remove(), 5000);
  }
}

// função para o dinheiro aparecer infinito

function startMoneyRain() {
  if (moneyInterval) return; // evita duplicar

  moneyInterval = setInterval(() => {
    const money = document.createElement("div");
    money.classList.add("money");
    money.innerText = "💸";

    money.style.left = Math.random() * window.innerWidth + "px";
    money.style.animationDuration = Math.random() * 3 + 2 + "s";

    document.body.appendChild(money);

    setTimeout(() => {
      money.remove();
    }, 6000);
  }, 200); // cria dinheiro a cada 200ms
}

function stopMoneyRain() {
  clearInterval(moneyInterval);
  moneyInterval = null;

  document.querySelectorAll(".money").forEach((el) => el.remove());
}

//  musica dos campeões

function playChampionMusic() {
  championMusic.loop = true;
  championMusic.currentTime = 0;
  championMusic.volume = 0.8;
  championMusic.play();

  if (musicTimeout) {
    clearTimeout(musicTimeout);
  }

  //musica para apos 15 segundos
  musicTimeout = setTimeout(() => {
    stopChampionMusic();
  }, 15000);
}

function stopChampionMusic() {
  championMusic.pause();
  championMusic.currentTime = 0;

  if (musicTimeout) {
    clearTimeout(musicTimeout);
    musicTimeout = null;
  }
}

//função mestra: para tudo
function stopCelebration() {
  partyActive = false;
  stopChampionMusic();
  stopMoneyRain();
  stopFireWorks();
}

// função para mostrar os jogos que foram feitos

function showGamesTickets() {
  const modal = document.querySelector("#modalOverlay");
  const list = document.querySelector(".ticketGames");

  const groupedGames = groupGamesByGroup(gameChoice);

  let html = "";

  Object.keys(groupedGames).forEach((group) => {
    const games = sortGames(groupedGames[group]);

    html += `<h3>Grupo ${group}</h3>`;
    html += `
      <table class="games-table">
        <thead>
          <tr>
            <th>Jogo</th>
            <th>Números</th>
          </tr>
        </thead>
        <tbody>
    `;

    games.forEach((item) => {
      const key = `${item.group}-${item.game}`;
      const destaque = jogosComAcertos.has(key) ? "hit-game" : "";
      const numbersHTML = item.numbers

        .map((num) => {
          const hit = 
          window.drawnNumbersGlobal &&
          window.drawnNumbersGlobal.includes(num);

          return `<span class="dezena ${hit ? "hit" : ""}">${num}</span>`
        })
        .join(" ");

      html += `
        <tr class="${destaque}">
          <td>${item.game}</td>
          <td class="numbers">${numbersHTML}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;
  });

  list.innerHTML = html;
  modal.style.display = "flex";
}

// fechar o modal

document.querySelector("#closeModal").addEventListener("click", () => {
  document.querySelector("#modalOverlay").style.display = "none";
});

// função separando jogos por grupo
function groupGamesByGroup(games) {
  return games.reduce((acc, game) => {
    if (!acc[game.group]) {
      acc[game.group] = [];
    }

    acc[game.group].push(game);
    return acc;
  }, {});
}

// função para ordenar os jogos por numero
function sortGames(games) {
  return games.sort((a, b) => a.game - b.game);
}

checkResultsButton.addEventListener("click", checkResults);
showPassButton.addEventListener("click", showGamesTickets);
