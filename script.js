function updateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = now.toLocaleDateString('de-DE', options);
    const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('date').textContent = date;
    document.getElementById('time').textContent = time;
}

setInterval(updateTime, 1000); // Aktualisiert die Zeit jede Sekunde
updateTime(); // Initiales Setzen der Zeit und des Datums

function getRandomTemperature() {
    return Math.floor(Math.random() * (36 - 10)) + 10; // Zufällige Temperatur zwischen 10 und 35
}

function getRandomHumidity() {
    return Math.floor(Math.random() * (91 - 30)) + 30; // Zufällige Luftfeuchtigkeit zwischen 30% und 90%
}

function getColor(temp) {
    if (temp < 18) {
        return 'blue';
    } else if (temp >= 18 && temp <= 24) {
        return 'green';
    } else if (temp > 24 && temp <= 30) {
        return 'orange';
    } else {
        return 'red';
    }
}

function getHumidityColor(humidity) {
    if (humidity < 45) {
        return 'red';
    } else if (humidity >= 45 && humidity <= 70) {
        return 'green';
    } else if (humidity > 70 && humidity <= 100) {
        return 'orange';
    } else {
        return 'red';
    }
}

function getHourLabels() {
    const labels = [];
    for (let i = 0; i < 25; i++) {
        labels.push(i < 10 ? `0${i}:00` : `${i}:00`);
    }
    return labels;
}

const ctxTemp = document.getElementById('temp-chart').getContext('2d');
const tempChart = new Chart(ctxTemp, {
    type: 'line',
    data: {
        labels: getHourLabels(),
        datasets: [{
            label: 'Temperatur (°C)',
            data: Array(25).fill(0),
            borderColor: 'grey',
            borderWidth: 2,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: Array(25).fill('white'),
            pointBorderColor: 'transparent',
        }]
    },
    options: {
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const temperature = context.dataset.data[context.dataIndex];
                        return `Temperatur: ${temperature} °C`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false, // Deaktiviert die Gitterlinien der X-Achse
                },
                ticks: {
                    color: 'white' // Label-Farbe auf Weiß
                }
            },
            y: {
                beginAtZero: true,
                max: 40,
                grid: {
                    display: false, // Deaktiviert die Gitterlinien der X-Achse
                },
                ticks: {
                    color: 'white' // Label-Farbe auf Weiß
                }
            }
        }
    }
});

const ctxHumidity = document.getElementById('humidity-chart').getContext('2d');
const humidityChart = new Chart(ctxHumidity, {
    type: 'line',
    data: {
        labels: getHourLabels(),
        datasets: [{
            label: 'Luftfeuchtigkeit (%)',
            data: Array(25).fill(0),
            borderColor: 'grey',
            borderWidth: 2,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: Array(25).fill('white'),
            pointBorderColor: 'transparent',
        }]
    },
    options: {
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const humidity = context.dataset.data[context.dataIndex];
                        return `Luftfeuchtigkeit: ${humidity} %`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false, // Deaktiviert die Gitterlinien der X-Achse
                },
                ticks: {
                    color: 'white' // Label-Farbe auf Weiß
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    display: false, // Deaktiviert die Gitterlinien der X-Achse
                },
                ticks: {
                    color: 'white' // Label-Farbe auf Weiß
                }
                
            }
        }
    }
});

let currentHour = 0;

function updateLiveReadings() {
    const liveTemp = getRandomTemperature();
    const liveHumidity = getRandomHumidity();
    document.getElementById('live-temp').textContent = `${liveTemp} °C`;
    document.getElementById('live-humidity').textContent = `${liveHumidity} %`;
}

function updateChartReadings() {
    const liveTemp = getRandomTemperature();
    const liveHumidity = getRandomHumidity();

    // Temperatur-Diagrammdaten aktualisieren
    tempChart.data.datasets[0].data[currentHour] = liveTemp;
    tempChart.data.datasets[0].pointBackgroundColor[currentHour] = getColor(liveTemp);

    // Luftfeuchtigkeits-Diagrammdaten aktualisieren
    humidityChart.data.datasets[0].data[currentHour] = liveHumidity;
    humidityChart.data.datasets[0].pointBackgroundColor[currentHour] = getHumidityColor(liveHumidity);

    currentHour = (currentHour + 1) % 25;

    // Diagramme aktualisieren
    tempChart.update();
    humidityChart.update();
}

// Charts nach jedem simulierten "Tag" zurücksetzen
function resetChartsAtEndOfDay() {
    tempChart.data.datasets[0].data.fill(0);
    tempChart.data.datasets[0].pointBackgroundColor.fill('white');

    humidityChart.data.datasets[0].data.fill(0);
    humidityChart.data.datasets[0].pointBackgroundColor.fill('white');

    tempChart.update();
    humidityChart.update();

    currentHour = 0;
}

// Live-Messwerte alle 3 Sekunden aktualisieren
setInterval(updateLiveReadings, 3000);
updateLiveReadings(); // Initialer Aufruf zur sofortigen Anzeige der Werte

// Chart-Daten alle 6 Sekunden aktualisieren
setInterval(updateChartReadings, 6000);
updateChartReadings(); // Initialer Aufruf zur sofortigen Anzeige der Chart-Daten

// Charts alle 24 "Stunden" (also alle 144 Sekunden) zurücksetzen
setInterval(resetChartsAtEndOfDay, 144000); // 144 Sekunden = 24 * 6 Sekunden

// Funktion zum Starten des Webcam-Streams
async function startWebcam() {
    const webcam = document.getElementById('webcam');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { exact: 1280 }, // Breite der Webcam
                height: { exact: 720 }, // Höhe der Webcam
                frameRate: { ideal: 30 }, // Bildrate der Webcam
                facingMode: 'user' // Frontkamera
            }
        });
        webcam.srcObject = stream; // Stream der Webcam anzeigen
        webcam.style.display = 'block'; // Video anzeigen
    } catch (error) {
        console.error('Fehler beim Zugreifen auf die Webcam:', error);
    }
}

// Starte die Webcam, wenn die Seite geladen ist
window.onload = startWebcam;

const apiKey = '75fc58c80db9f5d77475c20fa42bd129';
const city = 'Berlin';
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

async function fetchWeatherData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const weatherMain = data.weather[0].main.toLowerCase(); // Der Hauptwetterstatus (z.B. clear, clouds, rain)

        // Setze die Wetterdaten
        document.getElementById('temperature').textContent = `${temperature} °C`;
        document.getElementById('humidity').textContent = `${humidity} %`;

        // Wähle das passende Icon oder den Text für das <h2> basierend auf dem Wetterstatus
        const weatherTitleElement = document.querySelector('.weather-display h2');
        switch (weatherMain) {
            case 'clear':
                weatherTitleElement.innerHTML = '<i class="fas fa-sun"></i>'; // Sonne-Icon
                break;
            case 'clouds':
                weatherTitleElement.innerHTML = '<i class="fas fa-cloud"></i>'; // Wolken-Icon
                break;
            case 'rain':
                weatherTitleElement.innerHTML = '<i class="fas fa-cloud-showers-heavy"></i>'; // Regen-Icon
                break;
            case 'snow':
                weatherTitleElement.innerHTML = '<i class="fas fa-snowflake"></i>'; // Schnee-Icon
                break;
            case 'thunderstorm':
                weatherTitleElement.innerHTML = '<i class="fas fa-bolt"></i>'; // Gewitter-Icon
                break;
            case 'drizzle':
                weatherTitleElement.innerHTML = '<i class="fas fa-cloud-rain"></i>'; // Nieselregen-Icon
                break;
            case 'mist':
            case 'fog':
                weatherTitleElement.innerHTML = '<i class="fas fa-smog"></i>'; // Nebel-Icon
                break;
            default:
                weatherTitleElement.innerHTML = '<i class="fas fa-question-circle"></i>'; // Default-Icon für unbekanntes Wetter
                break;
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Wetterdaten:', error);
    }
}

// Funktion beim Laden der Seite aufrufen
fetchWeatherData();

// Setze einen Timer, der die Funktion jede Minute aufruft
setInterval(fetchWeatherData, 60 * 1000); // 60 Sekunden in Millisekunden

