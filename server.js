const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const router = jsonServer.router("./database.json");

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

// Checking if customer is logged in
const isCustomerLoginAuthenticated = ({ email, password }) => {
    return (
        userdb.customers.findIndex(
            (customer) =>
                customer.email === email && customer.password === password
        ) !== -1
    );
};
// Checking if customer is logged in
const isCustomerRegisterAuthenticated = ({ email }) => {
    return (
        userdb.customers.findIndex((customer) => customer.email === email) !==
        -1
    );
};

// Registration section
server.post("/api/auth/register/customer", (req, res) => {
    const { firstName, secondName, phone, email, userType, password } =
        req.body;

    // Checking if user exists
    if (isCustomerRegisterAuthenticated({ email })) {
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
        let last_item_id = data.customers[data.customers.length - 1].id;
        data.customers.push({
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
server.post("/api/auth/login/customer", (req, res) => {
    const { email, password } = req.body;

    // Checking if email and password are correct
    if (!isCustomerLoginAuthenticated({ email, password })) {
        const status = 401;
        const message = "Incorrect email or password";
        res.status(status).json({ status, message });
        return;
    }
    const access_token = createToken({ email, password });
    res.status(200).json({ access_token });
});



// Checking if vendor is logged in
const isVendorLoginAuthenticated = ({ email, password }) => {
    return (
        userdb.vendors.findIndex(
            (vendor) =>
            vendor.email === email && vendor.password === password
        ) !== -1
    );
};
// Checking if vendor is logged in
const isVendorRegisterAuthenticated = ({ email }) => {
    return (
        userdb.vendors.findIndex((vendor) => vendor.email === email) !==
        -1
    );
};

// Vendor Registration section
server.post("/api/auth/register/vendor", (req, res) => {
    const { firstName, secondName, phone, email, userType, password } =
        req.body;

    // Checking if user exists
    if (isVendorRegisterAuthenticated({ email })) {
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
        let last_item_id = data.vendors[data.vendors.length - 1].id;
        data.vendors.push({
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

// Vendor Login section
server.post("/api/auth/login/vendor", (req, res) => {
    const { email, password } = req.body;

    // Checking if email and password are correct
    if (!isVendorLoginAuthenticated({ email, password })) {
        const status = 401;
        const message = "Incorrect email or password";
        res.status(status).json({ status, message });
        return;
    }
    const access_token = createToken({ email, password });
    res.status(200).json({ access_token });
});


// Checking if guest is logged in
const isGuestLoginAuthenticated = ({ email, password }) => {
    return (
        userdb.guests.findIndex(
            (guest) =>
            guest.email === email && guest.password === password
        ) !== -1
    );
};
// Checking if guest is logged in
const isGuestRegisterAuthenticated = ({ email }) => {
    return (
        userdb.guests.findIndex((guest) => guest.email === email) !==
        -1
    );
};

// Vendor Registration section
server.post("/api/auth/register/guest", (req, res) => {
    const { firstName, secondName, phone, email, userType, password } =
        req.body;

    // Checking if user exists
    if (isGuestRegisterAuthenticated({ email })) {
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
        let last_item_id = data.guests[data.guests.length - 1].id;
        data.guests.push({
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

// Vendor Login section
server.post("/api/auth/login/guest", (req, res) => {
    const { email, password } = req.body;

    // Checking if email and password are correct
    if (!isGuestLoginAuthenticated({ email, password })) {
        const status = 401;
        const message = "Incorrect email or password";
        res.status(status).json({ status, message });
        return;
    }
    const access_token = createToken({ email, password });
    res.status(200).json({ access_token });
});



server.use(router);
// Server running
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});
