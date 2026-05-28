import "./styles.css";
import { addDays, format } from "date-fns"

const lat_lon_button = document.getElementById("latlon");
const submit_button = document.getElementById("submit");
const query_input = document.querySelector("input[name='query-input']");
const card_container = document.querySelector(".card-container")

const apiKey = "7JGY2ZM65TFBZTW8VW5VWQD6T";
let location = "";

async function getWeatherAPI(query, numdays = 6) {
  const startDate = format(new Date(), "yyyy-MM-dd");
  const endDate = format(addDays(new Date(), numdays), "yyyy-MM-dd");
  const request = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}/${startDate}/${endDate}?unitGroup=metric&key=${apiKey}&contentType=json`;

  console.log(request);
  const res = await fetch(request);
  return res.json();
}

function addWeatherCard({date, temp, hum, descrpt}){
    const card_dom = {
        "Date": document.createElement("p"),
        "Temperature": document.createElement("p"),
        "Humidity": document.createElement("p"),
        "Description": document.createElement("p"),
    }

    const card_data = {
        "Date": format(new Date(date), "do MMM, yyyy"),
        "Temperature": temp,
        "Humidity": hum,
        "Description": descrpt,
    }

    const card = document.createElement("div");
    card.classList.add("card");
    Object.entries(card_dom).forEach(([key, value]) => {
        value.innerHTML = `<p>${key}: <span class="date">${card_data[key]}</span></p>`
        card.appendChild(value);
    })
    card_container.appendChild(card);
}

function addCards(days) {
    days.forEach(day => addWeatherCard({
        date: day.datetime,
        temp: day.temp,
        hum: day.humidity,
        descrpt: day.description
    }))
}

submit_button.addEventListener("click", (event) => {
  event.preventDefault();
  const query = query_input.value;
  getWeatherAPI(query).then((result) => addCards(result.days));
});

lat_lon_button.addEventListener("click", (event) => {
  event.preventDefault();
  function success(pos) {
    const coord = pos.coords;
    location = `${coord.latitude}%2C${coord.longitude}`;
    getWeatherAPI(location).then((result) => addCards(result.days));
  }

  function error(err) {
    alert(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error);
});
