/* Reads dynamic values from interface and applies them to pages */

import * as DynamicContent from './interface/dynamic-content.js';

document.addEventListener('DOMContentLoaded', () => {
    const dailyGame = document.getElementById('daily-game');
    if (dailyGame) {
        dailyGame.style.backgroundImage = `url(${DynamicContent.GAME_DAILY_PREVIEW})`;
        dailyGame.style.backgroundPosition = 'center';
        dailyGame.style.backgroundSize = 'cover';

        const label = dailyGame.querySelector('.game-card-label');
        if (label) label.innerHTML = label.innerHTML.replace('{GAME_TITLE}', DynamicContent.GAME_DAILY_TITLE);
    }

    const weeklyGame = document.getElementById('weekly-game');
    if (weeklyGame) {
        weeklyGame.style.backgroundImage = `url(${DynamicContent.GAME_WEEKLY_PREVIEW})`;
        weeklyGame.style.backgroundPosition = 'center';
        weeklyGame.style.backgroundSize = 'cover';

        const label = weeklyGame.querySelector('.game-card-label');
        if (label) label.innerHTML = label.innerHTML.replace('{GAME_TITLE}', DynamicContent.GAME_WEEKLY_TITLE);
    }

    Array.from(document.getElementsByClassName('site-header')).forEach(header => {
        header.style.backgroundImage = `url(${DynamicContent.HEADER_BANNER})`;
    });
});
