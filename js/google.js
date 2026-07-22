// =====================================
// GOOGLE SHEETS CONFIG
// =====================================

const API_URL = "https://script.google.com/macros/s/AKfycbycY-OfC9-NGLliPuXG-JxN2TwnGEcGPjAsyVHWoUWQHptNE2Q12xhuRZceIuO9XIbqzw/exec";

let guildMembers = [];
let playerPool = [];

// =====================================
// LOAD DATA FROM GOOGLE SHEETS
// =====================================

async function loadGuildMembers(){

    try{

        const response = await fetch(API_URL);

        const data = await response.json();

        guildMembers = data.map(player => ({

            ign: player.ign || "",

            class: player.class || "",

            role: player.role || "",

            gear: player.gear || player["Gear Rating"] || "",

            elite:
                player.elite === true ||
                player.elite === "TRUE" ||
                player.elite === "true" ||
                player.elite === "Yes"

        }));

        // Only Elite players appear in the GL Player Pool
        playerPool = guildMembers.filter(player => player.elite);

        try {

    renderPlayerPool();

} catch (error) {

    console.error(
        "Player Pool render failed:",
        error
    );
}


try {

    renderRoster();

} catch (error) {

    console.error(
        "Guild Roster render failed:",
        error
    );
}


try {

    renderSubLeague();

} catch (error) {

    console.error(
        "Sub League render failed:",
        error
    );
}

    catch(error){

        console.error("Google Sheets Error:", error);

    }

}

// =====================================
// AUTO REFRESH
// =====================================

loadGuildMembers();

setInterval(loadGuildMembers,5000);
