
function renderPlayerPool(){

    const pool = document.getElementById("playerPool");

    pool.innerHTML = "";

    playerPool.forEach(player=>{

        const card=document.createElement("div");

        card.className="player-card";

        card.innerHTML=`
            <strong>${player.ign}</strong><br>
            ${player.class}<br>
            GS: ${player.gear}
        `;

        pool.appendChild(card);

    });

}
