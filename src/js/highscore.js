import { getTopScores } from './data-api/scores';

async function displayHighScores() {
  const scores = await getTopScores();
  const scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = scores
        .map((s, i) => `<li>${i + 1}. ${s.name} <span style="float:right;">${s.score}</li>`)
    .join('');
}

displayHighScores();
