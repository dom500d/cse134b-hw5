class CurrentWeather extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let style = document.createElement('style');
        style.innerText = `
            :host { 
                display: inline-flex; 
                background-color: var(--rating-widget-background-color, #f2ffd1);
                border-radius: var(--rating-widget-border-radius, 10px);
                padding: var(--rating-widget-padding, 10px);
            }
            img {   
                height: var(--rating-widget-image-height, 7vh);
            }
            #container {
                display: flex;
                align-items: center;
                justify-content: space-evenly;
            }
            #container > div {
                margin-left: 1vw;
            }
            #outer-container {
                display: flex;
                flex-direction: column;
            }
            p {
                max-width: 30vw;
                font-family: var(--weather-widget-font, sans-serif);
            }
            `;
        this.shadowRoot.appendChild(style);
        let paragraph = document.createElement('p');
        paragraph.innerHTML = 'Weather Information Loading';
        this.shadowRoot.appendChild(paragraph);
        paragraph = null;
    }

    connectedCallback() {
        fetch('https://api.weather.gov/points/32.85490309481093,-117.24582925483772').then((response) => {
            // console.log(response);
            if(response.status === 200) {
                return response.json();
            } else {
                throw new Error(`Something went wrong on first API call: HTTP status: ${response.status}`);
            }
        }).then((response) => {
            fetch(response.properties.forecast).then((response) => {
                if(response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Something went wrong on second API call: HTTP status: ${response.status}`);
                }
            }).then((response) => {
                if(response.type === 'Feature') {
                    // console.log(response);
                    this.shadowRoot.removeChild(this.shadowRoot.querySelector('p'));
                    let short_description = document.createElement('p');
                    let image = document.createElement('img');
                    let div = document.createElement('div');
                    let another_div = document.createElement('div');
                    let another_another_div = document.createElement('div');
                    let long_description = document.createElement('p');
                    let short_forecast = response.properties.periods[0].shortForecast;
                    image.src = 'assets/sunny.png';
                    image.alt = 'Sunny weather icon';
                    console.log(short_forecast);
                    console.log(short_forecast.toLowerCase().includes('partly cloudy'));
                    if(response.properties.periods[0].isDaytime) {
                        if(short_forecast.toLowerCase().includes('sunny') || short_forecast.toLowerCase().includes('mostly clear')) {
                            image.src = 'assets/sunny.png';
                            image.alt = 'Sunny weather icon';
                        } else if(short_forecast.toLowerCase().includes('rain')) {
                            image.src = 'assets/rain.png';
                            image.alt = 'Rainy weather icon';
                        } else if(short_forecast.toLowerCase().includes('partly cloudy') || short_forecast.toLowerCase().includes('mostly sunny')) {
                            image.src = 'assets/partly_cloudy.png';
                            image.alt = 'Partly Cloudy weather icon';
                        } else if(short_forecast.toLowerCase().includes('cloudy')) {
                            image.src = 'assets/cloud.png';
                            image.alt = 'Cloudy weather icon';
                        } else if(short_forecast.toLowerCase().includes('thunder')) {
                            image.src = 'assets/thunder.png';
                            image.alt = 'Thunder weather icon';
                        } else if(short_forecast.toLowerCase().includes('snow')) {
                            image.src = 'assets/blizzard.png';
                            image.alt = 'Snowstorm weather icon';
                        }
                    } else {
                        if(short_forecast.toLowerCase().includes('sunny') || short_forecast.toLowerCase().includes('mostly clear')) {
                            image.src = 'assets/clear_night.png';
                            image.alt = 'Sunny weather icon';
                        } else if(short_forecast.toLowerCase().includes('rain')) {
                            image.src = 'assets/rain.png';
                            image.alt = 'Rainy weather icon';
                        } else if(short_forecast.toLowerCase().includes('partly cloudy') || short_forecast.toLowerCase().includes('mostly sunny')) {
                            image.src = 'assets/cloudy_night.png';
                            image.alt = 'Partly Cloudy weather icon';
                        } else if(short_forecast.toLowerCase().includes('cloudy')) {
                            image.src = 'assets/cloud.png';
                            image.alt = 'Cloudy weather icon';
                        }  else if(short_forecast.toLowerCase().includes('thunder')) {
                            image.src = 'assets/thunder.png';
                            image.alt = 'Thunder weather icon';
                        } else if(short_forecast.toLowerCase().includes('snow')) {
                            image.src = 'assets/blizzard.png';
                            image.alt = 'Snowstorm weather icon';
                        }
                    }
                    div.id = 'outer-container';
                    short_description.innerHTML = response.properties.periods[0].temperature + '&#176;' + response.properties.periods[0].temperatureUnit + ', ' + short_forecast;
                    let wind_description = document.createElement('p');
                    wind_description.innerHTML = response.properties.periods[0].windSpeed + ' ' + response.properties.periods[0].windDirection; 
                    long_description.innerHTML = response.properties.periods[0].detailedForecast;
                    div.appendChild(image);
                    div.appendChild(another_div);
                    another_another_div.appendChild(image);
                    another_another_div.appendChild(another_div);
                    another_div.appendChild(short_description);
                    another_div.appendChild(wind_description);
                    div.appendChild(another_another_div);
                    div.appendChild(long_description);
                    another_another_div.id = 'container';
                    this.shadowRoot.appendChild(div);
                    div = null;
                    another_div = null;
                    another_another_div = null;
                    long_description = null;
                    short_description = null;
                    wind_description = null;
                } else {
                    throw new Error(`Second API call response doesn't seem to be valid!`);
                }
            }).catch((e) => {
                this.fetch_error(e);
            });
        }).catch((e) => {
            this.fetch_error(e);
        });
    }

    fetch_error(e) {
        let paragraph = document.createElement('p');
        paragraph.innerHTML = e;
        this.shadowRoot.appendChild(paragraph);
        paragraph = null;
    }
}

window.customElements.define('current-weather', CurrentWeather);