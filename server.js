const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

let groups = [];
let choices = { smash: 0, pass: 0 };

// Sample images with names
const images = [
    { url: "https://example.com/image1.jpg", name: "Image 1" },
    { url: "https://example.com/image2.jpg", name: "Image 2" },
    { url: "https://example.com/image3.jpg", name: "Image 3" }
];

app.post("/create-group", (req, res) => {
    const { groupName, gameMode } = req.body;
    groups.push({ id: groups.length, name: groupName, gameMode });
    res.sendStatus(200);
});

app.get("/groups", (req, res) => {
    res.json(groups);
});

app.post("/join-group", (req, res) => {
    res.sendStatus(200);
});

app.get("/game-image", (req, res) => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    res.json(randomImage);
});

app.post("/make-choice", (req, res) => {
    const { choice } = req.body;
    if (choice === "smash") {
        choices.smash++;
    } else {
        choices.pass++;
    }
    res.sendStatus(200);
});

app.get("/results", (req, res) => {
    res.json(choices);
    choices = { smash: 0, pass: 0 };
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
