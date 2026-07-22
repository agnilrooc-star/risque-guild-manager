// =====================================
// GOOGLE SHEETS CONFIG
// =====================================

const API_URL = "https://script.google.com/macros/s/AKfycbxnepH5bglAVBTaeUBddyb-U8ptc7s3PpurUYRLRFGUG3jNfC2druVqQ--9wt0vqtaPpg/exec";

let guildMembers = [];
let playerPool = [];

// =====================================
// LOAD DATA
// =====================================

async function loadGuildMembers(){

    try{

        const response = await fetch(API_URL);

        const data = await response.json();

        guildMembers = data;

        playerPool = guildMembers.filter(player => {

            return player.active === true ||
                   player.active === "TRUE" ||
                   player.active === "true";

        });

        renderPlayerPool();
        renderRoster();

    }

    catch(error){

        console.error(error);

    }


}
// Initial load
loadGuildMembers();

// Refresh every 5 seconds
setInterval(loadGuildMembers,5000);


