import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import mysql from "mysql";
import bcrypt from "bcrypt"

const app = express()
const PORT = 2000;
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "node_basics",
    password: "Daskis009"
});
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/info", (req, res) => {
    connection.query(`SELECT * from peoples;`, (err, result) => {
        res.json({result})
    })
})
app.get("/edit/:id", (req, res) => {
    connection.query(`SELECT * from peoples WHERE id = ?`, req.params.id, (e, r) => {

        const superpowers = []
        for (let [key, value] of Object.entries(r[0])) {
            if (key === "levitation" && (value) === "true") {
                superpowers.push(key)
            }
            if (key === "immortality" && (value) === "true") {
                superpowers.push(key)
            }
            if (key === "passing" && (value) === "true") {
                superpowers.push(key)
            }
        }
        res.json({data: r[0], superpowers: superpowers})
    })
})
app.post("/edit/:id", (req, res) => {
    if (req.body) {
        const data = {
            name: false,
            email: false,
            birthYear: false,
            sex: false,
            limbs: false,
            superpowers: false,
            biography: false
        }
        const NAME_REGEXT = /^[А-ЯЁ][а-яё]+$/
        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        if (!NAME_REGEXT.test(req.body.data.name)) {
            data.name = true;
        }
        if (!EMAIL_REGEXP.test(req.body.data.email)) {
            data.email = true;
        }
        if (!req.body.data.birthYear) {
            data.birthYear = true;
        }
        if (!req.body.data.sex) {
            data.sex = true;
        }
        if (!req.body.data.limbs) {
            data.limbs = true;
        }
        if (!req.body.data.biography) {
            data.biography = true;
        }
        if (!req.body.selectedSuperpowers.length) {
            data.superpowers = true
        }
        let f = false;
        for (const [key, value] of Object.entries(data)) {
            if (value) {
                f = true
            }
        }
        if (f) {
            res.json({fail: data})
        } else {
            const body = req.body.data;
            body.levitation = false;
            body.immortality = false;
            body.passing = false;
            if (req.body.selectedSuperpowers.includes("levitation")) {
                body.levitation = true
            }
            if (req.body.selectedSuperpowers.includes("immortality")) {
                body.immortality = true
            }
            if (req.body.selectedSuperpowers.includes("passing")) {
                body.passing = true
            }
            connection.query(`UPDATE peoples SET name = "${body.name}", email = "${body.email}", birthYear = "${body.birthYear}", sex = "${body.sex}",
                limbs = "${body.limbs}", levitation = "${body.levitation}", immortality = "${body.immortality}", passing = "${body.passing}",
                biography = "${body.biography}" WHERE id = ?;`, req.params.id)
            res.json({success: data})
        }
    }
})
app.get("/delete/:id", (req, res) => {
    console.log(req.params.id)
    connection.query(`DELETE FROM peoples WHERE id = "${req.params.id}";`, (e, r) => {
        res.json({success: "true"})
    })
})
app.post("/auth", (req, res) => {
    connection.query(`SELECT password from admin where login = ?`, req.body.login, (error, result) => {
        bcrypt.compare(req.body.password, result[0].password, (e, r) => {
            if (r) {
                res.json({success: true})
            } else {
                res.json({success: false})
            }
        })
    })
})
app.post("/new", (req, res) => {
    if (req.body) {
        const data = {
            name: false,
            email: false,
            birthYear: false,
            sex: false,
            limbs: false,
            superpowers: false,
            biography: false
        }
        const NAME_REGEXT = /^[А-ЯЁ][а-яё]+$/
        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        if (!NAME_REGEXT.test(req.body.data.name)) {
            data.name = true;
        }
        if (!EMAIL_REGEXP.test(req.body.data.email)) {
            data.email = true;
        }
        if (!req.body.data.birthYear) {
            data.birthYear = true;
        }
        if (!req.body.data.sex) {
            data.sex = true;
        }
        if (!req.body.data.limbs) {
            data.limbs = true;
        }
        if (!req.body.data.biography) {
            data.biography = true;
        }
        if (!req.body.selectedSuperpowers.length) {
            data.superpowers = true
        }
        let f = false;
        for (const [key, value] of Object.entries(data)) {
            if (value) {
                f = true
            }
        }
        if (f) {
            res.json({fail: data})
        } else {
            console.log(req.body)
            const body = req.body.data
            if (req.body.selectedSuperpowers.includes("levitation")) {
                body.levitation = true
            }
            if (req.body.selectedSuperpowers.includes("immortality")) {
                body.immortality = true
            }
            if (req.body.selectedSuperpowers.includes("passing")) {
                body.passing = true
            }
            console.log(body)
            connection.query(`INSERT INTO peoples (name, email, birthYear, sex, limbs, levitation, immortality, passing, biography) VALUES
                ("${req.body.data.name}", "${req.body.data.email}", "${req.body.data.birthYear}", "${req.body.data.sex}", "${req.body.data.limbs}",
                "${(req.body.data.levitation)}", "${(req.body.data.immortality)}", "${(req.body.data.passing)}", "${req.body.data.biography}");`)
            res.json({success: data})
        }
    }
})
app.get("/statistic", (req, res) => {
    const data = {}
    connection.query(`SELECT levitation FROM peoples WHERE levitation = "true";`, (e, result) => {
        data.levitation = Object.keys(result).length;

    })
    connection.query(`SELECT immortality FROM peoples WHERE immortality = "true";`, (e, result) => {
        data.immortality = Object.keys(result).length;

    })
    connection.query(`SELECT passing FROM peoples WHERE passing = "true";`, (e, result) => {
        data.passing = Object.keys(result).length;

    })
    setTimeout(() => {
        res.json(data)
    }, 200)
})

app.listen(PORT, () => {
    console.log("Server started on ", PORT)
})
