let currentWeatherData = null;

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "a5f252bf2f094225947170708252004";

  if (city === "") {
    alert("Please enter a city.");
    return;
  }

  const currentUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=7&aqi=yes`;

  fetch(currentUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error.message);
        return;
      }

      currentWeatherData = data;
      document.getElementById("weatherInfo").style.display = "block";

      updateTemperature();

      document.getElementById("condition").innerText = `Condition: ${data.current.condition.text}`;
      document.getElementById("humidity").innerText = `Humidity: ${data.current.humidity}%`;
      document.getElementById("air-quality").innerText = `Air Quality: ${getAQILevel(data.current.air_quality["us-epa-index"])}`;
      document.getElementById("localTime").innerText = `Local Time: ${data.location.localtime}`;
      document.getElementById("emojiMode").innerText = `Mood: ${getWeatherEmoji(data.current.condition.text)}`;
      updateWeatherIcon(data.current.condition.text);
      playMusicForWeather(data.current.condition.text);
      displayForecast(data.forecast.forecastday);
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to get weather data.");
    });
}

function updateTemperature() {
  if (!currentWeatherData) return;
  const isCelsius = document.getElementById("unitToggle").value === "C";
  const temp = isCelsius
    ? currentWeatherData.current.temp_c + "°C"
    : currentWeatherData.current.temp_f + "°F";
  document.getElementById("temp").innerText = temp;
}

function getAQILevel(index) {
  const levels = {
    1: "Good 😊",
    2: "Moderate 😐",
    3: "Unhealthy for Sensitive Groups 😷",
    4: "Unhealthy 😷",
    5: "Very Unhealthy 😫",
    6: "Hazardous ☠️",
  };
  return levels[index] || "Unknown";
}

function getWeatherEmoji(condition) {
  condition = condition.toLowerCase();
  if (condition.includes("sunny")) return "☀️";
  if (condition.includes("cloud")) return "☁️";
  if (condition.includes("rain")) return "🌧️";
  if (condition.includes("snow")) return "❄️";
  if (condition.includes("thunder")) return "⛈️";
  return "🌡️";
}

function updateWeatherIcon(condition) {
  const icon = document.getElementById("weatherIcon");
  let gif = "";

  condition = condition.toLowerCase();
  if (condition.includes("sunny")) gif = "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif";
  else if (condition.includes("cloud")) gif = "https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif";
  else if (condition.includes("rain")) gif = "https://media.giphy.com/media/26u4b45b8KlgAB7iM/giphy.gif";
  else if (condition.includes("snow")) gif = "https://media.giphy.com/media/xT0GqeSlGSRQut4XbG/giphy.gif";
  else if (condition.includes("thunder")) gif = "https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif";
  else gif = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";

  icon.innerHTML = `<img src="${gif}" alt="Weather Icon" />`;
}

function playMusicForWeather(condition) {
  const music = document.getElementById("weatherMusic");
  let src = "";

  condition = condition.toLowerCase();
  if (condition.includes("sunny")) src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  else if (condition.includes("rain")) src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
  else if (condition.includes("snow")) src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";
  else if (condition.includes("thunder")) src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";
  else src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3";

  music.src = src;
  music.play();
}

function displayForecast(days) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "<h3>7-Day Forecast</h3>";
  days.forEach((day) => {
    forecastDiv.innerHTML += `
      <div class="forecast-day">
        <strong>${day.date}</strong><br>
        🌡️ ${day.day.avgtemp_c}°C / ${day.day.condition.text}<br>
        ${getWeatherEmoji(day.day.condition.text)}
      </div>
    `;
  });
}
