const mongoose = require('mongoose')
const Taxi = require('./models/taxi.js')

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/realTaxi");
}

let date = new Date();
let ISOdate = date.toISOString();

Taxi.deleteMany({})

Taxi.create({
    date: ISOdate,
    capacity: 4,
    hours: 10,
    minutes: 30
})

Taxi.create({
    date: ISOdate,
    capacity: 3,
    hours: 12,
    minutes: 30
})

Taxi.create({
    date: ISOdate,
    capacity: 4,
    hours: 15,
    minutes: 30
})

Taxi.create({
    date: ISOdate,
    capacity: 2,
    hours: 10,
    minutes: 30
})

date.setDate = date.getDate + 1;
ISOdate = date.toISOString()

Taxi.create({
    date: ISOdate,
    capacity: 7,
    hours: 10,
    minutes: 30
})

Taxi.create({
    date: ISOdate,
    capacity: 3,
    hours: 11,
    minutes: 30
})

Taxi.create({
    date: ISOdate,
    capacity: 2,
    hours: 9,
    minutes: 30
})



