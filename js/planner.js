// =====================================
// DRAG AND DROP RAID PLANNER
// =====================================

function initializeRaidPlanner() {

    const playerPoolElement = document.getElementById("playerPool");

    if (!playerPoolElement) {
        console.error("Player Pool container was not found.");
        return;
    }

    if (typeof Sortable === "undefined") {
        console.error("SortableJS did not load.");
        return;
    }

    // Player Pool
    new Sortable(playerPoolElement, {
        group: {
            name: "guildPlayers",
            pull: true,
            put: true
        },

        animation: 180,
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",

        onAdd: updatePlannerCounts,
        onRemove: updatePlannerCounts,
        onSort: updatePlannerCounts
    });

    // All raid party containers
    const partyContainers = document.querySelectorAll(".partyPlayers");

    partyContainers.forEach((partyContainer) => {

        new Sortable(partyContainer, {
            group: {
                name: "guildPlayers",
                pull: true,
                put: true
            },

            animation: 180,
            ghostClass: "sortable-ghost",
            chosenClass: "sortable-chosen",
            dragClass: "sortable-drag",

            onAdd: function () {
                updatePlannerCounts();
                savePlannerLayout();
            },

            onRemove: function () {
                updatePlannerCounts();
                savePlannerLayout();
            },

            onSort: function () {
                updatePlannerCounts();
                savePlannerLayout();
            }
        });

    });

    restorePlannerLayout();
    updatePlannerCounts();
}


// =====================================
// UPDATE PARTY PLAYER COUNTS
// =====================================

function updatePlannerCounts() {

    const parties = document.querySelectorAll(".party");

    parties.forEach((party) => {

        const playerContainer = party.querySelector(".partyPlayers");
        const partyTitle = party.querySelector("h3");

        if (!playerContainer || !partyTitle) {
            return;
        }

        const playerTotal =
            playerContainer.querySelectorAll(".player-card").length;

        const originalTitle =
            partyTitle.dataset.originalTitle ||
            partyTitle.textContent.replace(/\s*\(\d+\)$/, "").trim();

        partyTitle.dataset.originalTitle = originalTitle;

        partyTitle.textContent =
            `${originalTitle} (${playerTotal})`;

    });

}


// =====================================
// SAVE PLANNER LAYOUT
// =====================================

function savePlannerLayout() {

    const plannerData = {};

    document.querySelectorAll(".partyPlayers").forEach((partyContainer) => {

        if (!partyContainer.id) {
            return;
        }

        plannerData[partyContainer.id] = [];

        partyContainer
            .querySelectorAll(".player-card")
            .forEach((card) => {

                const playerIGN =
                    card.dataset.ign ||
                    card.querySelector(".player-name")?.textContent.trim();

                if (playerIGN) {
                    plannerData[partyContainer.id].push(playerIGN);
                }

            });

    });

    localStorage.setItem(
        "risqueRaidPlanner",
        JSON.stringify(plannerData)
    );

}


// =====================================
// RESTORE PLANNER LAYOUT
// =====================================

function restorePlannerLayout() {

    const savedData =
        localStorage.getItem("risqueRaidPlanner");

    if (!savedData) {
        return;
    }

    let plannerData;

    try {
        plannerData = JSON.parse(savedData);
    } catch (error) {
        console.error("Unable to read saved planner:", error);
        return;
    }

    Object.entries(plannerData).forEach(
        ([partyContainerId, playerNames]) => {

            const partyContainer =
                document.getElementById(partyContainerId);

            if (!partyContainer) {
                return;
            }

            playerNames.forEach((playerName) => {

                const playerCards =
                    document.querySelectorAll("#playerPool .player-card");

                const matchingCard =
                    Array.from(playerCards).find((card) => {

                        const cardIGN =
                            card.dataset.ign ||
                            card.querySelector(".player-name")
                                ?.textContent.trim();

                        return cardIGN === playerName;

                    });

                if (matchingCard) {
                    partyContainer.appendChild(matchingCard);
                }

            });

        }
    );

}


// =====================================
// CLEAR RAID PLANNER
// =====================================

function clearRaidPlanner() {

    const playerPoolElement =
        document.getElementById("playerPool");

    if (!playerPoolElement) {
        return;
    }

    document
        .querySelectorAll(".partyPlayers .player-card")
        .forEach((card) => {

            playerPoolElement.appendChild(card);

        });

    localStorage.removeItem("risqueRaidPlanner");

    updatePlannerCounts();

}


// =====================================
// START PLANNER
// =====================================

function startRaidPlanner() {

    initializeRaidPlanner();

}

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        startRaidPlanner
    );

} else {

    startRaidPlanner();

}
