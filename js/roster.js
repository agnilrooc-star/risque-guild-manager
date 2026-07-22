// =========================================
// ROSTER HELPERS
// =========================================

function getRosterClassImage(playerClass) {

    const safeClass =
        String(playerClass || "unknown")
            .trim()
            .toLowerCase();

    return `assets/classes/${safeClass}.png`;
}


function getRosterClassCSS(playerClass) {

    return String(playerClass || "")
        .trim()
        .toLowerCase();
}


function playerHasEliteStatus(value) {

    if (value === true) {
        return true;
    }

    const normalizedValue =
        String(value || "")
            .trim()
            .toLowerCase();

    return (
        normalizedValue === "true" ||
        normalizedValue === "yes" ||
        normalizedValue === "1" ||
        normalizedValue === "elite"
    );
}


// =========================================
// CREATE ROSTER CARD
// =========================================

function createRosterCard(
    player,
    showEliteBadge = true
) {

    const card =
        document.createElement("div");

    card.className =
        `player-card ${getRosterClassCSS(player.class)}`;

    card.dataset.ign =
        String(player.ign || "").trim();

    card.innerHTML = `

        ${
            showEliteBadge &&
            playerHasEliteStatus(player.elite)
                ? '<div class="elite">⭐</div>'
                : ""
        }

        <img
            class="player-icon"
            src="${getRosterClassImage(player.class)}"
            alt="${player.class || "Unknown class"}"
        >

        <div class="player-info">

            <div class="player-name">
                ${player.ign || "Unknown Player"}
            </div>

            <div class="player-class">
                ${player.class || "No Class"}
            </div>

            <div class="player-role">
                ${player.role || "No Role"}
            </div>

            <div class="player-gs">
                🏆 ${player.gear || "-"}
            </div>

        </div>
    `;

    return card;
}


// =========================================
// FULL GUILD ROSTER
// =========================================

function renderRoster() {

    const rosterTable =
        document.getElementById(
            "rosterTable"
        );

    if (!rosterTable) {
        return;
    }

    rosterTable.innerHTML = "";

    if (
        !Array.isArray(guildMembers) ||
        guildMembers.length === 0
    ) {

        rosterTable.innerHTML = `
            <div class="empty-roster-message">
                No guild members found.
            </div>
        `;

        return;
    }

    guildMembers.forEach((player) => {

        rosterTable.appendChild(
            createRosterCard(
                player,
                true
            )
        );
    });
}


// =========================================
// SUB LEAGUE
// Players without Elite status
// =========================================

function renderSubLeague() {

    const subLeagueTable =
        document.getElementById(
            "subLeagueTable"
        );

    const subLeagueCount =
        document.getElementById(
            "subLeagueCount"
        );

    if (!subLeagueTable) {
        return;
    }

    subLeagueTable.innerHTML = "";

    if (!Array.isArray(guildMembers)) {

        if (subLeagueCount) {
            subLeagueCount.textContent =
                "0 Players";
        }

        return;
    }

    const subLeaguePlayers =
        guildMembers.filter((player) => {

            return !playerHasEliteStatus(
                player.elite
            );
        });

    if (subLeagueCount) {

        subLeagueCount.textContent =
            `${subLeaguePlayers.length} ` +
            `${
                subLeaguePlayers.length === 1
                    ? "Player"
                    : "Players"
            }`;
    }

    if (subLeaguePlayers.length === 0) {

        subLeagueTable.innerHTML = `
            <div class="empty-roster-message">
                No Sub League players found.
            </div>
        `;

        return;
    }

    subLeaguePlayers.forEach((player) => {

        subLeagueTable.appendChild(
            createRosterCard(
                player,
                false
            )
        );
    });
}
