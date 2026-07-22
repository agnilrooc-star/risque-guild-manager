function renderRoster(){

    const table=document.getElementById("rosterTable");

    table.innerHTML="";

    guildMembers.forEach(player=>{

        table.innerHTML += `
        <div class="player-card">
            <strong>${player.ign}</strong><br>
            ${player.class}<br>
            ${player.role}<br>
            Gear: ${player.gear}
        </div>
        `;

    });

}
