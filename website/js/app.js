
// Personal API Key for OpenWeatherMap API
const zipSearch = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const citySearch = 'http://api.openweathermap.org/data/2.5/weather?q=';
const scaleSearch = '&units=';
const openWeatherAPI = '&appid={API}';
                  
// Event listener to add function to existing HTML DOM element
const generateButton = document.getElementById('generate');
generateButton.addEventListener('click', generateData);

/* Function called by event listener */
function generateData() {

  // Get user zip code data data
  const zip = document.getElementById('zip');
  const zipCode = zip.value;
  // Get user city data
  const cityName = document.getElementById('city');
  const city = cityName.value;
  // Get user scale data
  const scaleSelect = document.querySelector('input[name="scale"]:checked');
  let scale;
  let degrees;

  if (scaleSelect) {
    scale = scaleSelect.value;
  } else {
    scale = "imperial";
  }

  if (scale == "imperial") {
    degrees = "F";
  } else {
    degrees = "C";
  }

  // Get user thought data
  const thoughtsText = document.getElementById('feelings');

  // Create URL from user data
  let url;

  if (zipCode) {
    url = zipSearch + zipCode + scaleSearch + scale + openWeatherAPI;
  } else if (city) {
    url = citySearch + city + scaleSearch + scale + openWeatherAPI;
  }

  getWeatherData(url)
  
    // Update the UI
    .then(function (weatherData) {
      const error = document.getElementById('error-message');
      if (thoughtsText.value !== '' && weatherData.cod == '200') {
        error.classList.add('error-hide');
        const icon = weatherData.weather[0].icon;
        const location = weatherData.name;
        const countryCode = weatherData.sys.country;
        const date = generateDate();
        const temperature = weatherData.main.temp.toFixed(0);
        const thoughts = thoughtsText.value;
        postWeather('/add', { icon, location, countryCode, date, temperature, thoughts });

        // Refresh Data
        getWeather(degrees);
      } else {
        console.log('Incorrect Data');
        error.classList.remove('error-hide');
        return;
      }
    });
}

/* Function to GET Web API Data*/
async function getWeatherData(url) {
  const data = await fetch(url);
  const weatherData = await data.json();
  return weatherData;
}

/* Function to get user date and time */
function generateDate() {
  let d = new Date();
  let min = d.getMinutes();
  if (d.getMinutes() <= 9) {
    min = `0${min}`;
  }
  let newDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} at Time: ${d.getHours()}:${min} PST`;
  return newDate;
}

/* Function to POST data */
async function postWeather(url, data) {
    await fetch(url, {
      method: 'POST', 
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
      // Body data type must match "Content-Type" header        
      body: JSON.stringify(data), 
    });
}

/* Function to GET Project Data */
async function getWeather (degrees) {
  const data = await fetch('/all');
  const refreshData = await data.json();
  document.getElementById('icon').innerHTML = `<img class="icon" src="http://openweathermap.org/img/wn/${refreshData.icon}.png" alt="Weather icon">`;
  document.getElementById('location').innerHTML = `${refreshData.location}, ${refreshData.countryCode}`;
  document.getElementById('date').innerHTML = `Date: ${refreshData.date}`;
  document.getElementById('temp').innerHTML = `Temperature: ${refreshData.temperature}\xB0${degrees}`;
  document.getElementById('content').innerHTML = `Thoughts: ${refreshData.thoughts}`;
}
