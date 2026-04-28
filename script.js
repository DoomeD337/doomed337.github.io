let score = 0;
let time = 10;
let timer;

const questions = [
  {
    good: `
      <div class="mock-title"></div>
      <div class="mock-text"></div>
      <div class="mock-text short"></div>
      <div class="mock-button">Начать</div>
    `,
    bad: `
      <div class="mock-title"></div>
      <div class="mock-text"></div>
      <div class="mock-text short"></div>
      <div class="mock-button">Начать</div>
    `
  }
];

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
  const goodOnLeft = Math.random() > 0.5;
  correctAnswer = goodOnLeft ? 1 : 2;

  const previewA = document.getElementById("previewA");
  const previewB = document.getElementById("previewB");

  previewA.className = "ui-preview";
  previewB.className = "ui-preview";

  if (goodOnLeft) {
    previewA.innerHTML = questions[0].good;
    previewB.innerHTML = questions[0].bad;
    previewB.classList.add("bad-ui");
  } else {
    previewA.innerHTML = questions[0].bad;
    previewA.classList.add("bad-ui");
    previewB.innerHTML = questions[0].good;
  }

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

  const best = Number(localStorage.getItem("best") || 0);

  if (score > best) {
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
