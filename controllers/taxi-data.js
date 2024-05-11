const mongoose = require("mongoose");
const Taxi = require("../models/taxi.js");
const User = require("../models/user.js");

const get_day_wise = async (req, res) => {
  let queryDate = new Date(
    Number(req.params.year),
    Number(req.params.month),
    Number(req.params.day)
  );
  queryDate.setHours(0, 0, 0, 0);
  let queryDateEnd = new Date(queryDate);
  queryDateEnd.setHours(23, 59, 59, 999);
  const noOfTaxis = await Taxi.countDocuments({
    $and: [
      { date: { $gte: queryDate, $lte: queryDateEnd } },
      { people: { $nin: [req.user._id] } },
    ],
  });
  res.send(`${noOfTaxis}`);
};

const get_hour_wise = async (req, res) => {
  let queryDate = new Date(
    Number(req.params.year),
    Number(req.params.month),
    Number(req.params.day)
  );
  queryDate.setHours(0, 0, 0, 0);
  let queryDateEnd = new Date(queryDate);
  queryDateEnd.setHours(23, 59, 59, 999);

  let queryTime = Number(req.params.hour);
  const noOfTaxis = await Taxi.countDocuments({
    $and: [
      { date: { $gte: queryDate, $lte: queryDateEnd } },
      { hours: queryTime },
      { people: { $nin: [req.user._id] } },
    ],
  });
  res.send(`${noOfTaxis}`);
};

const get_booked_taxis = async (req, res) => {
  let queryDate = new Date(
    Number(req.params.year),
    Number(req.params.month),
    Number(req.params.day)
  );
  queryDate.setHours(0, 0, 0, 0);
  let queryDateEnd = new Date(queryDate);
  queryDateEnd.setHours(23, 59, 59, 999);
  let queryTime = Number(req.params.hour);

  const taxis = await Taxi.find(
    {
      $and: [
        { date: { $gte: queryDate, $lte: queryDateEnd } },
        { hours: queryTime },
        { people: { $nin: [req.user._id] } },
      ],
    },
    { people: 1, hours: 1, minutes: 1 }
  );

  const taxiData = [];

  for (const taxi of taxis) {
    const peopleData = [];
    for (const person of taxi.people) {
      peopleData.push({
        name: (await User.findById(person, { name: 1, _id: 0 })).name,
        phoneNo: (await User.findById(person, { phoneNo: 1, _id: 0 })).phoneNo,
      });
    }
    taxiData.push({
      uniqueId: taxi._id,
      time: String(taxi.hours) + ":" + String(taxi.minutes),
      people: peopleData,
    });
  }
  const jsonString = JSON.stringify(taxiData);
  res.send(jsonString);
};

const get_my_taxis = async (req, res) => {
  const user = req.user;
  const taxis = await Taxi.find(
    { people: { $in: [user._id] } },
    { capacity: 0 }
  );

  const taxiData = [];
  for (const taxi of taxis) {
    const peopleData = [];
    for (const person of taxi.people) {
      peopleData.push({
        name: (await User.findById(person, { name: 1, _id: 0 })).name,
        phoneNo: (await User.findById(person, { phoneNo: 1, _id: 0 })).phoneNo,
      });
    }
    const date = String(new Date(taxi.date)).substring(0, 10);
    taxiData.push({
      uniqueId: taxi._id,
      date: date,
      time: String(taxi.hours) + ":" + String(taxi.minutes),
      people: peopleData,
    });
  }
  const jsonString = JSON.stringify(taxiData);
  res.send(jsonString);
};

module.exports = {
  get_day_wise,
  get_hour_wise,
  get_booked_taxis,
  get_my_taxis,
};
