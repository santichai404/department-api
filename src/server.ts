import express from "express";
var request = require("request");
const server = express();
const PORT = 3333;

server.get("/department", (req: any, res: any) => {
  request(
    "https://dummyjson.com/users",
    function (error: any, response: any, body: any) {
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
        const result: any = {};

        convertData.forEach((row: any) => {
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
          } else {
            const [minAge, maxAge] = result[department].ageRange
              .split("-")
              .map(Number);
            result[department].ageRange = `${Math.min(minAge, age)}-${Math.max(
              maxAge,
              age
            )}`;
          }

          const hairColor = row.hair.color;
          result[department].hair[hairColor] =
            (result[department].hair[hairColor] || 0) + 1;

          const userName = `${row.firstName}${row.lastName}`;
          result[department].addressUser[userName] = row.address.postalCode;
        });

        res.status(201).json(result);
      } else {
        res.status(500).json({ errorMessage: "Something went wrong" });
      }
    }
  );
});
server.get("/", (req: any, res: any) => {
  res.send("Welcome Santichai Yarasit Test API");
});
server.listen(PORT, () => console.log(`Server is started at port ${PORT}`));
