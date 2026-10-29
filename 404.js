// unchangeable shortcuts to html elements
const startButton = document.getElementById('start-game');
const closeButton = document.getElementById('close-game');
const restartButton = document.getElementById('restart-game');
const game = document.getElementById('typing-game');
const input = document.getElementById('game-input');
const wordDisplay = document.getElementById('game-word');
const scoreDisplay = document.getElementById('game-score');
const livesDisplay = document.getElementById('game-lives');
const messageDisplay = document.getElementById('game-message');
const secretPopup = document.getElementById('secret-popup');
const secretPopupText = document.getElementById('secret-popup-text');
const secretPopupImage = document.getElementById('secret-popup-image');

// this variables will change during game
let wordGroups = null;
let currentEntry = null;
let currentWord = '';
let previousWord = '';
let progress = '';
let score = 0;
let lives = 4;
let active = false;
let sessionId = 0;
let secretTimer = null;

// List of various error messages encountered when uploading a CSV file

const databaseErrorMessages = [
    'OUR APOLOGIES, NETRUNNER',
    'PLEASE TRY AGAIN LATER',
    'YOUR PATIENCE IS APPRECIATED',
    'SORRY, THE CONNECTION WAS LOST',
    'AN UNEXPECTED ERROR HAS OCCURRED',
    'EVEN MACHINES HAVE BAD DAYS',
    'ACCESS DENIED BY AN UNKNOWN FORCE',
    'WE WILL RETURN TO THE NETWORK SOON'
];

// Secret GIFs appear when you type in certain words

const secretWords = {
    johnnysilverhand: {
        text: 'LEGEND DETECTED // JOHNNY SILVERHAND',
        image: '/images/secret.gif',
        alt: 'Johnny Silverhand',
        duration: 5060
    },

    david: {
        text: 'FACING REALITY // NO ONE ESCAPES NIGHT CITY',
        image: '/images/david.gif',
        alt: 'David Martinez',
        duration: 9500
    },

    lucy: {
        text: 'MOONBOUND // I REALLY WANT TO STAY AT YOUR HOUSE',
        image: '/images/lucy.gif',
        alt: 'Lucy Kushinada',
        duration: 8800
    },    
    
    blackwall: {
        text: 'FIREWALL BREACHED // ROGUE AI DETECTED',
        image: '/images/blackwall.gif',
        alt: 'blackwall',
        duration: 9000
    },

    rebecca: {
        text: 'LOYAL TO THE END // ARE YOU STILL HERE?',
        image: '/images/rebecca.gif',
        alt: 'Rebecca',
        duration: 3400
    },
};

// template for all status messages

function showMessage(text, type = '') {
    messageDisplay.textContent = text;
    messageDisplay.className = `game-message ${type}`;
}

// hp counter 

function updateStats() {
    scoreDisplay.textContent = String(score).padStart(4, '0');
    livesDisplay.textContent = '♥ '.repeat(lives) + '♡ '.repeat(4 - lives);
}

// split the word into individual elements, creating a separate cell for each one

function renderWord() {
    wordDisplay.replaceChildren();
    [...currentWord.toUpperCase()].forEach((letter, index) => {
        const character = document.createElement('span');
        character.className = index < progress.length ? 'game-letter typed' : 'game-letter';
        character.textContent = letter;
        wordDisplay.appendChild(character);
    });
}

function selectWord() {
    const choices = wordGroups.filter(entry => entry.word !== previousWord);
    const pool = choices.length ? choices : wordGroups;

    currentEntry = pool[Math.floor(Math.random() * pool.length)];
    currentWord = currentEntry.word;
    previousWord = currentWord;

    progress = '';
    input.value = '';

    renderWord();
}

function endGame() {
    active = false;
    input.disabled = true;
    restartButton.hidden = false;
    showMessage(`SYSTEM FAILURE // FINAL SCORE: ${score}`, 'failure');
}

function makeMistake() {
    lives = Math.max(0, lives - 1);

    updateStats();

    if (lives === 0) {
        endGame();
    } else {
        selectWord();
        showMessage(`INPUT REJECTED // NEW WORD // ${lives} LIVES REMAINING`, 'failure');
    }
}

function completeWord() {
    score += currentEntry.points;
    updateStats();

    if (secretWords[currentWord]) {
        showSecret(currentWord);
        showMessage('SECRET DETECTED // BONUS VISUAL UNLOCKED', 'success');
    } else {
        showMessage('ACCESS GRANTED // NEXT WORD', 'success');
    }

    selectWord();
}

function showSecret(word) {
    const secret = secretWords[word];

    if (!secret) {
        return;
    }

    secretPopupText.textContent = secret.text;
    secretPopupImage.src = secret.image;
    secretPopupImage.alt = secret.alt;
    secretPopup.hidden = false;

    if (secretTimer !== null) {
        clearTimeout(secretTimer);
    }

    secretTimer = setTimeout(() => {
        secretPopup.hidden = true;
        secretPopupImage.src = '';
        secretPopupImage.alt = '';
        secretTimer = null;
    }, secret.duration);
}

function acceptCharacter(character) {
    if (!active) return;
    if (character.toLowerCase() !== currentWord[progress.length]) {
        makeMistake();
        return;
    }
    progress += character.toLowerCase();
    input.value = progress.toUpperCase();
    renderWord();
    if (progress.length === currentWord.length) completeWord();
    else showMessage('UPLINK ACTIVE // KEEP TYPING');
}

// Explanation for the teacher: 
// About 63% of the code in the `loadWords()` function is not mine. 
// The friend of mine provided significant help with this part.

async function loadWords() {
    if (wordGroups) return;

    const response = await fetch('/words.csv', {cache: 'no-store'});

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const csvText = (await response.text()).replace(/^\uFEFF/, '');
    const rows = csvText.trim().split(/\r?\n/);

    if (rows.shift().trim() !== 'length,word,points') {
        throw new Error('Invalid CSV header.');
    }

    const words = [];
    const usedWords = new Set();

    for (const row of rows) {
        if (!row.trim()) continue;

        const fields = row.split(',').map(value => value.trim());

        if (fields.length !== 3) {
            throw new Error(`Invalid CSV row: ${row}`);
        }

        const [lengthText, word, pointsText] = fields;

        const length = Number(lengthText);
        const points = Number(pointsText);
        
        // It verifies the correctness of the data obtained from the file.

        if (!/^[a-z]+$/.test(word) ||
            !Number.isInteger(length) ||
            length !== word.length ||
            !Number.isSafeInteger(points) ||
            points <= 0 ||
            usedWords.has(word)) {

            throw new Error(`Invalid CSV entry: ${row}`);
        }

        usedWords.add(word);

        words.push({
            word: word,
            length: length,
            points: points
        });
    }

    if (words.length === 0) {
        throw new Error('Word database is empty.');
    }

    wordGroups = words;
}

// Launches the game with clean default settings. 
// Checks for errors and displays corresponding messages in the windows that appear.

async function startGame() {
    const mySession = ++sessionId;
    game.hidden = false;
    startButton.hidden = true;
    restartButton.hidden = true;

    secretPopup.hidden = true;
    secretPopupImage.src = '';
    secretPopupImage.alt = '';

    if (secretTimer !== null) {
        clearTimeout(secretTimer);
        secretTimer = null;
    }

    input.disabled = true;
    active = false;
    showMessage('LOADING WORD DATABASE_');
    try {
        await loadWords();
    } catch (error) {

        if (mySession !== sessionId) return;

        console.error('Failed to load words:', error);

        const randomIndex = Math.floor(Math.random() * databaseErrorMessages.length);
        const randomMessage = databaseErrorMessages[randomIndex];

        showMessage(
            `WORD DATABASE UNAVAILABLE // ${randomMessage}`,
            'failure'
        );

        startButton.hidden = false;
        startButton.focus();
        return;
    }

    if (mySession !== sessionId) return;
    score = 0;
    lives = 4;
    previousWord = '';
    active = true;
    input.disabled = false;
    updateStats();
    selectWord();
    showMessage('UPLINK ESTABLISHED // START TYPING');
    input.focus();
}

function closeGame() {
    sessionId++;
    active = false;
    game.hidden = true;
    input.disabled = true;
    input.value = '';
    startButton.hidden = false;
    startButton.focus();

    secretPopup.hidden = true;
    secretPopupImage.src = '';
    secretPopupImage.alt = '';

    if (secretTimer !== null) {
        clearTimeout(secretTimer);
        secretTimer = null;
    }
}

// Keyboard input for desktops. 
// Ignoring navigation and modifier shortcuts.
input.addEventListener('keydown', event => {
    if (!active || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    if (event.key.length === 1 && /^[a-z]$/i.test(event.key)) {
        event.preventDefault();
        acceptCharacter(event.key);
    } else if (event.key === 'Backspace' || event.key === 'Delete' ||
               (event.key.length === 1 && event.key !== ' ')) {
        event.preventDefault();
        makeMistake();
    }
});

input.addEventListener('paste', event => event.preventDefault());
input.addEventListener('drop', event => event.preventDefault());
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
closeButton.addEventListener('click', closeGame);
