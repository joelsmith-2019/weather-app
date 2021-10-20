window.addEventListener('load', () => {
    // Location DOM Elements
    const locTimezone = document.querySelector(".location-timezone");
    const locIcon = document.querySelector(".location-icon");
    
    // Degree DOM Elements
    const tempFormat = document.querySelector(".temperature-format");
    const tempDegree = document.querySelector(".temperature-format-degree");
    const tempUnit = document.querySelector(".temperature-format-unit")
    const tempDesc = document.querySelector(".temperature-description");

    // Temperature variable for click event
    let temp = 0;

    // Find location of user & display weather
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            // Find lat and long coords of user
            let lat = position.coords.latitude;
            let long = position.coords.longitude;

            // Call API through a proxy
            const proxy = "https://cors-anywhere.herokuapp.com/"
            const api = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=713eb25f0664c3f3268d80e8bb9b75f9`

            // Fetch API data
            fetch(api)
                .then(response => {
                    // Get API response and convert to JSON
                    return response.json();
                })
                .then(data => {
                    // Read JSON from API and pull out data
                    let loc = data.name;
                    temp = data.main.temp;
                    let weather = data.weather[0].main;

                    // Set DOM Elements from API
                    locTimezone.textContent = loc;
                    setIcon(weather);
                    tempDegree.textContent = convertToFahrenheit(temp);
                    tempUnit.textContent = "F";
                    tempDesc.textContent = weather;
                })
        })
    }

    // Set icon to match current weather pattern
    function setIcon(iconType) {
        const skycons = new Skycons({ color: "white" });

        // Find corresponding the corresponding
        let caps = iconType.toUpperCase();
        if (caps == "CLEAR") {
            let hour = new Date().getHours();
            iconType = hour >= 7 && hour <= 18 ? "CLEAR_DAY" : "CLEAR_NIGHT";
        } else if (caps.includes("CLOUD")) {
            iconType = "CLOUDY";
        } else if (caps.includes("RAIN")) {
            iconType = "RAIN";
        } else if (caps.includes("THUNDER")) {
            iconType = "PARTLY_CLOUDY_NIGHT"
        } else if (caps.includes("SNOW")) {
            iconType = "SNOW";
        } else {
            iconType = "CLEAR_DAY";
        }

        skycons.play();
        return skycons.set(locIcon, Skycons[iconType]);
    }

    // Click listener to change from Fah to Cel and vice versa
    tempFormat.addEventListener('click', () => {
        if (tempUnit.textContent === "F") {
            tempUnit.textContent = "C";
            tempDegree.textContent = convertToCelsius(temp);
        } else {
            tempUnit.textContent = "F";
            tempDegree.textContent = convertToFahrenheit(temp);
        }
    })

    // Convert Kelvin to Fahrenheit
    function convertToFahrenheit(kelvin) {
        return parseFloat((kelvin - 273.15) * 9 / 5 + 32).toFixed(2);
    }

    // Convert Kelvin to Celsius
    function convertToCelsius(kelvin) {
        return parseFloat(kelvin - 273.15).toFixed(2);
    }
});