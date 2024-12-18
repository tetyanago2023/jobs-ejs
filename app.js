// app.js

const express = require("express");
require("express-async-errors");

const app = express();

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

// secret word handling
let secretWord = "syzygy";
app.get("/secretWord", (req, res) => {
    res.render("secretWord", { secretWord });
});
app.post("/secretWord", (req, res) => {
    secretWord = req.body.secretWord;
    res.redirect("/secretWord");
});

app.use((req, res) => {
    res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
    res.status(500).send(err.message);
    console.log(err);
});

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
