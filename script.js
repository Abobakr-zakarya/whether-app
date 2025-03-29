// Nice work on creating a weather app! You've shown a good grasp of HTML, CSS,
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
//// IMPROVEMENT: it would be better if you use arrow function definition to align more with modern JavaScript practices.

const loadForecast = async (city) => {
  try {
    const response = await fetch(`${forecastApiUrl}${city}&appid=${apikey}`);
  
    
      
    //// IMPROVEMENT: If the API request fails due to network issues, the user won't know what happened. Wrap this in a try/catch block to display a meaningful error message instead of failing silently.
    if (!response.ok) {   
      throw new Error(`Failed to fetch forecast: ${response.statusText}`);
    }
    
    const data = await response.json();
    forecastContainer.innerHTML = "";

    const dailyData = data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

     
    dailyData.forEach((day) => {
       
      // NICE: Smart choice filtering the forecast data to show midday temperatures only.
       
      // IMPROVEMENT: Extract this logic into a function (e.g., renderForecastDay(day)) so loadForecast() focuses only on getting data instead of handling the UI.
      const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
        weekday: "long"
      });
      const temp = `${Math.round(day.main.temp)}&deg;C`;
 

      //// IMPROVEMENT: this const was never used
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
  catch (error) {
    console.error("Error fetching forecast data:", error);
    document.querySelector(".error").textContent =
      "Failed to fetch forecast Please check your connection and try again";
    document.querySelector(".error").style.display = "block";
    document.querySelector(".forecast").style.display = "none";
  } 
   
};

//// IMPROVEMENT: Clicking the button repeatedly sends multiple API requests. Disable the button while fetching data and re-enable it when the request is done to prevent this.
searchButton.addEventListener("click", async () => {
  
   //// IMPROVEMENT: Before calling checkWeather(), check if searchBox.value.trim() is empty (Use `.trim()` to remove spaces before checking). If it is, show an error message instead of making an unnecessary API call.
  const city = searchBox.value.trim();

  if (!city) {
    document.querySelector(".error").textContent = "Please enter a city name.";
    document.querySelector(".error").style.display = "block";
    return;
  }
   
   
  searchButton.disabled = true;
  try {
    const response = await fetch(`${weatherApiUrl}${city}&appid=${apikey}`);  
    if (!response.ok) {
      throw new Error(`Failed to fetch weather: ${response.statusText}`);
    }
    
    const data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
     
     //// IMPROVEMENT: Use template literals here (`${}`) instead of +, like you did in &appid=${apikey}. This makes the code more readable and avoids extra + operators.
    document.querySelector(".temp").innerHTML = `${Math.round(data.main.temp)}&deg;C`;
    document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
    document.querySelector(".wind").innerHTML = `${data.wind.speed} km/h`;
    
    
     
    // Get icon directly from API
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
     
     
     
    await loadForecast(city);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.querySelector(".error").textContent =  
    "Failed to fetch weather data. Please check your connection and try again.";
    document.querySelector(".error").style.display = "block";
     
    document.querySelector(".weather").style.display = "none";
    document.querySelector(".forecast").style.display = "none";
  } finally {
    searchButton.disabled = false;
  }
});