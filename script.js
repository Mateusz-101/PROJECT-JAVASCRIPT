let categories = JSON.parse(localStorage.getItem('categories')) || {};
let currentTest = { category: null, flashcards: [], index: 0, score: 0 };

function renderCategories() {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    Object.keys(categories).forEach(category => {
        const li = document.createElement('li');
        li.textContent = category;
        li.addEventListener('click', () => openCategory(category));
        categoryList.appendChild(li);
    });
}

function renderFlashcards(category) {
    const flashcardList = document.getElementById('flashcard-list');
    flashcardList.innerHTML = '';
    categories[category].forEach((flashcard, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Pytanie:</strong> ${flashcard.question} <br> <strong>Odpowiedź:</strong> ${flashcard.answer}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.addEventListener('click', () => deleteFlashcard(category, index));
        li.appendChild(deleteButton);
        flashcardList.appendChild(li);
    });
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function addCategory(name) {
    if (!categories[name]) {
        categories[name] = [];
        saveCategories();
        renderCategories();
    } else {
        alert('Kategoria już istnieje.');
    }
}

function addFlashcard(category, question, answer) {
    if (question && answer) {
        categories[category].push({ question, answer });
        saveCategories();
        renderFlashcards(category);
    } else {
        alert('Wypełnij oba pola, aby dodać fiszkę.');
    }
}

function deleteFlashcard(category, index) {
    categories[category].splice(index, 1);
    saveCategories();
    renderFlashcards(category);
}

function openCategory(category) {
    switchSection('flashcard-section');
    document.getElementById('flashcard-title').textContent = category;
    renderFlashcards(category);
    document.getElementById('add-flashcard').onclick = () => {
        const question = document.getElementById('question-input').value;
        const answer = document.getElementById('answer-input').value;
        addFlashcard(category, question, answer);
        document.getElementById('question-input').value = '';
        document.getElementById('answer-input').value = '';
    };
    document.getElementById('start-test').onclick = () => startTest(category);
}

function startTest(category) {
    currentTest.category = category;
    currentTest.flashcards = categories[category];
    currentTest.index = 0;
    currentTest.score = 0;
    switchSection('test-section');
    document.getElementById('test-title').textContent = category;
    showQuestion();
}

function showQuestion() {
    const flashcard = currentTest.flashcards[currentTest.index];
    document.getElementById('test-question').textContent = flashcard.question;
    document.getElementById('test-answer').value = '';
    document.getElementById('submit-answer').onclick = () => checkAnswer(flashcard.answer);
}

function checkAnswer(correctAnswer) {
    const userAnswer = document.getElementById('test-answer').value;
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        currentTest.score++;
        document.getElementById('test-result').textContent = 'Poprawna odpowiedź!';
        document.getElementById('test-result').className = 'correct';
    } else {
        document.getElementById('test-result').textContent = 'Błędna odpowiedź!';
        document.getElementById('test-result').className = 'wrong';
    }
    currentTest.index++;
    if (currentTest.index < currentTest.flashcards.length) {
        setTimeout(() => showQuestion(), 1000);
    } else {
        setTimeout(endTest, 1000);
    }
}

function endTest() {
    const result = `Twój wynik: ${currentTest.score} / ${currentTest.flashcards.length}`;
    document.getElementById('test-result').textContent = result;
    document.getElementById('test-result').classList.remove('correct', 'wrong');
    
    // Pokaż przycisk powrotu do strony głównej
    document.getElementById('back-to-home').style.display = 'block';
}

document.getElementById('add-category').onclick = () => {
    const categoryInput = document.getElementById('category-input').value;
    if (categoryInput) {
        addCategory(categoryInput);
        document.getElementById('category-input').value = '';
    } else {
        alert('Podaj nazwę kategorii.');
    }
};

document.getElementById('back-to-categories').onclick = () => switchSection('category-section');
document.getElementById('back-to-categories-from-test').onclick = () => switchSection('category-section');
document.getElementById('back-to-home').onclick = () => {
    switchSection('category-section');
    document.getElementById('back-to-home').style.display = 'none';  // Ukryj przycisk powrotu po przejściu
};

// Funkcja przełączająca widoczność sekcji
function switchSection(sectionId) {
    const sections = ['category-section', 'flashcard-section', 'test-section'];
    sections.forEach(id => {
        document.getElementById(id).style.display = (id === sectionId) ? 'block' : 'none';
    });
}

switchSection('category-section');

