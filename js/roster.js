// =====================================
// GUILD ROSTER
// =====================================

function getRosterClassImage(playerClass){

    const cls = (playerClass || "unknown").toLowerCase();

    return `assets/classes/${cls}.png`;

}

function renderRoster(){

    const table = document.getElementById("rosterTable");

    if(!table){

        console.error("rosterTable not found");

        return;

    }

    table.innerHTML = "";

    if(!guildMembers || guildMembers.length === 0){

        table.innerHTML = `
            <div style="color:white;padding:20px;">
                No guild members found.
            </div>
        `;

        return;

    }

    guildMembers.forEach(player=>{

        const card = document.createElement("div");

        card.className = `player-card ${(player.class || "").toLowerCase()}`;

        card.innerHTML = `

            <img
                class="player-icon"
                src="${getRosterClassImage(player.class)}"
                alt="${player.class}"
            >

            <div class="player-info">

                <div class="player-name">

                    ${player.ign}

                </div>

                <div class="player-class">

                    ${player.class}

                </div>

                <div class="player-role">

                    ${player.role}

                </div>

                <div class="player-gs">

                    GS ${player.gear || "-"}

                </div>

            </div>

        `;

        table.appendChild(card);

    });

}
