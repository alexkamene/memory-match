document.addEventListener('DOMContentLoaded', function () {
    const startGameBtn = document.querySelector('.start-game-btn');
    const helpBtn = document.querySelector('.help-btn');
    const helpModal = document.getElementById('helpModal');
    const closeModalSpan = document.querySelector('.close');
    const gameContainer = document.querySelector('.memory-game');
    const timerDisplay = document.getElementById('time');
    const levelDisplay = document.getElementById('level');
    let countdown;
    let currentLevel = 1;
    let matchedPairs = 0;
    const levels = {
        1: { cardPairs: 4, time: 60 },
        2: { cardPairs: 6, time: 50 },
        3: { cardPairs: 8, time: 40 },
    };

    // Function to shuffle cards
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    // Function to create card elements
    function createCard(value) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.innerHTML = `<div class="front-face">${value}</div><div class="back-face">?</div>`;
        return card;
    }

    function startGame() {
        let levelConfig = levels[currentLevel];
        gameContainer.innerHTML = '';
        gameContainer.style.visibility = 'visible';
        matchedPairs = 0;
        createDeck(levelConfig.cardPairs);
        startTimer(levelConfig.time);
        levelDisplay.textContent = `Level ${currentLevel}`;
    }

    function createDeck(cardPairs) {
        const cardValues = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥥'].slice(0, cardPairs);
        let cards = [...cardValues, ...cardValues];
        shuffle(cards);

        cards.forEach(value => {
            const cardElement = createCard(value);
            cardElement.addEventListener('click', flipCard);
            gameContainer.appendChild(cardElement);
        });
    }

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.value === secondCard.dataset.value;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
        matchedPairs++;
        if (matchedPairs === levels[currentLevel].cardPairs) {
            setTimeout(() => gameOver(true), 500);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard, firstCard, secondCard] = [false, false, null, null];
    }

    function startTimer(duration) {
        clearInterval(countdown);
        timerDisplay.textContent = duration;
        countdown = setInterval(() => {
            duration--;
            timerDisplay.textContent = duration;
            if (duration <= 0) {
                clearInterval(countdown);
                gameOver(false);
            }
        }, 1000);
    }

    function gameOver(win) {
        gameContainer.style.visibility = 'hidden';
        clearInterval(countdown);
        if (win) {
            alert(`Congratulations! You've completed Level ${currentLevel}.`);
            currentLevel = currentLevel < Object.keys(levels).length ? currentLevel + 1 : 1; // Reset or advance level
        } else {
            alert("Time's up! Try again.");
        }
        startGameBtn.style.display = 'block'; // Show start button again
    }

    // Event listeners
    startGameBtn.addEventListener('click', () => {
        startGameBtn.style.display = 'none';
        startGame();
    });

    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });

    closeModalSpan.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });
});
