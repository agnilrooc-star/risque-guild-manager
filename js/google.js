// =====================================
// GOOGLE SHEETS CONFIG
// =====================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbycY-OfC9-NGLliPuXG-JxN2TwnGEcGPjAsyVHWoUWQHptNE2Q12xhuRZceIuO9XIbqzw/exec";

let guildMembers = [];
let playerPool = [];


// =====================================
// CHECK ELITE STATUS
// =====================================

function isElitePlayer(value) {

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


// =====================================
// LOAD DATA FROM GOOGLE SHEETS
// =====================================

async function loadGuildMembers() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                `Google Sheets request failed: ${response.status}`
            );
        }

        const data =
            await response.json();

        if (!Array.isArray(data)) {

            throw new Error(
                "Google Sheets did not return an array."
            );
        }

        guildMembers = data.map((player) => ({

            ign:
                player.ign ||
                player.IGN ||
                "",

            class:
                player.class ||
                player.Class ||
                "",

            role:
                player.role ||
                player.Role ||
                "",

            gear:
                player.gear ||
                player["Gear Rating"] ||
                player["Gear Score"] ||
                "",

            elite:
                isElitePlayer(
                    player.elite ??
                    player.Elite
                )
        }));


        // Elite members only
        playerPool =
            guildMembers.filter(
                (player) => player.elite
            );


        // Render Guild League Player Pool

        try {

            if (
                typeof renderPlayerPool ===
                "function"
            ) {
                renderPlayerPool();
            }

        } catch (error) {

            console.error(
                "Player Pool render failed:",
                error
            );
        }


        // Render complete Guild Roster

        try {

            if (
                typeof renderRoster ===
                "function"
            ) {
                renderRoster();
            }

        } catch (error) {

            console.error(
                "Guild Roster render failed:",
                error
            );
        }


        // Render non-Elite Sub League

        try {

            if (
                typeof renderSubLeague ===
                "function"
            ) {
                renderSubLeague();
            }

        } catch (error) {

            console.error(
                "Sub League render failed:",
                error
            );
        }

    } catch (error) {

        console.error(
            "Google Sheets Error:",
            error
        );

        const rosterTable =
            document.getElementById(
                "rosterTable"
            );

        if (rosterTable) {

            rosterTable.innerHTML = `
                <div class="empty-roster-message">
                    Unable to load Guild Roster.
                </div>
            `;
        }
    }
}


// =====================================
// AUTO REFRESH
// =====================================

loadGuildMembers();

setInterval(
    loadGuildMembers,
    5000
);
