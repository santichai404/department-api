"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var request = require("request");
const server = (0, express_1.default)();
const PORT = 3333;
server.get("/department", (req, res) => {
    request("https://dummyjson.com/users", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            const convertData = [];
            for (let i = 0; i < data.users.length; i++) {
                let payload = {
                    id: data.users[i].id,
                    firstName: data.users[i].firstName,
                    lastName: data.users[i].lastName,
                    department: data.users[i].company.department,
                    gender: data.users[i].gender,
                    age: data.users[i].age,
                    hair: data.users[i].hair,
                    address: data.users[i].address,
                };
                convertData.push(payload);
            }
            const result = {};
            convertData.forEach((row) => {
                const department = row.department;
                if (!result[department]) {
                    result[department] = {
                        male: 0,
                        female: 0,
                        ageRange: "",
                        hair: {},
                        addressUser: {},
                    };
                }
                result[department][row.gender]++;
                const age = row.age;
                if (!result[department].ageRange) {
                    result[department].ageRange = `${age}-${age}`;
                }
                else {
                    const [minAge, maxAge] = result[department].ageRange
                        .split("-")
                        .map(Number);
                    result[department].ageRange = `${Math.min(minAge, age)}-${Math.max(maxAge, age)}`;
                }
                const hairColor = row.hair.color;
                result[department].hair[hairColor] =
                    (result[department].hair[hairColor] || 0) + 1;
                const userName = `${row.firstName}${row.lastName}`;
                result[department].addressUser[userName] = row.address.postalCode;
            });
            res.status(201).json(result);
        }
        else {
            res.status(500).json({ errorMessage: "Something went wrong" });
        }
    });
});
server.get("/", (req, res) => {
    res.send("Welcome Santichai Yarasit Test API");
});
server.listen(PORT, () => console.log(`Server is started at port ${PORT}`));
