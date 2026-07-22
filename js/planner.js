// =========================================
// RISQUE RAID PLANNER
// Raid boxes + drag and drop + local saving
// =========================================


// =========================================
// CREATE ONE RAID SECTION
// =========================================

function createRaidSection(containerId, raidTitle, partyCount) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Raid container not found: ${containerId}`);
        return;
    }

    let partiesHTML = "";

    for (let number = 1; number <= partyCount; number++) {

        const partyId = `${containerId}Party${number}`;

        partiesHTML += `
            <div class="party">

                <h3 data-original-title="Party ${number}">
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

    createRaidSection(
        "raidOne",
        "Raid 1",
        6
    );

    createRaidSection(
        "raidTwo",
        "Raid 2",
        2
    );

    createRaidSection(
        "raidThree",
        "Raid 3",
        2
    );

    createRaidSection(
        "roaming",
        "Roaming",
        2
    );
}


// =========================================
// GET PLAYER NAME FROM CARD
// =========================================

function getCardPlayerName(card) {

    if (!card) {
        return "";
    }

    return (
        card.dataset.ign ||
        card.querySelector(".player-name")
            ?.textContent
            .trim() ||
        ""
    );
}


// =========================================
// UPDATE COUNTS
// =========================================

function updatePlannerCounts() {

    document
        .querySelectorAll(".party")
        .forEach((party) => {

            const title =
                party.querySelector("h3");

            const playerArea =
                party.querySelector(".partyPlayers");

            if (!title || !playerArea) {
                return;
            }

            const originalTitle =
                title.dataset.originalTitle ||
                title.textContent
                    .replace(/\s*\(\d+\)$/, "")
                    .trim();

            title.dataset.originalTitle =
                originalTitle;

            const playerTotal =
                playerArea.querySelectorAll(
                    ".player-card"
                ).length;

            title.textContent =
                `${originalTitle} (${playerTotal})`;
        });


    const playerPool =
        document.getElementById("playerPool");

    const playerCount =
        document.getElementById("playerCount");

    if (playerPool && playerCount) {

        const availablePlayers =
            playerPool.querySelectorAll(
                ".player-card"
            ).length;

        playerCount.textContent =
            `${availablePlayers} Players`;
    }
}


// =========================================
// SAVE PLANNER LAYOUT
// =========================================

function savePlannerLayout() {

    const plannerData = {};

    document
        .querySelectorAll(".partyPlayers")
        .forEach((partyContainer) => {

            if (!partyContainer.id) {
                return;
            }

            plannerData[partyContainer.id] = [];

            partyContainer
                .querySelectorAll(".player-card")
                .forEach((card) => {

                    const playerName =
                        getCardPlayerName(card);

                    if (playerName) {

                        plannerData[
                            partyContainer.id
                        ].push(playerName);
                    }
                });
        });

    localStorage.setItem(
        "risqueRaidPlanner",
        JSON.stringify(plannerData)
    );
}


// =========================================
// RESTORE SAVED PLANNER
// =========================================

function restorePlannerLayout() {

    const savedData =
        localStorage.getItem(
            "risqueRaidPlanner"
        );

    if (!savedData) {
        updatePlannerCounts();
        return;
    }

    let plannerData;

    try {

        plannerData =
            JSON.parse(savedData);

    } catch (error) {

        console.error(
            "Unable to read saved planner:",
            error
        );

        localStorage.removeItem(
            "risqueRaidPlanner"
        );

        return;
    }

    Object.entries(plannerData)
        .forEach(
            ([partyId, playerNames]) => {

                const partyContainer =
                    document.getElementById(
                        partyId
                    );

                if (!partyContainer) {
                    return;
                }

                playerNames.forEach(
                    (playerName) => {

                        const playerCards =
                            document.querySelectorAll(
                                "#playerPool .player-card"
                            );

                        const matchingCard =
                            Array.from(
                                playerCards
                            ).find((card) => {

                                return (
                                    getCardPlayerName(card) ===
                                    playerName
                                );
                            });

                        if (matchingCard) {

                            partyContainer.appendChild(
                                matchingCard
                            );
                        }
                    }
                );
            }
        );

    updatePlannerCounts();
}


// =========================================
// DRAG EVENT
// =========================================

function handlePlannerChange() {

    updatePlannerCounts();

    savePlannerLayout();
}


// =========================================
// ENABLE DRAG AND DROP
// =========================================

function initializeDragAndDrop() {

    if (typeof Sortable === "undefined") {

        console.error(
            "SortableJS did not load."
        );

        return;
    }

    const playerPool =
        document.getElementById(
            "playerPool"
        );

    if (!playerPool) {

        console.error(
            "Player Pool was not found."
        );

        return;
    }


    // Player Pool drag-and-drop

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

            onEnd: handlePlannerChange
        });

        playerPool.dataset.sortableReady =
            "true";
    }


    // Raid party drag-and-drop

    document
        .querySelectorAll(".partyPlayers")
        .forEach((partyContainer) => {

            if (
                partyContainer.dataset
                    .sortableReady
            ) {
                return;
            }

            new Sortable(
                partyContainer,
                {

                    group: {
                        name: "guildPlayers",
                        pull: true,
                        put: true
                    },

                    animation: 180,

                    ghostClass:
                        "sortable-ghost",

                    chosenClass:
                        "sortable-chosen",

                    dragClass:
                        "sortable-drag",

                    onEnd:
                        handlePlannerChange
                }
            );

            partyContainer.dataset
                .sortableReady = "true";
        });
}


// =========================================
// WATCH FOR GOOGLE SHEETS PLAYERS
// =========================================

function watchPlayerPool() {

    const playerPool =
        document.getElementById(
            "playerPool"
        );

    if (!playerPool) {
        return;
    }

    const observer =
        new MutationObserver(() => {

            restorePlannerLayout();

            updatePlannerCounts();
        });

    observer.observe(playerPool, {

        childList: true
    });
}


// =========================================
// CLEAR RAID PLANNER
// =========================================

function clearRaidPlanner() {

    const playerPool =
        document.getElementById(
            "playerPool"
        );

    if (!playerPool) {
        return;
    }

    document
        .querySelectorAll(
            ".partyPlayers .player-card"
        )
        .forEach((card) => {

            playerPool.appendChild(card);
        });

    localStorage.removeItem(
        "risqueRaidPlanner"
    );

    updatePlannerCounts();
}


// =========================================
// START PLANNER
// =========================================

function startRaidPlanner() {

    createAllRaidBoxes();

    initializeDragAndDrop();

    watchPlayerPool();

    restorePlannerLayout();

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
