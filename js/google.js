// =====================================
// GOOGLE SHEETS CONFIG
// =====================================

const API_URL = "https://script.google.com/macros/s/AKfycbxnepH5bglAVBTaeUBddyb-U8ptc7s3PpurUYRLRFGUG3jNfC2druVqQ--9wt0vqtaPpg/exec";

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

        renderPlayerPool();

        renderRoster();

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
