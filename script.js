const body = document.querySelector("body");
// fetch weather data for that specific city/country
async function loadWeatherData(city, country, unit)
{
    try 
    {
        let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city},${country}?unitGroup=${unit}&include=current&elements=datetime,temp,humidity,windspeed,conditions`);
        if (!response.ok)
        {
            throw new Error("Error fetching data");
        }
        let weather = await response.json();
        console.log(weather);
        return weather;
    } catch(error) {
        console.log(error);
    }  
}
// displays the current weather in the webpage
async function displayCurrentWeather(weather, city, country)
{
    try 
    {
        // removes current weather of another city displayed
        const oldCurrent = document.querySelector(".current-weather-card")
        if (oldCurrent) {oldCurrent.remove();}

        // creates a new current weather card and displays it on the page
        const currentWeather = weather.currentConditions;
        const currentCard = document.createElement("div");
        currentCard.classList.toggle("current-weather-card");
        const h2 =  document.createElement("h2");
        h2.textContent = `Current Weather in ${city}, ${country}:`;

        const condition = document.createElement("p");
        const humidity = document.createElement("p");
        const temp = document.createElement("p");
        const wind = document.createElement("p");
        condition.textContent = `Current Condition: ${currentWeather.conditions}`;
        humidity.textContent = `Current Humidity: ${currentWeather.humidity}`;
        temp.textContent = `Current Tempurature: ${currentWeather.temp}`;
        wind.textContent = `Current Wind Speed: ${currentWeather.windspeed}`;
        
        currentCard.appendChild(h2);
        currentCard.appendChild(condition);
        currentCard.appendChild(humidity);
        currentCard.appendChild(temp);
        currentCard.appendChild(wind);
        body.appendChild(currentCard);

    } catch(error){
        console.log(error);
    }
    
}
// removes any of the weekly data displayed for a city that the user search for previously
function removeWeeklyCards(weeklyCards)
{
    for (let i = 0; i < weeklyCards.length; i++)
    {
        weeklyCards[i].remove();
    }
}
// displays the weather for the next 8 days
async function displayWeeklyWeather(weather)
{
    try 
    {
        // makes sure to remove all previous displayed weekly weather cars
        const oldWeek = document.querySelectorAll(".weekly-weather-card")
        if (oldWeek) {removeWeeklyCards(oldWeek);}

        // makes sure the header remains on top of the display weekly weather cards
        let h2 = document.querySelector(".weekly-head");
        if (!h2)
        {
            h2 = document.createElement("h2");
            h2.classList.toggle("weekly-head")
            h2.textContent = "Weather for the next 7 days: ";
        }
        else {h2.remove();}
        body.appendChild(h2);

        // for each day in weather.days, display a weekly weather card for it
        const weeklyWeather = weather.days;
        for (let i = 1; i < weeklyWeather.length; i++)
        {
            const currentCard = document.createElement("div");
            currentCard.classList.toggle("weekly-weather-card");
            const h3 =  document.createElement("h3");
            h3.textContent = `${weeklyWeather[i].datetime}`;

            const condition = document.createElement("p");
            const humidity = document.createElement("p");
            const temp = document.createElement("p");
            const wind = document.createElement("p");

            condition.textContent = `Condition: ${weeklyWeather[i].conditions}`;
            humidity.textContent = `Humidity: ${weeklyWeather[i].humidity}`;
            temp.textContent = `Temperature: ${weeklyWeather[i].temp}`;
            wind.textContent = `Wind Speed: ${weeklyWeather[i].windspeed}`;

            currentCard.appendChild(h3);
            currentCard.appendChild(condition);
            currentCard.appendChild(humidity);
            currentCard.appendChild(temp);
            currentCard.appendChild(wind);

            body.appendChild(currentCard);
        }
    }catch(error)
    {
        console.log(error);
    }
}

// displays weather for the entered city 
async function displayWeather(city, country, unit)
{
    const weather = await loadWeatherData(city, country, unit);
    await displayCurrentWeather(weather, city, country);  
    displayWeeklyWeather(weather);
}


const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const country = document.getElementById("country");
    const city = document.getElementById("city");
    const us = document.getElementById("us");
    const metric = document.getElementById("metric");

    if (us.checked)
    {
        displayWeather(city.value, country.value, "us")
    }
    else if (metric.checked)
    {
        displayWeather(city.value, country.value, "metric")
    }
    else
    {
        console.log("unit must be checked");
    }
})
