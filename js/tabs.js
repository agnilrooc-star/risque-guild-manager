const plannerTab = document.getElementById("plannerTab");
const rosterTab = document.getElementById("rosterTab");

const plannerPage = document.getElementById("plannerPage");
const rosterPage = document.getElementById("rosterPage");

plannerTab.onclick = () => {

    plannerTab.classList.add("active");
    rosterTab.classList.remove("active");

    plannerPage.style.display = "flex";
    rosterPage.style.display = "none";

};

rosterTab.onclick = () => {

    rosterTab.classList.add("active");
    plannerTab.classList.remove("active");

    rosterPage.style.display = "block";
    plannerPage.style.display = "none";

};
