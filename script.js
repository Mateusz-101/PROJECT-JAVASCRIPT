let startTime;
let attempts = 0;
let passwordLength;
let guessedPassword = "";
let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"; 
let histogramData = [];
let currentPassword = ""; // Nowa zmienna do przechowywania hasła
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let historyData = []; // Nowa zmienna do przechowywania historii prób

function startGuessing() {
    const password = document.getElementById("password").value;
    if (!password) {
        document.getElementById("output").innerText = "Proszę wpisać hasło.";
        return;
    }

    if (password !== currentPassword) { // Sprawdzamy, czy hasło się zmieniło
        currentPassword = password; // Przypisujemy nowe hasło
        resetGame();
    }

    passwordLength = password.length;
    guessedPassword = "";
    attempts = 0;
    histogramData = [];
    document.getElementById("histogram").innerHTML = "";
    document.getElementById("time").innerText = "";

    startTime = new Date();
    historyData = []; // Resetowanie historii przy każdym nowym zgadywaniu
    guessNextCharacter(password);
}

function resetGame() {
    // Funkcja resetująca stan gry
    document.getElementById("output").innerText = "";
    document.getElementById("time").innerText = "";
    document.getElementById("histogram").innerHTML = "";
    histogramData = [];
    document.getElementById("history").innerHTML = ""; // Resetowanie historii
}

function guessNextCharacter(password) {
    let currentIndex = guessedPassword.length;

    if (currentIndex < passwordLength) {
        let currentGuess = ""; // Do przechowywania prób zgadywania
        let correctGuesses = [];
        let incorrectGuesses = [];
        
        for (let i = 0; i < characters.length; i++) {
            attempts++;
            if (characters[i] === password[currentIndex]) {
                guessedPassword += characters[i];
                correctGuesses.push(characters[i]);
                break;
            } else {
                incorrectGuesses.push(characters[i]);
            }
        }

        // Zaktualizowanie historii prób
        historyData.push({
            correct: correctGuesses.join(''),
            incorrect: incorrectGuesses.join(''),
            currentGuess: guessedPassword
        });
        updateHistory();

        // Zaktualizowanie histogramu
        histogramData.push(attempts);
        updateHistogram();

        if (guessedPassword.length < passwordLength) {
            setTimeout(() => guessNextCharacter(password), 50); // Kontynuuj zgadywanie
        } else {
            const endTime = new Date();
            const timeTaken = endTime - startTime; // Czas w milisekundach

            const score = calculateScore(attempts, timeTaken);
            document.getElementById("output").innerText = 
                `Hasło odgadnięte: "${guessedPassword}" w ${attempts} próbach!`;
            document.getElementById("time").innerText = `Czas zgadywania: ${timeTaken / 1000} sekund`;

            saveScore(timeTaken, attempts, score);
            showLeaderboard();
        }
    }
}

function updateHistogram() {
    const histogramContainer = document.getElementById("histogram");
    histogramContainer.innerHTML = ''; // Wyczyść poprzedni histogram

    // Zaktualizuj histogram prób
    histogramData.forEach((attempt, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(attempt / (characters.length * passwordLength)) * 100}%`;
        histogramContainer.appendChild(bar);
    });
}

function updateHistory() {
    const historyContainer = document.getElementById("history");
    historyContainer.innerHTML = ''; // Wyczyść poprzednią historię

    historyData.forEach((entry, index) => {
        const div = document.createElement("div");
        div.innerHTML = `<strong>Próba ${index + 1}:</strong><br>
            <strong>Poprawne:</strong> ${entry.correct}<br>
            <strong>Błędne:</strong> ${entry.incorrect}<br>
            <strong>Aktualny stan:</strong> ${entry.currentGuess}<br><br>`;
        historyContainer.appendChild(div);
    });
}

function calculateScore(attempts, timeTaken) {
    // 1 punkt za każdą próbę
    let points = attempts; 

    // 1 punkt za każdą milisekundę
    points += timeTaken; 

    return points;
}

function saveScore(timeTaken, attempts, score) {
    const userName = prompt("Podaj swoją nazwę użytkownika:");
    const newScore = { user: userName, time: timeTaken / 1000, attempts: attempts, score: score };

    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b.score - a.score); // Sortuj po punktach
    leaderboard = leaderboard.slice(0, 50); // Trzymaj tylko top 5

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function showLeaderboard() {
    const leaderboardContainer = document.getElementById("leaderboard");
    leaderboardContainer.innerHTML = ""; // Wyczyść poprzedni ranking

    leaderboard.forEach((entry, index) => {
        const li = document.createElement("li");
        
        // Dodanie kolorów w zależności od punktów
        let scoreClass = '';
        let scoreText = '';
        if (entry.score <= 1000) {
            scoreClass = 'low-score';
            scoreText = ' - Słabe hasło';
        } else if (entry.score <= 2000) {
            scoreClass = 'medium-score';
            scoreText = ' - Średnie hasło';
        } else {
            scoreClass = 'high-score';
            scoreText = ' - Trudne hasło';
        }

        li.className = scoreClass;
        li.textContent = `${index + 1}. ${entry.user} - ${entry.score} punktów (Czas: ${entry.time}s, Próby: ${entry.attempts})${scoreText}`;
        leaderboardContainer.appendChild(li);
    });
}

// Wyświetl leaderboard przy załadowaniu strony
window.onload = function() {
    showLeaderboard();
};