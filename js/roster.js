function getClassImage(playerClass){

    return `assets/classes/${playerClass.toLowerCase()}.png`;

}

function renderRoster(){

    console.log("renderRoster called");
    console.log(guildMembers);

    const table = document.getElementById("rosterTable");

    table.innerHTML = "<h3>TEST</h3>";

}

    

    guildMembers.forEach(player=>{

        const card = document.createElement("div");

        card.className = `player-card ${player.class.toLowerCase()}`;

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

        table.appendChild(card);

    });

}
