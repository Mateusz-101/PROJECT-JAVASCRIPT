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
        deleteButton.addEventListener('click', () => {
            deleteFlashcard(category, index);
        });
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
    document.getElementById('category-section').style.display = 'none';
    document.getElementById('flashcard-section').style.display = 'block';
    document.getElementById('flashcard-title').textContent = `Fiszki z kategorii: ${category}`;
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
    currentTest.flashcards = shuffleArray([...categories[category]]);
    currentTest.index = 0;
    currentTest.score = 0;
    document.getElementById('flashcard-section').style.display = 'none';
    document.getElementById('test-section').style.display = 'block';
    renderTestQuestion();
}

function renderTestQuestion() {
    if (currentTest.index < currentTest.flashcards.length) {
        const flashcard = currentTest.flashcards[currentTest.index];
        document.getElementById('test-question').textContent = `Pytanie: ${flashcard.question}`;
        document.getElementById('test-answer').value = '';
        document.getElementById('test-result').textContent = '';
    } else {
        endTest();
    }
}

function submitAnswer() {
    const userAnswer = document.getElementById('test-answer').value.trim();
    const correctAnswer = currentTest.flashcards[currentTest.index].answer;
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        currentTest.score++;
        document.getElementById('test-result').textContent = 'Poprawna odpowiedź!';
    } else {
        document.getElementById('test-result').textContent = `Błędna odpowiedź! Poprawna: ${correctAnswer}`;
    }
    currentTest.index++;
    setTimeout(renderTestQuestion, 1000);
}

function endTest() {
    document.getElementById('test-question').textContent = `Test zakończony! Twój wynik: ${currentTest.score}/${currentTest.flashcards.length}`;
    document.getElementById('test-answer').style.display = 'none';
    document.getElementById('submit-answer').style.display = 'none';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.getElementById('add-category').addEventListener('click', () => {
    const categoryName = document.getElementById('category-input').value.trim();
    if (categoryName) {
        addCategory(categoryName);
        document.getElementById('category-input').value = '';
    } else {
        alert('Wprowadź nazwę kategorii.');
    }
});

document.getElementById('back-to-categories').addEventListener('click', () => {
    document.getElementById('flashcard-section').style.display = 'none';
    document.getElementById('category-section').style.display = 'block';
    renderCategories();
});

document.getElementById('submit-answer').addEventListener('click', submitAnswer);
document.getElementById('end-test').addEventListener('click', () => {
    document.getElementById('test-section').style.display = 'none';
    document.getElementById('category-section').style.display = 'block';
    renderCategories();
});

// Inicjalizacja
renderCategories();
