require('dotenv').config();
const express = require("express");
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8000; // Use the provided PORT or default to 8000

const apiKey = process.env.OPENWEATHERMAP_API_KEY;
const homeFile = fs.readFileSync("public/home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

app.get("/", (req, res) => {
  axios.get(`http://api.openweathermap.org/data/2.5/weather?q=Rajasthan&units=metric&appid=${apiKey}`)
    .then(response => {
      const objdata = response.data;
      const arrData = [objdata];
      const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
      res.send(realTimeData);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      res.status(500).send("Error fetching weather data");
    });
});

// Serve static files (e.g., home.html) from a public directory
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
