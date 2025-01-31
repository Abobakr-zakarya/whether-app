// Nice work on creating a weather app! You’ve shown a good grasp of HTML, CSS,
// and JavaScript by organizing your code and adding important features like fetching weather data, a changing UI, and a 5-day forecast.
// Here are some specific things you did well and some areas where you can improve.

const apikey = "305ed99d42965d6c3750b76aa04a84de";
const weatherApiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl =
  "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

// NICE: Good use of `querySelector` to select elements efficiently.
// QUESTION: what are the other possible selectors
const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const forecastContainer = document.querySelector(".forecast-container");
const body = document.body;

// QUESTION: can you elaborate more on why you used the async keyword before this function
// IMPROVEMENT: it would be better if you use arrow function definition to align more with modern JavaScript practices.
async function checkWeather(city) {
  // QUESTION: why did you use await here
  // IMPROVEMENT: The variable response could have a clearer name, like weatherResponse, to make it obvious that it holds the API response.
  const response = await fetch(weatherApiUrl + city + `&appid=${apikey}`);

  // IMPROVEMENT: we need better error handling for the APIs try researching (try, catch)
  if (response.status === 404) {
    // IMPROVEMENT: Extract this block into a separate function, setErrorState(), to keep checkWeather() focused on fetching data rather than handling UI updates
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
    document.querySelector(".forecast").style.display = "none";
  } else {
    const data = await response.json();
    document.querySelector(".city").innerHTML = data.name;
    // IMPROVEMENT: Use template literals here (`${}`) instead of +, like you did in &appid=${apikey}. This makes the code more readable and avoids extra + operators.
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "&deg;C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    const weatherMain = data.weather[0].main;

    // IMPROVEMENT: create a function for setting weather icon and background setWeather(weatherMain), to handle this logic and avoid the repetition in the following 2 code blocks.
    // IMPROVEMENT: The code only handles five weather types. What if the API returns 'Sunny' or 'Showers'? Also, the API provides an icon property — why not use that?
    // IMPROVEMENT: we need to be displaying the weather text(description) not only the icon
    if (weatherMain === "Clouds") weatherIcon.src = "clouds.png";
    else if (weatherMain === "Clear") weatherIcon.src = "clear.png";
    else if (weatherMain === "Rain") weatherIcon.src = "rain.png";
    else if (weatherMain === "Drizzle") weatherIcon.src = "drizzle.png";
    else if (weatherMain === "Mist") weatherIcon.src = "mist.png";

    if (weatherMain === "Clouds")
      body.style.background = "url('clouds.jpg') no-repeat center center fixed";
    else if (weatherMain === "Clear")
      body.style.background = "url('clear.jpg') no-repeat center center fixed";
    else if (weatherMain === "Rain")
      body.style.background = "url('rain.jpg') no-repeat center center fixed";
    else if (weatherMain === "Drizzle")
      body.style.background =
        "url('drizzle.jpg') no-repeat center center fixed";
    else if (weatherMain === "Mist")
      body.style.background = "url('mist.jpg') no-repeat center center fixed";

    body.style.backgroundSize = "cover";

    document.querySelector(".weather").style.display = "block";

    document.querySelector(".error").style.display = "none";

    // NICE: Good call on making `loadForecast` a separate function rather than handling everything inside `checkWeather()`.
    // IMPROVEMENT: since this is an async function it's best to use await here before calling the function
    loadForecast(city);
  }
}

async function loadForecast(city) {
  const response = await fetch(forecastApiUrl + city + `&appid=${apikey}`);

  // IMPROVEMENT: If the API request fails due to network issues, the user won't know what happened. Wrap this in a try/catch block to display a meaningful error message instead of failing silently.
  if (response.ok) {
    const data = await response.json();
    forecastContainer.innerHTML = "";

    const dailyData = data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

    dailyData.forEach((day) => {
      // NICE: Smart choice filtering the forecast data to show midday temperatures only.
      // IMPROVEMENT: Extract this logic into a function (e.g., renderForecastDay(day)) so loadForecast() focuses only on getting data instead of handling the UI.
      const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const temp = Math.round(day.main.temp) + "&deg;C";

      // IMPROVEMENT: this const was never used
      const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

      const forecastDay = document.createElement("div");
      forecastDay.classList.add("forecast-day");
      forecastDay.innerHTML = `
                <div>${date}</div>
                    <div>${temp}</div>
                `;

      forecastContainer.appendChild(forecastDay);
    });
    document.querySelector(".forecast").style.display = "block";
  }
}

// IMPROVEMENT: Clicking the button repeatedly sends multiple API requests. Disable the button while fetching data and re-enable it when the request is done to prevent this.
searchButton.addEventListener("click", () => {
  // IMPROVEMENT: Before calling checkWeather(), check if searchBox.value.trim() is empty (Use `.trim()` to remove spaces before checking). If it is, show an error message instead of making an unnecessary API call.
  const city = searchBox.value;
  checkWeather(city);
});
