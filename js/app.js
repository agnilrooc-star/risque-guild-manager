// =========================================
// PLAYER POOL
// =========================================

function getClassImage(playerClass) {

    const safeClass = String(playerClass || "unknown")
        .trim()
        .toLowerCase();

    return `assets/classes/${safeClass}.png`;
}


function getClassCSS(playerClass) {

    return String(playerClass || "")
        .trim()
        .toLowerCase();
}


// =========================================
// GET PLAYERS ALREADY INSIDE RAID PARTIES
// =========================================

function getAssignedPlayerNames() {

    const assignedPlayers = new Set();

    document
        .querySelectorAll(".partyPlayers .player-card")
        .forEach((card) => {

            const playerName =
                card.dataset.ign ||
                card.querySelector(".player-name")
                    ?.textContent
                    .trim();

            if (playerName) {
                assignedPlayers.add(
                    playerName.toLowerCase()
                );
            }
        });

    return assignedPlayers;
}


// =========================================
// RETURN PLAYER TO POOL
// =========================================

function returnPlayerToPool(card) {

    const pool =
        document.getElementById("playerPool");

    if (!pool || !card) {
        return;
    }

    const playerName =
        card.dataset.ign ||
        card.querySelector(".player-name")
            ?.textContent
            .trim();

    if (!playerName) {
        return;
    }

    // Remove duplicate copies already in the pool
    document
        .querySelectorAll("#playerPool .player-card")
        .forEach((poolCard) => {

            if (poolCard === card) {
                return;
            }

            const poolPlayerName =
                poolCard.dataset.ign ||
                poolCard.querySelector(".player-name")
                    ?.textContent
                    .trim();

            if (
                poolPlayerName &&
                poolPlayerName.toLowerCase() ===
                playerName.toLowerCase()
            ) {
                poolCard.remove();
            }
        });

    pool.appendChild(card);

    updatePlayerPoolCount();

    if (
        typeof updatePlannerCounts ===
        "function"
    ) {
        updatePlannerCounts();
    }

    if (
        typeof savePlannerLayout ===
        "function"
    ) {
        savePlannerLayout();
    }
}


// =========================================
// UPDATE PLAYER POOL COUNT
// =========================================

function updatePlayerPoolCount() {

    const pool =
        document.getElementById("playerPool");

    const count =
        document.getElementById("playerCount");

    if (!pool || !count) {
        return;
    }

    const total =
        pool.querySelectorAll(".player-card")
            .length;

    count.innerText =
        `${total} Players`;
}


// =========================================
// RENDER PLAYER POOL
// =========================================

function renderPlayerPool() {

    const pool =
        document.getElementById("playerPool");

    if (!pool) {
        console.error("Player Pool was not found.");
        return;
    }

    const assignedPlayers =
        getAssignedPlayerNames();

    pool.innerHTML = "";

    playerPool.forEach((player) => {

        const playerName =
            String(player.ign || "").trim();

        if (!playerName) {
            return;
        }

        // Do not recreate players already assigned
        if (
            assignedPlayers.has(
                playerName.toLowerCase()
            )
        ) {
            return;
        }

        const card =
            document.createElement("div");

        card.dataset.ign =
            playerName;

        card.className =
            `player-card ${getClassCSS(player.class)}`;

        card.innerHTML = `

            ${
                player.elite
                    ? '<div class="elite">⭐</div>'
                    : ""
            }

            <button
                class="return-player-button"
                type="button"
                title="Return player to pool"
            >
                ↩
            </button>

            <img
                class="player-icon"
                src="${getClassImage(player.class)}"
                alt="${player.class || "Unknown class"}"
            >

            <div class="player-name">
                ${playerName}
            </div>

            <div class="player-role">
                ${player.role || "-"}
            </div>

            <div class="player-gs">
                🏆 ${player.gear || "-"}
            </div>
        `;

        const returnButton =
            card.querySelector(
                ".return-player-button"
            );

        returnButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                returnPlayerToPool(card);
            }
        );

        pool.appendChild(card);
    });

    updatePlayerPoolCount();
}
