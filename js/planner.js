// =====================================
// DRAG AND DROP RAID PLANNER
// =====================================
// =========================================
// RISQUE RAID PLANNER
// Creates raid boxes and enables drag/drop
// =========================================


// =========================================
// CREATE ONE RAID SECTION
// =========================================

function createRaidSection(containerId, raidTitle, partyCount) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }

    let partiesHTML = "";

    for (let number = 1; number <= partyCount; number++) {

        const partyId = `${containerId}Party${number}`;

        partiesHTML += `
            <div class="party">

                <h3 data-party-name="Party ${number}">
                    Party ${number} (0)
                </h3>

                <div
                    class="partyPlayers"
                    id="${partyId}"
                ></div>

            </div>
        `;
    }

    container.innerHTML = `
        <section class="raid">

            <h2>${raidTitle}</h2>

            <div class="party-grid">
                ${partiesHTML}
            </div>

        </section>
    `;
}


// =========================================
// CREATE ALL RAID BOXES
// =========================================

function createAllRaidBoxes() {

    // Raid 1 has 6 parties
    createRaidSection(
        "raidOne",
        "Raid 1",
        6
    );

    // Raid 2 has 2 parties
    createRaidSection(
        "raidTwo",
        "Raid 2",
        2
    );

    // Raid 3 has 2 parties
    createRaidSection(
        "raidThree",
        "Raid 3",
        2
    );

    // Roaming has 2 parties
    createRaidSection(
        "roaming",
        "Roaming",
        2
    );
}


// =========================================
// UPDATE PARTY COUNTS
// =========================================

function updatePlannerCounts() {

    document.querySelectorAll(".party").forEach((party) => {

        const title = party.querySelector("h3");
        const playerArea = party.querySelector(".partyPlayers");

        if (!title || !playerArea) {
            return;
        }

        const partyName =
            title.dataset.partyName || "Party";

        const playerCount =
            playerArea.querySelectorAll(".player-card").length;

        title.textContent =
            `${partyName} (${playerCount})`;
    });

    const playerPool =
        document.getElementById("playerPool");

    const playerCountElement =
        document.getElementById("playerCount");

    if (playerPool && playerCountElement) {

        const availablePlayers =
            playerPool.querySelectorAll(".player-card").length;

        playerCountElement.textContent =
            `${availablePlayers} Players`;
    }
}


// =========================================
// SAVE RAID PLANNER
// =========================================

function savePlannerLayout() {

    const savedPlanner = {};

    document.querySelectorAll(".partyPlayers").forEach((partyArea) => {

        savedPlanner[partyArea.id] = [];

        partyArea
            .querySelectorAll(".player-card")
            .forEach((card) => {

                const playerName =
                    card.dataset.ign ||
                    card.querySelector(".player-name")
                        ?.textContent
                        .trim();

                if (playerName) {
                    savedPlanner[partyArea.id].push(playerName);
                }
            });
    });

    localStorage.setItem(
        "risqueRaidPlanner",
        JSON.stringify(savedPlanner)
    );
}


// =========================================
// ENABLE DRAG AND DROP
// =========================================

function initializeDragAndDrop() {

    if (typeof Sortable === "undefined") {

        console.error("SortableJS did not load.");

        return;
    }

    const playerPool =
        document.getElementById("playerPool");

    if (!playerPool) {

        console.error("Player Pool was not found.");

        return;
    }

    // Prevent duplicate Sortable initialization
    if (!playerPool.dataset.sortableReady) {

        new Sortable(playerPool, {

            group: {
                name: "guildPlayers",
                pull: true,
                put: true
            },

            animation: 180,

            ghostClass: "sortable-ghost",

            chosenClass: "sortable-chosen",

            dragClass: "sortable-drag",

            onEnd: function () {

                updatePlannerCounts();

                savePlannerLayout();
            }
        });

        playerPool.dataset.sortableReady = "true";
    }


    document
        .querySelectorAll(".partyPlayers")
        .forEach((partyArea) => {

            if (partyArea.dataset.sortableReady) {
                return;
            }

            new Sortable(partyArea, {

                group: {
                    name: "guildPlayers",
                    pull: true,
                    put: true
                },

                animation: 180,

                ghostClass: "sortable-ghost",

                chosenClass: "sortable-chosen",

                dragClass: "sortable-drag",

                onEnd: function () {

                    updatePlannerCounts();

                    savePlannerLayout();
                }
            });

            partyArea.dataset.sortableReady = "true";
        });
}


// =========================================
// START RAID PLANNER
// =========================================

function startRaidPlanner() {

    createAllRaidBoxes();

    initializeDragAndDrop();

    updatePlannerCounts();
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        startRaidPlanner
    );

} else {

    startRaidPlanner();
}
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
