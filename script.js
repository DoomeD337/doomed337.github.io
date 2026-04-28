let score = 0;
let time = 10;
let timer;

const questions = [
  { good: "Хороший контраст и отступы", bad: "Текст слишком мелкий" },
  { good: "Читаемый контраст", bad: "Плохой контраст: серый на сером" },
  { good: "Чистая структура и воздух", bad: "Слишком много текста без отступов" },
  { good: "Кнопка хорошо выделена", bad: "Кнопка сливается с фоном" }
];

let currentQuestion;
let correctAnswer;

const bestScore = localStorage.getItem("best") || 0;
document.getElementById("best").textContent = bestScore;

function startTimer() {
  clearInterval(timer);
  time = 10;
  document.getElementById("time").textContent = time;

  timer = setInterval(() => {
    time--;
    document.getElementById("time").textContent = time;

    if (time <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function loadQuestion() {
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];

  const goodOnLeft = Math.random() > 0.5;
  correctAnswer = goodOnLeft ? 1 : 2;

  document.querySelectorAll(".box")[0].textContent = goodOnLeft
    ? currentQuestion.good
    : currentQuestion.bad;

  document.querySelectorAll(".box")[1].textContent = goodOnLeft
    ? currentQuestion.bad
    : currentQuestion.good;

  document.getElementById("result").textContent = "";

  startTimer();
}

function checkAnswer(choice) {
  if (time <= 0) return;

  const result = document.getElementById("result");

  if (choice === correctAnswer) {
    result.textContent = "✅ Правильно!";
    score++;
  } else {
    result.textContent = "❌ Неправильно";
  }

  document.getElementById("score").textContent = score;

  clearInterval(timer);
  setTimeout(loadQuestion, 700);
}

function endGame() {
  document.getElementById("result").textContent = "⏰ Время вышло!";

  if (score > bestScore) {
    localStorage.setItem("best", score);
    document.getElementById("best").textContent = score;
  }

  setTimeout(() => {
    score = 0;
    document.getElementById("score").textContent = score;
    loadQuestion();
  }, 2000);
}

loadQuestion();
