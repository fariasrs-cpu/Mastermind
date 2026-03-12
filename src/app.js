import { generateSecret, evaluateGuess, validateGuess } from './logic.js';

// --- State Management ---
let state = {
    p1: { name: '', attempts: [], found: false },
    p2: { name: '', attempts: [], found: false },
    currentPlayer: 1,
    secret: '',
    config: {
        digits: 6,
        allowRepeats: false,
        maxAttempts: 10,
        mode: 'auto'
    },
    gameActive: false
};

// --- DOM Elements ---
const screens = {
    start: document.getElementById('start-screen'),
    secret: document.getElementById('secret-screen'),
    game: document.getElementById('game-screen'),
    end: document.getElementById('end-screen')
};

const forms = {
    setup: document.getElementById('setup-form'),
    secret: document.getElementById('secret-form'),
    guess: document.getElementById('guess-form')
};

const els = {
    p1Name: document.getElementById('p1-name'),
    p2Name: document.getElementById('p2-name'),
    mode: document.getElementById('mode'),
    allowRepeats: document.getElementById('allow-repeats'),
    manualSecret: document.getElementById('manual-secret'),
    secretError: document.getElementById('secret-error'),
    currentPlayerDisplay: document.getElementById('current-player'),
    remainingDisplay: document.getElementById('remaining'),
    guessInput: document.getElementById('guess-input'),
    guessError: document.getElementById('guess-error'),
    historyList: document.getElementById('history-list'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    finalStats: document.getElementById('final-stats'),
    restartBtn: document.getElementById('restart-btn')
};

function init() {
    loadPersistence();
    showScreen('start');

    forms.setup.addEventListener('submit', handleSetup);
    forms.secret.addEventListener('submit', handleSecretDefinition);
    forms.guess.addEventListener('submit', handleGuess);
    els.restartBtn.addEventListener('click', () => {
        resetState();
        showScreen('start');
    });
}

function loadPersistence() {
    const saved = localStorage.getItem('mastermind_config');
    if (saved) {
        const parsed = JSON.parse(saved);
        els.p1Name.value = parsed.p1Name || '';
        els.p2Name.value = parsed.p2Name || '';
        els.mode.value = parsed.mode || 'auto';
        els.allowRepeats.checked = parsed.allowRepeats || false;
    }
}

function savePersistence() {
    const config = {
        p1Name: state.p1.name,
        p2Name: state.p2.name,
        mode: state.config.mode,
        allowRepeats: state.config.allowRepeats
    };
    localStorage.setItem('mastermind_config', JSON.stringify(config));
}

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[screenId].classList.remove('hidden');
}

function handleSetup(e) {
    e.preventDefault();
    state.p1.name = els.p1Name.value;
    state.p2.name = els.p2Name.value;
    state.config.mode = els.mode.value;
    state.config.allowRepeats = els.allowRepeats.checked;

    savePersistence();

    if (state.config.mode === 'manual') {
        document.getElementById('secret-prompt').textContent = `${state.p1.name}, define el código para la partida`;
        showScreen('secret');
    } else {
        state.secret = generateSecret({ digits: 6, allowRepeats: state.config.allowRepeats });
        startGame();
    }
}

function handleSecretDefinition(e) {
    e.preventDefault();
    const val = els.manualSecret.value;
    const validation = validateGuess(val, 6, state.config.allowRepeats);

    if (!validation.isValid) {
        els.secretError.textContent = validation.message;
        return;
    }

    state.secret = val;
    els.secretError.textContent = '';
    startGame();
}

function handleGuess(e) {
    e.preventDefault();
    if (!state.gameActive) return;

    const val = els.guessInput.value;
    const validation = validateGuess(val, 6, state.config.allowRepeats);

    if (!validation.isValid) {
        els.guessError.textContent = validation.message;
        return;
    }

    els.guessError.textContent = '';
    const result = evaluateGuess(state.secret, val);
    const currentPlayerObj = state[`p${state.currentPlayer}`];

    currentPlayerObj.attempts.push({ guess: val, result });
    if (result.exact === 6) {
        currentPlayerObj.found = true;
    }

    els.guessInput.value = '';

    checkGameEnd();
}

function checkGameEnd() {
    const p1 = state.p1;
    const p2 = state.p2;

    const roundFinished = (p1.attempts.length === p2.attempts.length);

    if (roundFinished) {
        if (p1.found || p2.found || p1.attempts.length >= state.config.maxAttempts) {
            endGame();
            return;
        }
    }

    switchTurn();
}

function startGame() {
    state.gameActive = true;
    state.currentPlayer = 1;
    state.p1.attempts = [];
    state.p2.attempts = [];
    state.p1.found = false;
    state.p2.found = false;
    updateUI();
    showScreen('game');
}

function switchTurn() {
    state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
    updateUI();
}

function updateUI() {
    const p = state[`p${state.currentPlayer}`];
    els.currentPlayerDisplay.textContent = p.name;
    els.remainingDisplay.textContent = state.config.maxAttempts - p.attempts.length;
    renderHistory();
}

function renderHistory() {
    const p = state[`p${state.currentPlayer}`];
    els.historyList.innerHTML = '';

    [...p.attempts].reverse().forEach(att => {
        const item = document.createElement('div');
        item.className = 'history-item';

        const guessSpan = document.createElement('span');
        guessSpan.className = 'guess-text';
        guessSpan.textContent = att.guess;

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'feedback';

        for (let i = 0; i < att.result.exact; i++) {
            const peg = document.createElement('span');
            peg.className = 'peg exact';
            feedbackDiv.appendChild(peg);
        }
        for (let i = 0; i < att.result.partial; i++) {
            const peg = document.createElement('span');
            peg.className = 'peg partial';
            feedbackDiv.appendChild(peg);
        }

        item.appendChild(guessSpan);
        item.appendChild(feedbackDiv);
        els.historyList.appendChild(item);
    });
}

function endGame() {
    state.gameActive = false;
    showScreen('end');

    const p1 = state.p1;
    const p2 = state.p2;
    let winnerMessage = '';

    if (p1.found && !p2.found) {
        winnerMessage = `¡Ganador: ${p1.name}!`;
    } else if (p2.found && !p1.found) {
        winnerMessage = `¡Ganador: ${p2.name}!`;
    } else if (p1.found && p2.found) {
        if (p1.attempts.length < p2.attempts.length) winnerMessage = `¡Ganador: ${p1.name}!`;
        else if (p2.attempts.length < p1.attempts.length) winnerMessage = `¡Ganador: ${p2.name}!`;
        else winnerMessage = '¡Empate!';
    } else {
        const b1 = getBestAttempt(p1.attempts);
        const b2 = getBestAttempt(p2.attempts);

        if (b1.exact > b2.exact) winnerMessage = `¡Ganador: ${p1.name}!`;
        else if (b2.exact > b1.exact) winnerMessage = `¡Ganador: ${p2.name}!`;
        else if (b1.partial > b2.partial) winnerMessage = `¡Ganador: ${p1.name}!`;
        else if (b2.partial > b1.partial) winnerMessage = `¡Ganador: ${p2.name}!`;
        else winnerMessage = '¡Empate!';
    }

    els.resultMessage.textContent = winnerMessage;
    els.finalStats.innerHTML = `
        <p>El código secreto era: <strong>${state.secret}</strong></p>
        <div class="stats-grid">
            <div>
                <strong>${p1.name}</strong><br>
                Intentos: ${p1.attempts.length}<br>
                ${p1.found ? '✅ Acertó' : '❌ No acertó'}
            </div>
            <div>
                <strong>${p2.name}</strong><br>
                Intentos: ${p2.attempts.length}<br>
                ${p2.found ? '✅ Acertó' : '❌ No acertó'}
            </div>
        </div>
    `;
}

function getBestAttempt(attempts) {
    if (attempts.length === 0) return { exact: 0, partial: 0 };
    return attempts.reduce((best, curr) => {
        if (curr.result.exact > best.exact) return curr.result;
        if (curr.result.exact === best.exact && curr.result.partial > best.partial) return curr.result;
        return best;
    }, { exact: 0, partial: 0 });
}

function resetState() {
    state.p1.attempts = [];
    state.p2.attempts = [];
    state.p1.found = false;
    state.p2.found = false;
    state.currentPlayer = 1;
    state.secret = '';
    els.guessInput.value = '';
    els.manualSecret.value = '';
    els.guessError.textContent = '';
    els.secretError.textContent = '';
}

init();
