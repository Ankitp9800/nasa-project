// // const planets=[];
const fs = require("fs");
const path=require('path');
const par = require("csv-parse");
var promise=require('promise');
const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData(req, res) {
  return new promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname,'..','..', 'data',"kepler_data.csv"))
      .pipe(
        par.parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })

      .on("end", () => {
        console.log(`${habitablePlanets.length} habitablePlanets found!`);
        resolve();
      });
  });
}
module.exports = {
  planets: habitablePlanets,
  loadPlanetsData,
};

