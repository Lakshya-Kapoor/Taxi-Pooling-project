const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//Months are always the same
(function populateMonths() {
  for (let i = 0; i < months.length; i++) {
    const option = document.createElement("option");
    option.textContent = months[i];
    monthSelect.appendChild(option);
  }
  monthSelect.value = "January";
})();

let previousDay;

function populateDays(month) {
  //Delete all of the children of the day dropdown
  //if they do exist
  while (daySelect.firstChild) {
    daySelect.removeChild(daySelect.firstChild);
  }
  //Holds the number of days in the month
  let dayNum;
  //Get the current year
  let year = yearSelect.value;

  if (
    month === "January" ||
    month === "March" ||
    month === "May" ||
    month === "July" ||
    month === "August" ||
    month === "October" ||
    month === "December"
  ) {
    dayNum = 31;
  } else if (
    month === "April" ||
    month === "June" ||
    month === "September" ||
    month === "November"
  ) {
    dayNum = 30;
  } else {
    //Check for a leap year
    if (new Date(year, 1, 29).getMonth() === 1) {
      dayNum = 29;
    } else {
      dayNum = 28;
    }
  }
  //Insert the correct days into the day <select>
  for (let i = 1; i <= dayNum; i++) {
    const option = document.createElement("option");
    option.textContent = i;
    daySelect.appendChild(option);
  }
  if (previousDay) {
    daySelect.value = previousDay;
    if (daySelect.value === "") {
      daySelect.value = previousDay - 1;
    }
    if (daySelect.value === "") {
      daySelect.value = previousDay - 2;
    }
    if (daySelect.value === "") {
      daySelect.value = previousDay - 3;
    }
  }
}

function populateYears() {
  //Get the current year as a number
  let year = new Date().getFullYear();
  //Make the previous 100 years be an option
  for (let i = 0; i < 100; i++) {
    const option = document.createElement("option");
    option.textContent = year + i;
    yearSelect.appendChild(option);
  }
}

populateDays(monthSelect.value);
populateYears();

yearSelect.onchange = function () {
  populateDays(monthSelect.value);
};
monthSelect.onchange = function () {
  populateDays(monthSelect.value);
};
daySelect.onchange = function () {
  previousDay = daySelect.value;
};

const hourSelect = document.getElementById("hour");
const minuteSelect = document.getElementById("minutes");

// Populate hours dropdown from 0 to 23
(function populateHours() {
  for (let i = 0; i < 24; i++) {
    const option = document.createElement("option");
    option.textContent = i.toString().padStart(2, "0"); // Zero-padding for single-digit hours
    hourSelect.appendChild(option);
  }
})();

// Populate minutes dropdown in multiples of 5 until 55
(function populateMinutes() {
  for (let i = 0; i <= 55; i += 5) {
    const option = document.createElement("option");
    option.textContent = i.toString().padStart(2, "0"); // Zero-padding for single-digit minutes
    minuteSelect.appendChild(option);
  }
})();

// Optional: Set default values
hourSelect.value = "00";
minuteSelect.value = "00";

const capacitySelect = document.getElementById("capacity");

(function populateCapacity() {
  for (let i = 2; i <= 10; i++) {
    const option = document.createElement("option");
    option.textContent = i;
    capacitySelect.appendChild(option);
  }
})();

async function displayBookedTaxis() {
  const jsonString = await fetch("http://localhost:3000/taxi-data/my-taxis");
  const response = await jsonString.json();

  const contianer = document.querySelector("#mySchedule-wrapper");

  for (const taxi of response) {
    let peopleData = "";
    for (const people of taxi.people) {
      peopleData += `<p>${people.name} ${people.phoneNo}</p>`;
    }
    contianer.innerHTML += `
      <div class="booked-taxi">
        <h2>Booked Taxi</h2>
        <div class="date-time">
          <p>${taxi.date}</p>
          <p>${taxi.time}</p>
        </div>
        <div class="people">
          ${peopleData}
        </div>
        <form action="/cancel-booking?_method=PATCH" method="post">
          <input type="hidden" name="taxiId" value="${taxi.uniqueId}">
          <button type="submit">Cancel</button>
        </form>
      </div>
    `;
  }
}

displayBookedTaxis();
