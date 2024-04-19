function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
const dates = document.querySelector("#calendar");
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
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

async function renderCalendar() {
  document.querySelector("#month-display").textContent = months[month];
  document.querySelector("#year-display").textContent = year;

  const start = new Date(year, month, 1).getDay();
  const endDate = new Date(year, month + 1, 0).getDate();
  const end = new Date(year, month, endDate).getDay();
  const endDatePrev = new Date(year, month, 0).getDate();
  let datesHtml = "";

  for (let day of daysOfWeek)
    datesHtml += `<div class="day-of-week">${day}</div>`;

  for (let i = start; i > 0; i--) {
    try{
      let noOfTaxis = await fetch(`http://localhost:3000/taxi-data-day-wise/${endDatePrev-i+1}/${month>0?month-1:11}/${year}`);
      
      datesHtml += `<div class="clickable-div" onclick="renderDayCalendar(this)">
          <div class="date">
              ${endDatePrev - i + 1} <span class="date-month">${months[month > 0 ? month - 1 : 11].substring(0, 3)}</span>
          </div>
          <div class="no-of-taxis  unselectable">
          <span class='taxi-pool-no'>${await noOfTaxis.text()}</span>
          <span class="taxis">taxis</span>
          </div>
          </div>`;
    } catch(err) {
      console.log(err)
    }
  }

  for (let i = 1; i <= endDate; i++) {
    try {
      let noOfTaxis = await fetch(`http://localhost:3000/taxi-data-day-wise/${i}/${month}/${year}`)
      
      datesHtml += `<div class="clickable-div" onclick="renderDayCalendar(this)">
        <div class="date">
        ${i} <span class="date-month">${months[month].substring(0, 3)}</span>
        </div>
        <div class="no-of-taxis  unselectable">
        <span class='taxi-pool-no'>${await noOfTaxis.text()}</span> 
        <span class="taxis">taxis</span>
        </div>
        </div>`;
    } catch(err) {
      console.log(err);
    }
  }

  for (let i = end; i < 6; i++) {
    try {
      let noOfTaxis = await fetch(`http://localhost:3000/taxi-data-day-wise/${i-end+1}/${month<11?month+1:0}/${year}`)
      
      datesHtml += `<div class="clickable-div" onclick="renderDayCalendar(this)">
      <div class="date">
      ${i - end + 1} <span class="date-month">${months[month < 11 ? month + 1 : 0].substring(0, 3)}</span>
      </div>
      <div class="no-of-taxis  unselectable">
        <span class='taxi-pool-no'>${await noOfTaxis.text()}</span>
        <span class="taxis">taxis</span>
      </div>
      </div>`;
    } catch(err) {
      console.log(err);
    }
  }
  dates.innerHTML = datesHtml;
}

renderCalendar();

function changeCalendar(num) {
  num == 1 ? month++ : month--;
  if (month == 12) {
    month = 0;
    year++;
  } else if (month == -1) {
    month = 11;
    year--;
  }
  renderCalendar();
}

function renderDayCalendar(element) {
  const dayCalendar = document.querySelector("#day-calendar");
  let htmlContent = `
  <div id="calendar-heading">
    <div class="day"></div>
    <img src="close-icon.svg" alt="close-icon" id="close-icon" onclick="closeDayCalendar()">
  </div>`;
  for (let i = 0; i <= 23; i++) {
    let str;
    if (i <= 8) {
      str = "0" + i + ":00-0" + (i + 1) + ":00";
    } else if (i == 9) {
      str = "0" + i + ":00-" + (i + 1) + ":00";
    } else {
      str = i + ":00-" + (i + 1) + ":00";
    }
    htmlContent += `<div class="hour" onclick="toggleCabList(this, event)">
    <div class="title">
      <p class="time-interval">${str}</p>
      <p class="no-of-taxis  unselectable"><span class='taxi-pool-no'>0</span> taxis</p>
      <img src="dropdown-icon.svg" alt="dropdown-icon" class="dropdown-icon" onclick="dropDownMenu(this, event)">
      <img src="dropup-icon.svg" alt="dropup-icon" class="dropup-icon hidden" onclick="dropUp(this, event)">
    </div>
    </div>`;
  }
  dayCalendar.innerHTML = htmlContent;
  document.querySelector(".day").textContent =
    element.querySelector(".date").textContent;
  document.querySelector("#overlay").classList.add("active");
  document.querySelector("#day-calendar").classList.add("active");
}

function closeDayCalendar() {
  document.querySelector("#overlay").classList.remove("active");
  document.querySelector("#day-calendar").classList.remove("active");
}

function toggleCabList(hourDiv) {
  if (hourDiv.querySelector('.dropup-icon').classList.contains('hidden')){
    dropDownMenu(hourDiv.querySelector('.dropdown-icon'), null);
  }
  else {
    dropUp(hourDiv.querySelector('.dropup-icon'), null);
  }
}

function dropDownMenu(element, event) {
  if (event != null)
    event.stopPropagation();
  element.parentNode.querySelector(".dropdown-icon").classList.add("hidden");
  element.parentNode.querySelector(".dropup-icon").classList.remove("hidden");
  let hourDiv = element.parentNode.parentNode;
  hourDiv.innerHTML += `<div class="taxi-event">
  <div class="join-pool">
  <p class="time">10:00</p>
  <img src="tick.svg" alt="accept" class="tick-icon">
  </div>
  <div class="details">
  <p>Lakshya Kapoor 1234567890</p>
  <p>Shantanu 1234567890</p>
  <p>Kaushalraj 1234567890</p>
  </div>
  </div>`;
}

function dropUp(element, event) {
  if (event != null)
    event.stopPropagation();
  element.parentNode.querySelector(".dropdown-icon").classList.remove("hidden");
  element.parentNode.querySelector(".dropup-icon").classList.add("hidden");
  element.parentNode.parentNode.querySelector('.taxi-event').remove();  
}