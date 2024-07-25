document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    const homepage = document.getElementById("homepage");
    const createGroupPage = document.getElementById("create-group");
    const joinGroupPage = document.getElementById("join-group");
    const gamePage = document.getElementById("game");
    
    const groupList = document.getElementById("group-list");
    const createGroupBtn = document.getElementById("create-group-btn");
    const createGroupSubmit = document.getElementById("create-group-submit");
    const backBtn = document.querySelectorAll("#back-btn, #back-btn-join");
    const joinGroupSubmit = document.getElementById("join-group-submit");
    const gameImage = document.getElementById("game-image");
    const imageName = document.getElementById("image-name");
    const smashBtn = document.getElementById("smash-btn");
    const passBtn = document.getElementById("pass-btn");
    const timerDisplay = document.getElementById("timer");
    const resultsDisplay = document.getElementById("results-display");
    const nextRoundBtn = document.getElementById("next-round-btn");
    const userDisplay = document.getElementById("user-display");
    let timer;
    let timeLeft = 10;

    const showPage = (page) => {
        homepage.classList.add("hidden");
        createGroupPage.classList.add("hidden");
        joinGroupPage.classList.add("hidden");
        gamePage.classList.add("hidden");
        page.classList.remove("hidden");
    };

    createGroupBtn.addEventListener("click", () => showPage(createGroupPage));
    
    backBtn.forEach(btn => btn.addEventListener("click", () => showPage(homepage)));

    createGroupSubmit.addEventListener("click", async () => {
        const groupName = document.getElementById("group-name").value;
        const gameMode = document.getElementById("game-mode").value;
        await fetch("/create-group", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupName, gameMode })
        });
        loadGroups();
        showPage(homepage);
    });

    joinGroupSubmit.addEventListener("click", async () => {
        const username = document.getElementById("username").value;
        await fetch("/join-group", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        });
        userDisplay.textContent = username;
        startGame();
    });

    smashBtn.addEventListener("click", () => makeChoice("smash"));
    passBtn.addEventListener("click", () => makeChoice("pass"));
    nextRoundBtn.addEventListener("click", startGame);

    const loadGroups = async () => {
        const response = await fetch("/groups");
        const groups = await response.json();
        groupList.innerHTML = "";
        groups.forEach(group => {
            const li = document.createElement("li");
            li.textContent = `${group.name} - ${group.gameMode}`;
            li.addEventListener("click", () => joinGroup(group.id));
            groupList.appendChild(li);
        });
    };

    const joinGroup = (groupId) => {
        showPage(joinGroupPage);
    };

    const startGame = async () => {
        showPage(gamePage);
        const response = await fetch("/game-image");
        const { url, name } = await response.json();
        gameImage.src = url;
        imageName.textContent = name;
        startTimer();
    };

    const startTimer = () => {
        timeLeft = 10;
        timerDisplay.textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                showResults();
            }
        }, 1000);
    };

    const makeChoice = async (choice) => {
        clearInterval(timer);
        await fetch("/make-choice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ choice })
        });
        showResults();
    };

    const showResults = async () => {
        const response = await fetch("/results");
        const results = await response.json();
        resultsDisplay.textContent = `Smash: ${results.smash}, Pass: ${results.pass}`;
        document.getElementById("results").classList.remove("hidden");
    };

    loadGroups();
});
