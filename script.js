let score = 0;

const questions = [
  {
    a: "Текст слишком мелкий",
    b: "Хороший контраст и отступы",
    correct: 2
  },
  {
    a: "Плохой контраст (серый на сером)",
    b: "Читаемый контраст",
    correct: 2
  },
  {
    a: "Слишком много текста без отступов",
    b: "Чистая структура и воздух",
    correct: 2
  },
  {
    a: "Кнопка сливается с фоном",
    b: "Кнопка хорошо выделена",
    correct: 2
  }
];

let current = 0;

function loadQuestion() {
  const q = questions[current];

  document.querySelectorAll(".card h3")[0].textContent = "Вариант A";
  document.querySelectorAll(".card h3")[1].textContent = "Вариант B";

  document.querySelectorAll(".box")[0].textContent = q.a;
  document.querySelectorAll(".box")[1].textContent = q.b;

  document.getElementById("result").textContent = "";
}

function checkAnswer(choice) {
  const q = questions[current];
  const result = document.getElementById("result");

  if (choice === q.correct) {
    result.textContent = "✅ Правильно!";
    score++;
  } else {
    result.textContent = "❌ Неправильно";
  }

  document.getElementById("score").textContent = score;

  current = (current + 1) % questions.length;

  setTimeout(loadQuestion, 1000);
}

loadQuestion();
