let score = 0;

const questions = [
  {
    good: "Хороший контраст и отступы",
    bad: "Текст слишком мелкий"
  },
  {
    good: "Читаемый контраст",
    bad: "Плохой контраст: серый на сером"
  },
  {
    good: "Чистая структура и воздух",
    bad: "Слишком много текста без отступов"
  },
  {
    good: "Кнопка хорошо выделена",
    bad: "Кнопка сливается с фоном"
  }
];

let currentQuestion;
let correctAnswer;

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
}

function checkAnswer(choice) {
  const result = document.getElementById("result");

  if (choice === correctAnswer) {
    result.textContent = "✅ Правильно!";
    score++;
  } else {
    result.textContent = "❌ Неправильно";
  }

  document.getElementById("score").textContent = score;

  setTimeout(loadQuestion, 900);
}

loadQuestion();
