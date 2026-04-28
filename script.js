let score = 0;

function checkAnswer(choice) {
  const result = document.getElementById("result");

  if (choice === 2) {
    result.textContent = "✅ Правильно!";
    score++;
  } else {
    result.textContent = "❌ Неправильно";
  }

  document.getElementById("score").textContent = score;
}
