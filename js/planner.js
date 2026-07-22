// ===============================
// BUILD RAIDS
// ===============================

function createRaid(containerId, title, parties){

    const container = document.getElementById(containerId);

    container.innerHTML = "";

    const raid = document.createElement("div");
    raid.className = "raid";

    raid.innerHTML = `<h2>${title}</h2>`;

    const grid = document.createElement("div");
    grid.className = "party-grid";

    for(let i=1;i<=parties;i++){

        const party = document.createElement("div");

        party.className = "party";

        party.innerHTML = `
            <h3>Party ${i}</h3>
            <div class="partyPlayers"></div>
        `;

        grid.appendChild(party);

    }

    raid.appendChild(grid);

    container.appendChild(raid);

}

// ===============================
// CREATE ALL RAIDS
// ===============================

createRaid("raidOne","Raid 1",6);
createRaid("raidTwo","Raid 2",2);
createRaid("raidThree","Raid 3",2);
createRaid("roaming","Roaming Party",2);
