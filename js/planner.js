// =========================================
// RISQUE RAID PLANNER
// Raid boxes, drag-and-drop, saving,
// restoring, party limits and player counts
// =========================================

const MAX_PLAYERS_PER_PARTY = 5;

let plannerIsRestoring = false;
let playerPoolRefreshTimer = null;


// =========================================
// CREATE ONE RAID SECTION
// =========================================

function createRaidSection(
    containerId,
    raidTitle,
    partyCount
) {

    const container =
        document.getElementById(containerId);

    if (!container) {

        console.error(
            `Raid container not found: ${containerId}`
        );

        return;
    }

    let partiesHTML = "";

    for (
        let partyNumber = 1;
        partyNumber <= partyCount;
        partyNumber++
    ) {

        const partyId =
            `${containerId}Party${partyNumber}`;

        partiesHTML += `
            <div class="party">

                <h3
                    data-original-title="Party ${partyNumber}"
                >
                    Party ${partyNumber}
                    (0/${MAX_PLAYERS_PER_PARTY})
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

    return String(
        card.dataset.ign ||
        card
            .querySelector(".player-name")
            ?.textContent ||
        ""
    ).trim();
}


// =========================================
// REMOVE DUPLICATE PLAYER CARDS
// =========================================

function removeDuplicatePlayerCards() {

    const existingPlayers =
        new Set();

    /*
     * Raid cards are checked first.
     * This keeps assigned players inside raids.
     */
    const raidCards =
        Array.from(
            document.querySelectorAll(
                ".partyPlayers .player-card"
            )
        );

    const poolCards =
        Array.from(
            document.querySelectorAll(
                "#playerPool .player-card"
            )
        );

    const allCards = [
        ...raidCards,
        ...poolCards
    ];

    allCards.forEach((card) => {

        const playerName =
            getCardPlayerName(card);

        if (!playerName) {
            return;
        }

        const playerKey =
            playerName.toLowerCase();

        if (existingPlayers.has(playerKey)) {

            card.remove();

            return;
        }

        existingPlayers.add(playerKey);
    });
}


// =========================================
// UPDATE PARTY AND PLAYER POOL COUNTS
// =========================================

function updatePlannerCounts() {

    document
        .querySelectorAll(".party")
        .forEach((party) => {

            const title =
                party.querySelector("h3");

            const playerArea =
                party.querySelector(
                    ".partyPlayers"
                );

            if (!title || !playerArea) {
                return;
            }

            const originalTitle =
                title.dataset.originalTitle ||
                title.textContent
                    .replace(
                        /\s*\(\d+\/\d+\)$/,
                        ""
                    )
                    .replace(
                        /\s*\(\d+\)$/,
                        ""
                    )
                    .trim();

            title.dataset.originalTitle =
                originalTitle;

            const totalPlayers =
                playerArea
                    .querySelectorAll(
                        ".player-card"
                    )
                    .length;

            title.textContent =
                `${originalTitle} ` +
                `(${totalPlayers}/${MAX_PLAYERS_PER_PARTY})`;

            party.classList.toggle(
                "party-full",
                totalPlayers >=
                    MAX_PLAYERS_PER_PARTY
            );
        });


    const playerPool =
        document.getElementById(
            "playerPool"
        );

    const playerCount =
        document.getElementById(
            "playerCount"
        );

    if (playerPool && playerCount) {

        const availablePlayers =
            playerPool
                .querySelectorAll(
                    ".player-card"
                )
                .length;

        playerCount.textContent =
            `${availablePlayers} Players`;
    }
}


// =========================================
// SAVE PLANNER LAYOUT
// =========================================

function savePlannerLayout() {

    if (plannerIsRestoring) {
        return;
    }

    const plannerData = {};

    document
        .querySelectorAll(
            ".partyPlayers"
        )
        .forEach((partyContainer) => {

            if (!partyContainer.id) {
                return;
            }

            plannerData[
                partyContainer.id
            ] = [];

            partyContainer
                .querySelectorAll(
                    ".player-card"
                )
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
// RESTORE SAVED PLANNER LAYOUT
// =========================================

function restorePlannerLayout() {

    if (plannerIsRestoring) {
        return;
    }

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

    plannerIsRestoring = true;

    try {

        Object.entries(plannerData)
            .forEach(
                ([
                    partyContainerId,
                    playerNames
                ]) => {

                    const partyContainer =
                        document.getElementById(
                            partyContainerId
                        );

                    if (!partyContainer) {
                        return;
                    }

                    playerNames
                        .slice(
                            0,
                            MAX_PLAYERS_PER_PARTY
                        )
                        .forEach(
                            (playerName) => {

                                /*
                                 * Skip the player if already
                                 * assigned to any raid party.
                                 */
                                const assignedCard =
                                    Array.from(
                                        document
                                            .querySelectorAll(
                                                ".partyPlayers .player-card"
                                            )
                                    )
                                    .find(
                                        (card) =>
                                            getCardPlayerName(
                                                card
                                            )
                                                .toLowerCase() ===
                                            String(
                                                playerName
                                            )
                                                .trim()
                                                .toLowerCase()
                                    );

                                if (assignedCard) {
                                    return;
                                }

                                const matchingCard =
                                    Array.from(
                                        document
                                            .querySelectorAll(
                                                "#playerPool .player-card"
                                            )
                                    )
                                    .find(
                                        (card) =>
                                            getCardPlayerName(
                                                card
                                            )
                                                .toLowerCase() ===
                                            String(
                                                playerName
                                            )
                                                .trim()
                                                .toLowerCase()
                                    );

                                if (
                                    matchingCard &&
                                    partyContainer
                                        .querySelectorAll(
                                            ".player-card"
                                        )
                                        .length <
                                        MAX_PLAYERS_PER_PARTY
                                ) {

                                    partyContainer
                                        .appendChild(
                                            matchingCard
                                        );
                                }
                            }
                        );
                }
            );

        removeDuplicatePlayerCards();

        updatePlannerCounts();

    } finally {

        plannerIsRestoring = false;
    }
}


// =========================================
// SHOW PARTY LIMIT WARNING
// =========================================

function showPartyLimitWarning(
    partyContainer
) {

    const party =
        partyContainer.closest(
            ".party"
        );

    const warningTarget =
        party || partyContainer;

    warningTarget.classList.add(
        "party-drop-denied"
    );

    window.setTimeout(() => {

        warningTarget.classList.remove(
            "party-drop-denied"
        );

    }, 500);
}


// =========================================
// CHECK IF PLAYER CAN ENTER PARTY
// =========================================

function canMovePlayerToParty(event) {

    const destination =
        event.to;

    const source =
        event.from;

    /*
     * Allow rearranging players inside
     * the same party.
     */
    if (destination === source) {
        return true;
    }

    const playerName =
        getCardPlayerName(
            event.dragged
        ).toLowerCase();

    /*
     * Prevent the same player from being
     * assigned more than once.
     */
    const duplicateCard =
        Array.from(
            document.querySelectorAll(
                ".partyPlayers .player-card"
            )
        ).find((card) => {

            return (
                card !== event.dragged &&
                getCardPlayerName(card)
                    .toLowerCase() ===
                    playerName
            );
        });

    if (duplicateCard) {

        showPartyLimitWarning(
            destination
        );

        return false;
    }

    const currentPlayers =
        destination
            .querySelectorAll(
                ".player-card"
            )
            .length;

    if (
        currentPlayers >=
        MAX_PLAYERS_PER_PARTY
    ) {

        showPartyLimitWarning(
            destination
        );

        return false;
    }

    return true;
}


// =========================================
// HANDLE DRAG-AND-DROP CHANGE
// =========================================

function handlePlannerChange() {

    removeDuplicatePlayerCards();

    updatePlannerCounts();

    savePlannerLayout();
}


// =========================================
// ENABLE DRAG AND DROP
// =========================================

function initializeDragAndDrop() {

    if (
        typeof Sortable ===
        "undefined"
    ) {

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


    // PLAYER POOL

    if (
        !playerPool.dataset
            .sortableReady
    ) {

        new Sortable(
            playerPool,
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

        playerPool.dataset
            .sortableReady = "true";
    }


    // RAID PARTIES

    document
        .querySelectorAll(
            ".partyPlayers"
        )
        .forEach(
            (partyContainer) => {

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
                            name:
                                "guildPlayers",
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

                        onMove:
                            canMovePlayerToParty,

                        onEnd:
                            handlePlannerChange
                    }
                );

                partyContainer.dataset
                    .sortableReady =
                    "true";
            }
        );
}


// =========================================
// RETURN PLAYER TO PLAYER POOL
// =========================================

function returnPlayerToPool(card) {

    const playerPool =
        document.getElementById(
            "playerPool"
        );

    if (!playerPool || !card) {
        return;
    }

    const playerName =
        getCardPlayerName(card)
            .toLowerCase();

    /*
     * Remove an accidental pool duplicate
     * before returning the raid card.
     */
    document
        .querySelectorAll(
            "#playerPool .player-card"
        )
        .forEach((poolCard) => {

            if (
                poolCard !== card &&
                getCardPlayerName(poolCard)
                    .toLowerCase() ===
                    playerName
            ) {

                poolCard.remove();
            }
        });

    playerPool.appendChild(card);

    removeDuplicatePlayerCards();

    updatePlannerCounts();

    savePlannerLayout();
}


// =========================================
// WATCH GOOGLE SHEETS PLAYER REFRESH
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

            if (plannerIsRestoring) {
                return;
            }

            clearTimeout(
                playerPoolRefreshTimer
            );

            playerPoolRefreshTimer =
                setTimeout(() => {

                    restorePlannerLayout();

                    removeDuplicatePlayerCards();

                    updatePlannerCounts();

                }, 150);
        });

    observer.observe(
        playerPool,
        {
            childList: true
        }
    );
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

    removeDuplicatePlayerCards();

    updatePlannerCounts();
}

// =========================================
// CLEAR PLANNER WITH CONFIRMATION
// =========================================

function confirmClearPlanner() {

    const assignedPlayers =
        document.querySelectorAll(
            ".partyPlayers .player-card"
        ).length;

    if (assignedPlayers === 0) {

        alert("The raid planner is already empty.");

        return;
    }

    const shouldClear =
        window.confirm(
            "Return all players to the Player Pool?"
        );

    if (!shouldClear) {
        return;
    }

    clearRaidPlanner();
}


// =========================================
// WAIT FOR IMAGES TO LOAD
// =========================================

function waitForPlannerImages(container) {

    const images =
        Array.from(
            container.querySelectorAll("img")
        );

    const imagePromises =
        images.map((image) => {

            if (image.complete) {
                return Promise.resolve();
            }

            return new Promise((resolve) => {

                image.addEventListener(
                    "load",
                    resolve,
                    { once: true }
                );

                image.addEventListener(
                    "error",
                    resolve,
                    { once: true }
                );
            });
        });

    return Promise.all(imagePromises);
}


async function exportRaidSetup() {

    const planner =
        document.querySelector(".planner");

    const actionButtons =
        document.querySelector(".planner-actions");

    const exportButton =
        document.getElementById(
            "exportPlannerButton"
        );

    if (!planner) {

        alert("Planner was not found.");

        return;
    }

    if (typeof html2canvas === "undefined") {

        alert(
            "Image exporter did not load. Refresh the page."
        );

        return;
    }

    const originalText =
        exportButton
            ? exportButton.textContent
            : "Export Raid Setup";

    if (exportButton) {

        exportButton.disabled = true;

        exportButton.textContent =
            "Creating Image...";
    }

    /*
     * Hide buttons before taking the image.
     */
    if (actionButtons) {

        actionButtons.style.display =
            "none";
    }

    document
        .querySelectorAll(
            ".return-player-button"
        )
        .forEach((button) => {

            button.dataset.previousDisplay =
                button.style.display;

            button.style.display =
                "none";
        });

    try {

        await new Promise((resolve) => {

            requestAnimationFrame(() => {

                requestAnimationFrame(
                    resolve
                );
            });
        });

        const canvas =
            await html2canvas(
                planner,
                {
                    backgroundColor:
                        "#0f1115",

                    scale: 2,

                    useCORS: true,

                    allowTaint: false,

                    logging: false,

                    scrollX: 0,

                    scrollY: 0,

                    windowWidth:
                        planner.scrollWidth,

                    windowHeight:
                        planner.scrollHeight
                }
            );

        const link =
            document.createElement("a");

        const date =
            new Date()
                .toISOString()
                .slice(0, 10);

        link.download =
            `risque-raid-setup-${date}.png`;

        link.href =
            canvas.toDataURL("image/png");

        document.body.appendChild(link);

        link.click();

        link.remove();

    } catch (error) {

        console.error(
            "Export failed:",
            error
        );

        alert(
            "Unable to export the raid setup."
        );

    } finally {

        /*
         * Show buttons again after capture.
         */
        if (actionButtons) {

            actionButtons.style.display =
                "";
        }

        document
            .querySelectorAll(
                ".return-player-button"
            )
            .forEach((button) => {

                button.style.display =
                    button.dataset
                        .previousDisplay || "";

                delete button.dataset
                    .previousDisplay;
            });

        if (exportButton) {

            exportButton.disabled = false;

            exportButton.textContent =
                originalText;
        }
    }
}

// =========================================
// PLANNER ACTION BUTTONS
// =========================================

function initializePlannerActions() {

    const clearButton =
        document.getElementById(
            "clearPlannerButton"
        );

    const exportButton =
        document.getElementById(
            "exportPlannerButton"
        );

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            confirmClearPlanner
        );
    }

    if (exportButton) {

        exportButton.addEventListener(
            "click",
            exportRaidSetup
        );
    }
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


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startRaidPlanner
    );

} else {

    startRaidPlanner();
}
// =========================================
// FORCE PLANNER BUTTONS TO WORK
// =========================================

function setupPlannerButtons() {

    const clearButton =
        document.getElementById("clearPlannerButton");

    const exportButton =
        document.getElementById("exportPlannerButton");


    if (clearButton) {

        clearButton.onclick = function () {

            const assignedPlayers =
                document.querySelectorAll(
                    ".partyPlayers .player-card"
                ).length;

            if (assignedPlayers === 0) {

                alert("The planner is already empty.");

                return;
            }

            const confirmed =
                confirm(
                    "Return all players to the Player Pool?"
                );

            if (!confirmed) {
                return;
            }

            clearRaidPlanner();
        };
    }


    if (exportButton) {

        exportButton.onclick = async function () {

            const planner =
                document.querySelector(".planner");

            if (!planner) {

                alert("Planner was not found.");

                return;
            }

            if (
                typeof html2canvas ===
                "undefined"
            ) {

                alert(
                    "Image exporter did not load. Refresh the page."
                );

                return;
            }

            exportButton.disabled = true;

            exportButton.textContent =
                "Creating Image...";

            try {

                document
                    .querySelectorAll(
                        ".return-player-button"
                    )
                    .forEach((button) => {

                        button.dataset.oldDisplay =
                            button.style.display;

                        button.style.display =
                            "none";
                    });

                const canvas =
                    await html2canvas(
                        planner,
                        {
                            backgroundColor:
                                "#0f1115",

                            scale: 2,

                            useCORS: true,

                            logging: false
                        }
                    );

                const link =
                    document.createElement("a");

                const date =
                    new Date()
                        .toISOString()
                        .slice(0, 10);

                link.download =
                    `risque-raid-setup-${date}.png`;

                link.href =
                    canvas.toDataURL(
                        "image/png"
                    );

                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();

            } catch (error) {

                console.error(error);

                alert(
                    "Export failed. Make sure the class images are loading."
                );

            } finally {

                document
                    .querySelectorAll(
                        ".return-player-button"
                    )
                    .forEach((button) => {

                        button.style.display =
                            button.dataset.oldDisplay ||
                            "";
                    });

                exportButton.disabled = false;

                exportButton.textContent =
                    "Export Raid Setup";
            }
        };
    }
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        setupPlannerButtons
    );

} else {

    setupPlannerButtons();
}
