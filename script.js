const apiKey = "5eb11caa732e25bea867a16ad1018a3a";
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");
const error = document.getElementById("error");

// Detect User’s Location
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => getWeather("Muscat")
    ); // fallback
  } else {
    getWeather("Muscat");
  }
});

async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  displayWeather(data);
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    error.textContent = "Please enter a city name!";
    return;
  }
  getWeather(city);
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found!");

    const data = await response.json();
    displayWeather(data);
  } catch (err) {
    error.textContent = err.message;
    weatherResult.classList.add("hidden");
  }
}

function displayWeather(data) {
  error.textContent = "";
  weatherResult.classList.remove("hidden");

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temp.textContent = `🌡️ Temperature: ${Math.round(data.main.temp)} °C`;
  description.textContent = `🌥️ Condition: ${data.weather[0].description}`;

  feelsLike.textContent = `🤔 Feels like: ${Math.round(
    data.main.feels_like
  )} °C`;
  humidity.textContent = `💧 Humidity: ${data.main.humidity}%`;
  wind.textContent = `🌬️ Wind speed: ${data.wind.speed} m/s`;

  const iconCode = data.weather[0].icon;
  icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Automatically change background
  const weatherCondition = data.weather[0].main.toLowerCase();
  setBackground(weatherCondition);
}

function setBackground(condition) {
  let gradient;

  switch (condition) {
    case "clear":
      gradient = "linear-gradient(to right, #f5af19, #f12711)"; // sunny, warmer tone
      break;
    case "clouds":
      gradient = "linear-gradient(to right, #757f9a, #d7dde8)"; // cloudy gray-blue
      break;
    case "rain":
    case "drizzle":
      gradient = "linear-gradient(to right, #283e51, #485563)"; // rainy dark blue
      break;
    case "thunderstorm":
      gradient = "linear-gradient(to right, #232526, #414345)"; // dark storm
      break;
    case "snow":
      gradient = "linear-gradient(to right, #e0eafc, #cfdef3)"; // soft icy tone
      break;
    default:
      gradient = "linear-gradient(to right, #83a4d4, #b6fbff)"; // fallback
  }

  document.body.style.background = gradient;
}
