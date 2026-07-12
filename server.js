const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.json({
        message: "Hello, FlyRank!"
    });
});

app.get("/about", (req, res) => {
    res.json({
        name: "Krishna",
        role: "Backend AI Engineering Intern"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});