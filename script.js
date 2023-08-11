const userTab = document.querySelector('#tab1');
const searchTab = document.querySelector('#tab2');

const panels = document.querySelector('#panels');

const permissionPanel = document.querySelector('#permissionPanel');
const grantLoc = document.querySelector('#grantLoc');

const searchPanel = document.querySelector('#searchPanel');
const searchbtn = document.querySelector('#searchbtn');
const searchip = document.querySelector('#searchip');

const loadingPanel = document.querySelector('#loadingPanel');

const weatherInfoPanel = document.querySelector('#weatherInfoPanel');

// Initial var
let currTab = userTab;
const API_KEY = "9880d278705643037e754cd16dad6cd0";
currTab.classList.add("bg-[rgba(219,226,239,0.5)]" , "rounded-[4px]")

// Tab swicth
function swicthTab(clickedTab) {
    if (clickedTab != currTab) {
        currTab.classList.remove("bg-[rgba(219,226,239,0.5)]" ,  "rounded-[4px]");
        currTab = clickedTab;
        currTab.classList.add("bg-[rgba(219,226,239,0.5)]" , "rounded-[4px]");

        if (!searchPanel.classList.contains("active")) {
            // if search tab is invisible make it visible
            weatherInfoPanel.classList.remove("active");
            permissionPanel.classList.remove("active");
            searchPanel.classList.add("active");
        }
        else {
            // if its visible make it invisible
            searchPanel.classList.remove("active");
            weatherInfoPanel.classList.remove("active");
            // display weatherinfo of local user
            getfromsessionStorage();
        }
    }
}

userTab.addEventListener('click',() => {
    swicthTab(userTab);
});
searchTab.addEventListener('click',() => {
    swicthTab(searchTab);
});

function getfromsessionStorage() {
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if (!localCoordinates) {
        permissionPanel.classList.add('active');
    }
    else {
        const coord = JSON.parse(localCoordinates);
        fecthWeatherinfo(coord);
    }
}

async function fecthWeatherinfo(coord) {
    const {lon , lat} = coord;
    // make permission invisible and loading visible
    permissionPanel.classList.remove('active');
    loadingPanel.classList.add('active');

    // API call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}3&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        // UI change
        loadingPanel.classList.remove('active');
        weatherInfoPanel.classList.add('active');
        // Dynamic values on ui
        renderweatherinfo(data);
    } catch (error) {
        loadingPanel.classList.remove('active');
    }
}

function renderweatherinfo(weatherInfo) {
    // fecth ui
    const cityName = document.querySelector('[cityName]');
    const countryIcon = document.querySelector('[countryIcon]');
    const weatherDesc = document.querySelector('[weatherDesc]');
    const weatherIcon = document.querySelector('[weatherIcon]');
    const temp = document.querySelector('[temp]');
    const windSpeed = document.querySelector('[windSpeed]');
    const humidity = document.querySelector('[humidity]');
    const cloud = document.querySelector('[cloud]');

    // fecth and put in 
    cityName.textContent = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${String(weatherInfo?.sys?.country).toLowerCase()}.png`;
    weatherDesc.textContent = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.textContent = `${weatherInfo?.main?.temp}°C`;
    windSpeed.textContent = `${weatherInfo?.wind?.speed}m/s`;
    humidity.textContent = `${weatherInfo?.main?.humidity}%`;
    cloud.textContent = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userCoord = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            sessionStorage.setItem('user-coordinates' , JSON.stringify(userCoord));
            fecthWeatherinfo(userCoord);
        });
    }
}
grantLoc.addEventListener('click' , getLocation);

// Search btn
searchbtn.addEventListener('click', () => {
    if (searchip.value === "")
        return;
    else 
        fecthSearchWeatherinfo(searchip.value);
});

async function fecthSearchWeatherinfo(city) {
    loadingPanel.classList.add('active');
    weatherInfoPanel.classList.remove('active');
    permissionPanel.classList.remove('active');

    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`);
        const data = await response.json();
        const searchCoord = {
            lat: data[0].lat,
            lon: data[0].lon
        };
        loadingPanel.classList.remove('active');
        weatherInfoPanel.classList.add('active');
        fecthWeatherinfo(searchCoord);
    } catch (error) {
        console.log('error');
    }
}
