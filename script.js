// =========================
// VARIÁVEIS GERAIS
// =========================
const regras = [
  { titulo: "Tudo por mímica", descricao: "Comunique-se apenas por gestos e expressões. Falar é estritamente proibido." },
  { titulo: "Troca de nomes", descricao: "É obrigatório errar o nome de todos os jogadores — quanto mais absurdo, melhor." },
  { titulo: "Fale rimando", descricao: "Todas as frases devem rimar. Se perder a rima, perde a graça." },
  { titulo: "Cante suas palavras", descricao: "Tudo o que disser deve ser cantado, como se estivesse num musical." },
  { titulo: "Proibido rir", descricao: "Quem der risada perde moral instantaneamente. Controle-se, cidadão." },
  { titulo: "Proibido comer ou beber", descricao: "É hora do jejum festivo: nada de copos ou garfos até o fim do mandato." },
  { titulo: "Fale com sotaque estrangeiro", descricao: "Escolha um sotaque e mantenha até o fim. Pontos extras pela criatividade." },
  { titulo: "Dance o tempo todo", descricao: "Todo movimento deve ser dançando. Ficar parado é infração grave." },
  { titulo: "Frases de três palavras", descricao: "Cada fala deve ter exatamente três palavras. Nem mais, nem menos." },
  { titulo: "Palavra proibida", descricao: "O Prefeito escolhe uma palavra banida. Quem disser, sofre as consequências." },
  { titulo: "Sem usar as mãos", descricao: "As mãos devem permanecer imóveis. Gesticular é proibido por decreto." },
  { titulo: "Cumprimento obrigatório", descricao: "Sempre que alguém olhar pra você, acene com elegância." },
  { titulo: "Prefeito é rei", descricao: "O Prefeito pode dar ordens a qualquer jogador — e todos devem obedecer." },
  { titulo: "Só perguntas", descricao: "Toda fala deve ser uma pergunta. Afirmações estão proibidas." },
  { titulo: "Repita a última frase", descricao: "Antes de dizer algo novo, repita a última frase que alguém falou." },
  { titulo: "Fale em câmera lenta", descricao: "Fale como se estivesse num filme rodando em 0.5x de velocidade." },
  { titulo: "Fale acelerado", descricao: "Fale o mais rápido possível, sem pausas, como se estivesse com pressa." },
  { titulo: "Olhos fechados", descricao: "Mantenha os olhos fechados durante todo o seu mandato." },
  { titulo: "Repita tudo", descricao: "Antes de falar algo novo, repita a última coisa que você mesmo disse." },
  { titulo: "Modo robô", descricao: "Fale e se mova de forma robótica, sem emoção nem naturalidade." },
  { titulo: "Modo novela mexicana", descricao: "Tudo o que disser deve ser dramático, exagerado e cheio de emoção." },
  { titulo: "Sem risadas audíveis", descricao: "Pode sorrir, mas qualquer som de risada é proibido." },
  { titulo: "Modo torcida organizada", descricao: "Comece toda fala com uma palavra de torcida — tipo 'vamo', 'gol' ou 'bora'." },
  { titulo: "Sem nomes próprios", descricao: "Nomes próprios estão proibidos. Use apelidos criativos ou gestos." },
  { titulo: "Modo poeta", descricao: "Tudo o que disser deve soar como poesia. Fale bonito, mesmo sem sentido." },
  { titulo: "Rindo de nervoso", descricao: "Toda fala deve terminar com uma risadinha falsa." },
  { titulo: "Elogie o Prefeito", descricao: "Antes de falar qualquer coisa, elogie o Prefeito de Marinolândia." },
  { titulo: "Aplausos obrigatórios", descricao: "Sempre que alguém terminar de falar, todos devem aplaudir." },
];


const defaultPlayers = ["Pedro", "Marina", "Theresa", "Paixão", "Gui", "Galiza", "Ana", "Louis", "Marquinhos"];
let activePlayers = JSON.parse(localStorage.getItem("activePlayers")) || defaultPlayers;
let lastMayor = null;
let votes = {};
let currentVoterIndex = 0;
let timerInterval, timeLeft, duration = 3;
const skipButton = document.createElement("button");
skipButton.id = "skipButton";
skipButton.textContent = "Encerrar agora ⏹️";
skipButton.classList.add("hidden");
document.getElementById("gameContainer").appendChild(skipButton);

// =========================
// ELEMENTOS DOM
// =========================
const startButton = document.getElementById("startButton");
const ruleSelection = document.getElementById("ruleSelection");
const ruleOptions = document.getElementById("ruleOptions");
const activeRuleContainer = document.getElementById("activeRuleContainer");
const activeRuleTitle = document.getElementById("activeRuleTitle");
const activeRuleDesc = document.getElementById("activeRuleDesc");
const timerDisplay = document.getElementById("timer");
const nextButton = document.getElementById("nextButton");
const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const saveSettings = document.getElementById("saveSettings");
const playersButton = document.getElementById("playersButton");
const playersModal = document.getElementById("playersModal");
const playersList = document.getElementById("playersList");
const savePlayers = document.getElementById("savePlayers");

const electionContainer = document.getElementById("electionContainer");
const electionPrompt = document.getElementById("electionPrompt");
const voteOptions = document.getElementById("voteOptions");
const showResultButton = document.getElementById("showResultButton");
const resultContainer = document.getElementById("resultContainer");
const winnerMessage = document.getElementById("winnerMessage");
const newMandateButton = document.getElementById("newMandateButton");

// =========================
// INÍCIO DIRETO NA ELEIÇÃO
// =========================
startButton.addEventListener("click", () => {
    startButton.classList.add("hidden");
    startElection();
});

// =========================
// CONFIGURAÇÕES
// =========================
settingsButton.addEventListener("click", () => {
    settingsModal.style.display = "flex";
});
saveSettings.addEventListener("click", () => {
    duration = parseInt(document.getElementById("duration").value) || 3;
    settingsModal.style.display = "none";
});
settingsModal.addEventListener("click", e => {
    if (e.target === settingsModal) settingsModal.style.display = "none";
});

// =========================
// JOGADORES
// =========================
playersButton.addEventListener("click", () => {
    playersList.innerHTML = "";
    defaultPlayers.forEach(player => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = activePlayers.includes(player);
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) activePlayers.push(player);
            else activePlayers = activePlayers.filter(p => p !== player);
        });
        label.appendChild(checkbox);
        label.append(` ${player}`);
        playersList.appendChild(label);
    });
    playersModal.style.display = "flex";
});

savePlayers.addEventListener("click", () => {
    localStorage.setItem("activePlayers", JSON.stringify(activePlayers));
    playersModal.style.display = "none";
});

playersModal.addEventListener("click", e => {
    if (e.target === playersModal) playersModal.style.display = "none";
});

// =========================
// ELEIÇÃO SECRETA
// =========================
function startElection() {
    electionContainer.classList.remove("hidden");
    electionPrompt.textContent = `${activePlayers[currentVoterIndex]} deve votar.`;
    updateVoteOptions();
}

function updateVoteOptions() {
    voteOptions.innerHTML = "";
    const voter = activePlayers[currentVoterIndex];
    const candidates = activePlayers.filter(p => p !== voter && p !== lastMayor);

    candidates.forEach(name => {
        const card = document.createElement("div");
        card.className = "vote-card";
        const cardName = document.createElement("div");
        cardName.className = "vote-card-name";
        cardName.textContent = name;
        card.appendChild(cardName);
        card.addEventListener("click", () => recordVote(voter, name));
        voteOptions.appendChild(card);
    });
}

function recordVote(voter, candidate) {
  votes[voter] = candidate;
  currentVoterIndex++;

  // 🔹 Remove estados de hover/focus para evitar "ficar selecionado" no iPad
  document.querySelectorAll('.vote-card').forEach(card => {
    card.blur();
    card.style.transform = ''; // remove possível efeito visual
    card.style.backgroundColor = ''; // reseta cor se tiver mudado via CSS
  });

  if (currentVoterIndex < activePlayers.length) {
    const nextVoter = activePlayers[currentVoterIndex];
    electionPrompt.textContent = `${nextVoter} deve votar.`;
    updateVoteOptions();
  } else {
    electionPrompt.textContent = "Todos votaram!";
    voteOptions.innerHTML = "";
    showResultButton.classList.remove("hidden");
  }
}

showResultButton.addEventListener("click", () => {
    showResultButton.classList.add("hidden");
    electionContainer.classList.add("hidden");
    showElectionResult();
});

function showElectionResult() {
    const tally = {};
    Object.values(votes).forEach(vote => {
        tally[vote] = (tally[vote] || 0) + 1;
    });
    const maxVotes = Math.max(...Object.values(tally));
    const winners = Object.keys(tally).filter(name => tally[name] === maxVotes);
    const winner = winners[Math.floor(Math.random() * winners.length)];
    lastMayor = winner;
    localStorage.setItem("lastMayor", winner);

    resultContainer.classList.remove("hidden");
    winnerMessage.textContent = `🎉 Parabéns, ${winner}! Você ganhou a eleição para a Prefeitura de Marinolândia! Escolha uma nova lei para entrar em vigor.`;
    newMandateButton.classList.remove("hidden");
}

// =========================
// NOVO MANDATO (ESCOLHA REGRA)
// =========================
newMandateButton.addEventListener("click", () => {
    // Esconde resultados e eleição
    resultContainer.classList.add("hidden");
    electionContainer.classList.add("hidden");

    // Reseta estado
    currentVoterIndex = 0;
    votes = {};
    showResultButton.classList.add("hidden");
    newMandateButton.classList.add("hidden");

    // Garante que o container principal está visível
    activeRuleContainer.classList.add("hidden");
    ruleSelection.classList.remove("hidden");
    ruleOptions.classList.remove("hidden");
    timerDisplay.classList.add("hidden");
    nextButton.classList.add("hidden");

    // Mostra as regras novamente
    showRuleOptions();
});

// =========================
// CICLO DAS REGRAS
// =========================
function showRuleOptions() {
    const shuffled = regras.sort(() => 0.5 - Math.random()).slice(0, 3);
    ruleOptions.innerHTML = "";
    shuffled.forEach(rule => {
        const card = document.createElement("div");
        card.className = "rule-card";

        const title = document.createElement("div");
        title.className = "rule-card-title";
        title.textContent = rule.titulo;

        const desc = document.createElement("div");
        desc.className = "rule-card-desc";
        desc.textContent = rule.descricao;

        card.appendChild(title);
        card.appendChild(desc);
        card.addEventListener("click", () => selectRule(rule));

        ruleOptions.appendChild(card);
    });
    ruleSelection.classList.remove("hidden");
}

function selectRule(rule) {
    ruleSelection.classList.add("hidden");
    activeRuleContainer.classList.remove("hidden");
    activeRuleTitle.textContent = `📜 ${rule.titulo}`;
    activeRuleDesc.textContent = rule.descricao;
    startTimer();
}

function startTimer() {
  timeLeft = duration * 60;
  timerDisplay.classList.remove("hidden");
  skipButton.classList.remove("hidden");
  updateTimer();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      skipButton.classList.add("hidden");
      nextButton.classList.remove("hidden");
    }
  }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `⏱ Tempo restante: ${minutes}:${seconds.toString().padStart(2, "0")}`;
}

nextButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerDisplay.classList.add("hidden");
    activeRuleContainer.classList.add("hidden");
    nextButton.classList.add("hidden");
    startElection();
});

skipButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  skipButton.classList.add("hidden");
  nextButton.classList.remove("hidden");
});
