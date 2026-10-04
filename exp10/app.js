
const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 3000;

const client = new MongoClient("mongodb://127.0.0.1:27017");

app.use(express.urlencoded({ extended: true }));

let usersCollection;

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return entities[ch];
    });
}

async function startServer() {
    try {
        await client.connect();

        const database = client.db("RegistrationDB");
        usersCollection = database.collection("users");

        console.log("MongoDB Connected Successfully");

        app.get("/", function (req, res) {
            res.sendFile(path.join(__dirname, "home.html"));
        });

        app.post("/server", async function (req, res) {
            try {
                const data = req.body;

                if (
                    !data.name || !data.password || !data.age ||
                    !data.mobile || !data.email || !data.gender ||
                    !data.state || !data.skills
                ) {
                    return res.status(400).send("All fields are required.");
                }

                await usersCollection.insertOne({
                    name: data.name,
                    password: data.password,
                    age: Number(data.age),
                    mobile: data.mobile,
                    email: data.email,
                    gender: data.gender,
                    state: data.state,
                    skills: data.skills
                });

                res.redirect("/users");
            } catch (error) {
                console.error(error);
                res.status(500).send("Error saving user details.");
            }
        });

        app.get("/users", async function (req, res) {
            try {
                const users = await usersCollection.find(
                    {},
                    { projection: { password: 0 } }
                ).toArray();

                let html = "<!DOCTYPE html>";
                html += "<html><head><title>Registered Users</title>";
                html += "<style>";
                html += "body{font-family:Arial;margin:25px;background:#f2f2f2}";
                html += "table{width:100%;border-collapse:collapse;background:white}";
                html += "th,td{border:1px solid #ccc;padding:10px;text-align:left}";
                html += "th{background:#218838;color:white}";
                html += "</style></head><body>";
                html += "<h2>Registered Users</h2>";
                html += "<p><a href='/'>Register Another User</a></p>";
                html += "<table><tr>";
                html += "<th>Name</th><th>Age</th><th>Mobile</th>";
                html += "<th>Email</th><th>Gender</th><th>State</th>";
                html += "<th>Skills</th></tr>";

                users.forEach(function (user) {
                    html += "<tr>";
                    html += "<td>" + escapeHTML(user.name) + "</td>";
                    html += "<td>" + escapeHTML(user.age) + "</td>";
                    html += "<td>" + escapeHTML(user.mobile) + "</td>";
                    html += "<td>" + escapeHTML(user.email) + "</td>";
                    html += "<td>" + escapeHTML(user.gender) + "</td>";
                    html += "<td>" + escapeHTML(user.state) + "</td>";
                    html += "<td>" + escapeHTML(user.skills) + "</td>";
                    html += "</tr>";
                });

                html += "</table></body></html>";

                res.send(html);
            } catch (error) {
                console.error(error);
                res.status(500).send("Error retrieving user details.");
            }
        });

        app.listen(PORT, function () {
            console.log("Server running at http://localhost:" + PORT);
        });

    } catch (error) {
        console.error("Unable to connect to MongoDB:", error);
    }
}

startServer();
