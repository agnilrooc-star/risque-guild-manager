function getClassImage(playerClass){

    return `assets/classes/${playerClass.toLowerCase()}.png`;

}

function getClassCSS(playerClass){

    return playerClass.toLowerCase();

}

function renderPlayerPool(){

    const pool = document.getElementById("playerPool");

    pool.innerHTML = "";

    document.getElementById("playerCount").innerText =
        `${playerPool.length} Players`;

    playerPool.forEach(player=>{

        const card = document.createElement("div");

        card.dataset.ign = player.ign;

        card.className = `player-card ${getClassCSS(player.class)}`;

        card.innerHTML = `

            ${player.elite ? '<div class="elite">⭐</div>' : ''}

            <img
                class="player-icon"
                src="${getClassImage(player.class)}"
                alt="${player.class}"
            >

            <div class="player-name">

                ${player.ign}

            </div>

            <div class="player-role">

                ${player.role}

            </div>

            <div class="player-gs">

                🏆 ${player.gear}

            </div>

        `;

        pool.appendChild(card);

    });

}

