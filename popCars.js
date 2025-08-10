const Car = require("./models/Car");

async function popCarsIfEmpty() {
  const carCount = await Car.countDocuments();
  if (carCount === 0) {
    const sampleCars = [
      {
        model: "Tesla Model Y",
        imageUrl: "https://source.unsplash.com/featured/?tesla",
        returnDate: ""
      },
      {
        model: "Honda Civic",
        imageUrl: "https://source.unsplash.com/featured/?honda-civic",
        returnDate: ""
      },
      {
        model: "Toyota Corolla",
        imageUrl: "https://source.unsplash.com/featured/?toyota-corolla",
        returnDate: ""
      },
      {
        model: "Ford Mustang",
        imageUrl: "https://source.unsplash.com/featured/?mustang",
        returnDate: ""
      },
      {
        model: "Chevrolet Camaro",
        imageUrl: "https://source.unsplash.com/featured/?camaro",
        returnDate: ""
      }
    ];

    await Car.insertMany(sampleCars);
    console.log("Sample cars inserted");
  } else {
    console.log("Cars already populated");
  }
}

module.exports = popCarsIfEmpty;
