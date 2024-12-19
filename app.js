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

const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use(require("connect-flash")());

app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
    res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));

app.get("/secretWord", (req, res) => {
    if (!req.session.secretWord) {
        req.session.secretWord = "syzygy"; // Initialize with default if not set
    }

    // Retrieve flash messages
    const errors = req.flash("error");
    const info = req.flash("info");

    res.render("secretWord", {
        secretWord: req.session.secretWord,
        errors,
        info
    });
});

app.post("/secretWord", (req, res) => {
    try {
        const input = req.body.secretWord;

        if (typeof input === "string" && input.toUpperCase()[0] === "P") {
            req.flash("error", "That word won't work!");
            req.flash("error", "You can't use words that start with 'P'.");
        } else {
            // Ensure secretWord is always a string
            req.session.secretWord =
                typeof input === "string" ? input : JSON.stringify(input);
            req.flash("info", "The secret word was changed.");
        }
    } catch (err) {
        req.flash("error", "Invalid input.");
    }
    res.redirect("/secretWord");
});

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await require("./db/connect")(process.env.MONGO_URI);
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
