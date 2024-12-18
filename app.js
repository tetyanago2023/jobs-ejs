// app.js

const express = require("express");
require("express-async-errors");
require("dotenv").config(); // Load environment variables
const session = require("express-session");

const app = express();

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

// Session middleware setup
const MongoDBStore = require("connect-mongodb-session")(session);
const url = process.env.MONGO_URI;

const store = new MongoDBStore({
    // may throw an error, which won't be caught
    uri: url,
    collection: "mySessions",
});
store.on("error", function (error) {
    console.log(error);
});

const sessionParms = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));

// secret word handling in the session
app.get("/secretWord", (req, res) => {
    if (!req.session.secretWord) {
        req.session.secretWord = "syzygy"; // Initialize with default if not set
    }
    res.render("secretWord", { secretWord: req.session.secretWord });
});

app.post("/secretWord", (req, res) => {
    try {
        const input = req.body.secretWord;
        // Ensure the secret word is always a string
        req.session.secretWord =
            typeof input === "string" ? input : JSON.stringify(input);
    } catch (err) {
        req.session.secretWord = "Invalid input";
    }
    res.redirect("/secretWord");
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send(`That page (${req.url}) was not found.`);
});

// Handle other errors
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
