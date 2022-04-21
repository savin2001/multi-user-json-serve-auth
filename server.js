const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const router = jsonServer.router('./database.json')

const server = jsonServer.create();
const userdb = JSON.parse(fs.readFileSync("./users.json", "utf-8"));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

const SECRET_KEY = "12345678";

const expiresIn = "1h";

const createToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Checking if user is logged in
const isLoginAuthenticated = ({ email, password }) => {
    return (
        userdb.users.findIndex(
            (user) => user.email === email && user.password === password
        ) !== -1
    );
};
const isRegisterAuthenticated = ({ email}) => {
    return userdb.users.findIndex((user) => user.email === email) !== -1;
};

// Registration section
server.post("/api/auth/register", (req, res) => {
    const {  firstName, secondName, phone, email, userType, password } =
        req.body;

    // Checking if user exists
    if (isRegisterAuthenticated({ email})) {
        const status = 401;
        const message = "Email already exist";
        res.status(status).json({ status, message });
        return;
    }

    // Creating new user
    fs.readFile("./users.json", (err, data) => {
        if (err) {
            const status = 401;
            const message = err;
            res.status(status).json({ status, message });
            return;
        }

        data = JSON.parse(data.toString());
        let last_item_id = data.users[data.users.length - 1].id;
        data.users.push({
            id: last_item_id + 1,
            firstName: firstName,
            secondName: secondName,
            phone: phone,
            email: email,
            userType: userType,
            password: password,
        });
        let writeData = fs.writeFile(
            "./users.json",
            JSON.stringify(data),
            (err, result) => {
                if (err) {
                    const status = 401;
                    const message = err;
                    res.status(status).json({ status, message });
                    return;
                }
            }
        );
    });
    const access_token = createToken({ email, password });
    res.status(200).json({ access_token });
});

// Login section
server.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    // Checking if email and password are correct
    if (!isLoginAuthenticated({ email, password })) {
        const status = 401;
        const message = "Incorrect email or password";
        res.status(status).json({ status, message });
        return;
    }
    const access_token = createToken({ email, password });
    res.status(200).json({ access_token });
});

server.use(router)
// Server running
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});
