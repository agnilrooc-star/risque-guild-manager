// =========================================
// PLAYER POOL
// =========================================

let selectedClassFilter = "all";


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
// GET ASSIGNED PLAYERS
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
// UPDATE PLAYER POOL COUNT
// =========================================

function updatePlayerPoolCount() {

    const pool =
        document.getElementById("playerPool");

    const playerCount =
        document.getElementById("playerCount");

    if (!pool || !playerCount) {
        return;
    }

    const visibleCards =
        Array.from(
            pool.querySelectorAll(".player-card")
        )
        .filter((card) => {

            return card.style.display !== "none";
        })
        .length;

    playerCount.innerText =
        `${visibleCards} Players`;
}


// =========================================
// APPLY CLASS FILTER
// =========================================

function applyClassFilter() {

    const pool =
        document.getElementById("playerPool");

    if (!pool) {
        return;
    }

    pool
        .querySelectorAll(".player-card")
        .forEach((card) => {

            const playerClass =
                String(
                    card.dataset.playerClass || ""
                )
                    .trim()
                    .toLowerCase();

            const shouldShow =
                selectedClassFilter === "all" ||
                playerClass === selectedClassFilter;

            card.style.display =
                shouldShow ? "" : "none";
        });

    updatePlayerPoolCount();
}


// =========================================
// SETUP CLASS FILTER
// =========================================

function initializeClassFilter() {

    const classFilter =
        document.getElementById("classFilter");

    if (!classFilter) {
        return;
    }

    classFilter.value =
        selectedClassFilter;

    classFilter.addEventListener(
        "change",
        () => {

            selectedClassFilter =
                classFilter.value;

            applyClassFilter();
        }
    );
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

    applyClassFilter();

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

        const playerClass =
            String(player.class || "")
                .trim()
                .toLowerCase();

        if (!playerName) {
            return;
        }

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

        card.dataset.playerClass =
            playerClass;

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
                ✕
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

    applyClassFilter();
}


// =========================================
// START CLASS FILTER
// =========================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeClassFilter
    );

} else {

    initializeClassFilter();
}
