import { getTopScores } from './data-api/scores';

async function displayHighScores() {
    const scoreboard = document.getElementById('game-scoreboard');
    try {
        const scores = await getTopScores();
        
        if (!scores.length) {
            scoreboard.textContent = "No scores available."
            return
        }

        scoreboard.innerHTML = scores
            .map((s, i) => `<li>${i + 1}. ${s.name} <span style="float:right;">${s.score}</li>`)
            .join('');
    } catch (err) {
        scoreboard.textContent = "Error loading scores..."
    }
}

displayHighScores();
