document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("weatherForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    getWeather();
  });
});

function getWeather() {
  const apiKey = "33e5326ee4974170dbeba09048822085"; // 🔁 Replace with actual API key
  const city = document.getElementById("city").value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then((res) => res.json())
    .then((data) => displayWeather(data))
    .catch((err) => {
      console.error("Current weather error:", err);
      alert("Failed to fetch current weather data.");
    });

  fetch(forecastUrl)
    .then((res) => res.json())
    .then((data) => displayHourlyForecast(data.list))
    .catch((err) => {
      console.error("Forecast error:", err);
      alert("Failed to fetch forecast data.");
    });
}

function displayWeather(data) {
  const tempDiv = document.getElementById("temp-div");
  const infoDiv = document.getElementById("weather-info");
  const iconImg = document.getElementById("weather-icon");

  tempDiv.innerHTML = "";
  infoDiv.innerHTML = "";

  if (data.cod === "404") {
    infoDiv.innerHTML = `<p>${data.message}</p>`;
    return;
  }

  const city = data.name;
  const temp = Math.round(data.main.temp - 273.15);
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;


  tempDiv.innerHTML = `<p>${temp}°C</p>`;
  infoDiv.innerHTML = `<p>${city}</p><p>${desc}</p>`;
  iconImg.src = iconUrl;
  iconImg.alt = desc;
  iconImg.style.display = "block";
  
}

function displayHourlyForecast(hourlyData) {
  const forecastDiv = document.getElementById("hourly-forecast");
  forecastDiv.innerHTML = "";
  
  if (!hourlyData || !Array.isArray(hourlyData)) {
    alert("Failed to fetch forecast data.");
    return;
  }
   const next6 = hourlyData.slice(0, 6);;
 

  next6.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const hour = date.getHours();
    const temp = Math.round(item.main.temp - 273.15);
    const desc = item.weather[0].description;
    const icon = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

    const html = `
      <div class="hourly-item">
        <span class="hour">${hour}:00</span>
        <img src="${iconUrl}" alt="${desc}" />
        <span class="temp">${temp}°C</span>
      </div>
    `;
    forecastDiv.innerHTML += html;
  });
}
