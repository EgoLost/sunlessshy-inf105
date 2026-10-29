// LOCALISATION

const translations = {
    en: {
        home: "[0] Home",
        about: "[1] About me",
        skills: "[2] Skills",
        projects: "[3] Projects",
        contacts: "[4] Contacts",

        systemTitle: "SYSTEM",
        statusTitle: "STATUS",

        timeLabel: "TIME:",
        dateLabel: "DATE:",
        weatherLabel: "WEATHER:",
        visitsLabel: "VISITS:",
        uptimeLabel: "UPTIME:",
        displayLabel: "DISPLAY:",
        cursorLabel: "CURSOR:",
        languageLabel: "LANGUAGE:",
        BUILDLabel: "BUILD:",
        accessCodeLabel: "ACCESS CODE:",
        networkStatusLabel: "STATUS:",
        systemMessageLabel: "SYS:",

        online: "ONLINE",
        offline: "OFFLINE",

        systemNominal: "SYSTEM NOMINAL",
        networkStable: "NETWORK STABLE",
        secureConnection: "SECURE CONNECTION",
        noThreats: "NO THREATS DETECTED",
        databaseOnline: "DATABASE ONLINE",
        accessGranted: "ACCESS GRANTED",
        coreSystemOnline: "CORE SYSTEM ONLINE",
        connectionEncrypted: "CONNECTION ENCRYPTED",
        allSystemsOperational: "ALL SYSTEMS OPERATIONAL",
        connectionLost: "CONNECTION LOST",

        clear: "CLEAR",
        cloudy: "CLOUDY",
        fog: "FOG",
        drizzle: "DRIZZLE",
        rain: "RAIN",
        snow: "SNOW",
        showers: "SHOWERS",
        thunderstorm: "THUNDERSTORM",
        unknown: "UNKNOWN",
        connectionError: "CONNECTION ERROR",

        footerText: "created by luck and with hope"
    },

    ru: {
        home: "[0] Главная",
        about: "[1] Обо мне",
        skills: "[2] Навыки",
        projects: "[3] Проекты",
        contacts: "[4] Контакты",

        systemTitle: "СОСТОЯНИЕ",
        statusTitle: "СИСТЕМЫ",

        timeLabel: "ВРЕМЯ:",
        dateLabel: "ДАТА:",
        weatherLabel: "ПОГОДА:",
        visitsLabel: "ВИЗИТЫ:",
        uptimeLabel: "СЕССИЯ:",
        displayLabel: "ЭКРАН:",
        cursorLabel: "КУРСОР:",
        languageLabel: "ЯЗЫК:",
        BUILDLabel: "ВЕРСИЯ:",
        accessCodeLabel: "КОД ДОСТУПА:",
        networkStatusLabel: "СТАТУС:",
        systemMessageLabel: "СИСТЕМА:",

        online: "В СЕТИ",
        offline: "НЕ В СЕТИ",

        systemNominal: "СИСТЕМА В НОРМЕ",
        networkStable: "СЕТЬ СТАБИЛЬНА",
        secureConnection: "СОЕДИНЕНИЕ ЗАЩИЩЕНО",
        noThreats: "УГРОЗ НЕ ОБНАРУЖЕНО",
        databaseOnline: "БАЗА ДАННЫХ В СЕТИ",
        accessGranted: "ДОСТУП РАЗРЕШЁН",
        coreSystemOnline: "ЯДРО СИСТЕМЫ АКТИВНО",
        connectionEncrypted: "СОЕДИНЕНИЕ ЗАШИФРОВАНО",
        allSystemsOperational: "ВСЕ СИСТЕМЫ В НОРМЕ",
        connectionLost: "СОЕДИНЕНИЕ ПОТЕРЯНО",

        clear: "ЯСНО",
        cloudy: "ОБЛАЧНО",
        fog: "ТУМАН",
        drizzle: "МОРОСЬ",
        rain: "ДОЖДЬ",
        snow: "СНЕГ",
        showers: "ЛИВЕНЬ",
        thunderstorm: "ГРОЗА",
        unknown: "НЕИЗВЕСТНО",
        connectionError: "ОШИБКА СОЕДИНЕНИЯ",

        footerText: "создано на удаче и надежде"
    },

    no: {
        home: "[0] Hjem",
        about: "[1] Om meg",
        skills: "[2] Ferdigheter",
        projects: "[3] Prosjekter",
        contacts: "[4] Kontakt",

        systemTitle: "SYSTEM",
        statusTitle: "STATUS",

        timeLabel: "TID:",
        dateLabel: "DATO:",
        weatherLabel: "VÆR:",
        visitsLabel: "BESØK:",
        uptimeLabel: "ØKT:",
        displayLabel: "SKJERM:",
        cursorLabel: "MARKØR:",
        languageLabel: "SPRÅK:",
        BUILDLabel: "VERSJON:",
        accessCodeLabel: "TILGANGSKODE:",
        networkStatusLabel: "STATUS:",
        systemMessageLabel: "SYSTEM:",

        online: "TILKOBLET",
        offline: "FRAKOBLET",

        systemNominal: "SYSTEM NORMALT",
        networkStable: "NETTVERK STABILT",
        secureConnection: "SIKKER TILKOBLING",
        noThreats: "INGEN TRUSLER OPPDAGET",
        databaseOnline: "DATABASE TILKOBLET",
        accessGranted: "TILGANG GODKJENT",
        coreSystemOnline: "KJERNESYSTEM TILKOBLET",
        connectionEncrypted: "TILKOBLING KRYPTERT",
        allSystemsOperational: "ALLE SYSTEMER OPERATIVE",
        connectionLost: "TILKOBLING MISTET",

        clear: "KLART",
        cloudy: "SKYET",
        fog: "TÅKE",
        drizzle: "YR",
        rain: "REGN",
        snow: "SNØ",
        showers: "REGNBYGER",
        thunderstorm: "TORDENVÆR",
        unknown: "UKJENT",
        connectionError: "TILKOBLINGSFEIL",

        footerText: "laget med flaks og håp"
    }
};


let currentLanguage = "en";



// SYSTEM MESSAGES


const messages = [
    "systemNominal",
    "networkStable",
    "secureConnection",
    "noThreats",
    "databaseOnline",
    "accessGranted",
    "coreSystemOnline",
    "connectionEncrypted",
    "allSystemsOperational"
];



// LANGUAGE


function changeLanguage(language) {
    currentLanguage = language;

    const elements =
        document.querySelectorAll("[data-text]");

    elements.forEach(function(element) {
        const key =
            element.getAttribute("data-text");

        if (translations[language][key] !== undefined) {
            element.textContent =
                translations[language][key];
        }
    });

    document.documentElement.lang = language;

    localStorage.setItem(
        "siteLanguage",
        language
    );

    updateNetworkStatus();
    renderWeather();
}



// TIME + DATE


function updateTime() {
    const now = new Date();

    document.getElementById("time").textContent =
        now.toLocaleTimeString("en-GB");

    document.getElementById("date").textContent =
        now.toLocaleDateString("en-GB");
}



// SESSION TIME


let seconds = 0;

function updateUptime() {
    seconds++;

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor((seconds % 3600) / 60);

    const secs =
        seconds % 60;

    const formattedTime =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(secs).padStart(2, "0");

    document.getElementById("uptime").textContent =
        formattedTime;
}



// VISITS


let visits =
    localStorage.getItem("visits");

if (visits === null) {
    visits = 0;
}

visits++;

localStorage.setItem(
    "visits",
    visits
);

document.getElementById("visits").textContent =
    String(visits).padStart(4, "0");



// ACCESS CODE


function generateAccessCode() {
    return Math.floor(
        Math.random() * 900000 + 100000
    );
}

document.getElementById("access-code").textContent =
    generateAccessCode();



// SYSTEM MESSAGE


function updateSystemMessage() {
    const systemMessage =
        document.getElementById("system-message");

    if (!navigator.onLine) {
        systemMessage.textContent =
            translations[currentLanguage].connectionLost;

        return;
    }

    const randomIndex =
        Math.floor(
            Math.random() * messages.length
        );

    const messageKey =
        messages[randomIndex];

    systemMessage.textContent =
        translations[currentLanguage][messageKey];
}



// CURSOR POSITION


document.addEventListener(
    "mousemove",
    function(event) {
        document.getElementById("cursor").textContent =
            event.clientX + " / " + event.clientY;
    }
);



// DISPLAY SIZE


function updateDisplay() {
    document.getElementById("display").textContent =
        window.innerWidth +
        "x" +
        window.innerHeight;
}



// NETWORK STATUS


function updateNetworkStatus() {
    const status =
        document.getElementById("network-status");

    if (navigator.onLine) {
        status.textContent =
            translations[currentLanguage].online;

        status.classList.remove("offline");
        status.classList.add("online");
    }

    else {
        status.textContent =
            translations[currentLanguage].offline;

        status.classList.remove("online");
        status.classList.add("offline");
    }

    updateSystemMessage();
}



// WEATHER


let currentTemperature = null;
let currentWeatherCode = null;


function getWeatherKey(weatherCode) {

    if (weatherCode === 0) {
        return "clear";
    }

    else if (
        weatherCode === 1 ||
        weatherCode === 2 ||
        weatherCode === 3
    ) {
        return "cloudy";
    }

    else if (
        weatherCode === 45 ||
        weatherCode === 48
    ) {
        return "fog";
    }

    else if (
        weatherCode === 51 ||
        weatherCode === 53 ||
        weatherCode === 55
    ) {
        return "drizzle";
    }

    else if (
        weatherCode === 61 ||
        weatherCode === 63 ||
        weatherCode === 65
    ) {
        return "rain";
    }

    else if (
        weatherCode === 71 ||
        weatherCode === 73 ||
        weatherCode === 75
    ) {
        return "snow";
    }

    else if (
        weatherCode === 80 ||
        weatherCode === 81 ||
        weatherCode === 82
    ) {
        return "showers";
    }

    else if (
        weatherCode === 95 ||
        weatherCode === 96 ||
        weatherCode === 99
    ) {
        return "thunderstorm";
    }

    return "unknown";
}


function renderWeather() {
    const weatherElement =
        document.getElementById("weather");

    if (
        currentTemperature === null ||
        currentWeatherCode === null
    ) {
        return;
    }

    const weatherKey =
        getWeatherKey(currentWeatherCode);

    const weatherText =
        translations[currentLanguage][weatherKey];

    weatherElement.textContent =
        currentTemperature +
        "°C / " +
        weatherText;
}


async function updateWeather() {
    const weatherElement =
        document.getElementById("weather");

    try {
        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=60.39" +
            "&longitude=5.32" +
            "&current=temperature_2m,weather_code" +
            "&timezone=Europe%2FOslo"
        );

        const data =
            await response.json();

        currentTemperature =
            data.current.temperature_2m;

        currentWeatherCode =
            data.current.weather_code;

        renderWeather();
    }

    catch (error) {
        weatherElement.textContent =
            translations[currentLanguage].connectionError;

        console.log(error);
    }
}

// LANGUAGE SELECT

const languageSelect =
    document.getElementById("language-select");

let savedLanguage =
    localStorage.getItem("siteLanguage");

if (
    savedLanguage === null ||
    translations[savedLanguage] === undefined
) {
    savedLanguage = "en";
}

languageSelect.value = savedLanguage;
// START
changeLanguage(savedLanguage);

updateTime();
updateDisplay();
updateNetworkStatus();
updateWeather();

setInterval(updateTime, 1000);
setInterval(updateUptime, 1000);
setInterval(updateSystemMessage, 5000);
setInterval(updateWeather, 600000);

window.addEventListener("resize", updateDisplay);
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);
languageSelect.addEventListener("change", function() {
        changeLanguage(this.value);});

// STATUS MENU TOGGLE

const statusToggle = document.getElementById("status-toggle");
const statusAside = document.querySelector("aside");
const statusArrow = document.getElementById("status-arrow");

function scrolling(top, left){
    return window.scrollTo({top: top, left:left, behavior: 'smooth'});
}

statusToggle.addEventListener("click", function() {
    scrolling(0, 0)
    statusAside.classList.toggle("expanded");
    const isExpanded = statusAside.classList.contains("expanded");

    statusToggle.setAttribute("aria-expanded", String(isExpanded));

});