import React from 'react';
import { Row, Grid, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FetchingIcon, KelvinToCelsius } from './Utils';

const ForecastSelector = ({ weather, selectedId }) => (
    <Row>
        <Col md={12}>
            <div className="forecastSelector">
                <table>
                    <tbody>
                        <tr>
                            {weather.data.list.map((weatherItem, id) => (
                                <td key={id} className={id === selectedId ? "selected" : ""}>
                                    <Link to={`/forecast/${id}`}>
                                        {moment(weatherItem.dt * 1000).format('MMM Do')}
                                    </Link>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </Col>
    </Row>
);

export function WeatherView({ weather, type, day }) {
    if (!weather.hasData) {
        return (
            <h3 style={{ textAlign: 'center' }}>
                <FetchingIcon isFetching={weather.fetching} /> Please select a location or wait for your browser to supply your location
            </h3>
        )
    }

    const selectedDay = Number(day || 0);
    let displayedWeather;

    if (type === 'forecast') {
        displayedWeather = weather.data.list[selectedDay] || weather.data.list[0];
    } else {
        displayedWeather = weather.data;
    }

    const iconURL = `https://openweathermap.org/img/w/${displayedWeather.weather[0].icon}.png`;
    const mainWeatherText = `${KelvinToCelsius(displayedWeather.main.temp)} C°, ${displayedWeather.weather[0].description}`;
    const dateTimeText = moment(displayedWeather.dt * 1000).format('MMMM Do YYYY, HH:mm:ss');
    const minmaxText = `Max: ${KelvinToCelsius(displayedWeather.main.temp_max)} C°, Min: ${KelvinToCelsius(displayedWeather.main.temp_min)} C°`;

    return (
        <Grid className="mainView">
            <Row>
                <Col md={12}>
                    <h1>
                        Weather near {weather.data.name || weather.data.city.name}
                    </h1>
                    <FetchingIcon isFetching={weather.fetching} />
                </Col>
            </Row>
            {type === 'forecast'
                ? <ForecastSelector weather={weather} selectedId={selectedDay} />
                : (null)
            }
            <Row>
                <Col md={12}>
                    <h3>
                        <img src={iconURL} alt="" />
                        {mainWeatherText}
                    </h3>
                    <h4>
                        {minmaxText}
                    </h4>
                    <h5>
                        {dateTimeText}
                    </h5>
                </Col>
            </Row>
        </Grid>
    );
}

