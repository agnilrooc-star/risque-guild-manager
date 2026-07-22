// =========================================
// PAGE TABS
// =========================================

function initializeTabs() {

    const plannerTab =
        document.getElementById(
            "plannerTab"
        );

    const rosterTab =
        document.getElementById(
            "rosterTab"
        );

    const subLeagueTab =
        document.getElementById(
            "subLeagueTab"
        );

    const plannerPage =
        document.getElementById(
            "plannerPage"
        );

    const rosterPage =
        document.getElementById(
            "rosterPage"
        );

    const subLeaguePage =
        document.getElementById(
            "subLeaguePage"
        );


    function showPage(pageName) {

        plannerPage.style.display =
            pageName === "planner"
                ? "flex"
                : "none";

        rosterPage.style.display =
            pageName === "roster"
                ? "block"
                : "none";

        subLeaguePage.style.display =
            pageName === "subLeague"
                ? "block"
                : "none";


        plannerTab.classList.toggle(
            "active",
            pageName === "planner"
        );

        rosterTab.classList.toggle(
            "active",
            pageName === "roster"
        );

        subLeagueTab.classList.toggle(
            "active",
            pageName === "subLeague"
        );


        if (
            pageName === "roster" &&
            typeof renderRoster === "function"
        ) {
            renderRoster();
        }

        if (
            pageName === "subLeague" &&
            typeof renderSubLeague === "function"
        ) {
            renderSubLeague();
        }
    }


    plannerTab.addEventListener(
        "click",
        () => showPage("planner")
    );

    rosterTab.addEventListener(
        "click",
        () => showPage("roster")
    );

    subLeagueTab.addEventListener(
        "click",
        () => showPage("subLeague")
    );
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeTabs
    );

} else {

    initializeTabs();
}
