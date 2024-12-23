const apikey = "305ed99d42965d6c3750b76aa04a84de";
    const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
    const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

    const searchBox = document.querySelector(".search input");
    const searchButton = document.querySelector(".search button");
    const weatherIcon = document.querySelector(".weather-icon");
    const forecastContainer = document.querySelector(".forecast-container");
    const body = document.body;

    async function checkWeather(city) {
        const response = await fetch(weatherApiUrl + city + `&appid=${apikey}`);

        if (response.status === 404) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            document.querySelector(".forecast").style.display = "none";
        } else {
            const data = await response.json();
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "&deg;C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

            const weatherMain = data.weather[0].main;

            if (weatherMain === "Clouds") weatherIcon.src = "images/clouds.png";
            else if (weatherMain === "Clear") weatherIcon.src = "images/clear.png";
            else if (weatherMain === "Rain") weatherIcon.src = "images/rain.png";
            else if (weatherMain === "Drizzle") weatherIcon.src = "images/drizzle.png";
            else if (weatherMain === "Mist") weatherIcon.src = "images/mist.png";

            if (weatherMain === "Clouds") body.style.background = "url('clouds.jpg') no-repeat center center fixed";
            else if (weatherMain === "Clear") body.style.background = "url('clear.jpg') no-repeat center center fixed";
            else if (weatherMain === "Rain") body.style.background = "url('rain.jpg') no-repeat center center fixed";
            else if (weatherMain === "Drizzle") body.style.background = "url('drizzle.jpg') no-repeat center center fixed";
            else if (weatherMain === "Mist") body.style.background = "url('mist.jpg') no-repeat center center fixed";

            body.style.backgroundSize = "cover";

            document.querySelector(".weather").style.display = "block";
            
            document.querySelector(".error").style.display = "none";
            loadForecast(city);
        }
    }

    async function loadForecast(city) {
        const response = await fetch(forecastApiUrl + city + `&appid=${apikey}`);

        if (response.ok) {
            const data = await response.json();
            forecastContainer.innerHTML = ""; 

            const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

            dailyData.forEach(day => {
                const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "long"
                });
                const temp = Math.round(day.main.temp) + "&deg;C";
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

    searchButton.addEventListener("click", () => {
        const city = searchBox.value;
        checkWeather(city);
    });