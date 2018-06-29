import React from 'react';
import { connect } from 'react-redux';
import { locationChanged } from './redux/actions';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Navbar, NavItem, Nav, Row, Grid, Col } from 'react-bootstrap';
import moment from 'moment';
import './App.css';
import 'react-geosuggest/module/geosuggest.css';


import Geosuggest from 'react-geosuggest';

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

const KelvinToCelsius = kelvin => Math.round(kelvin - 273.15);

function WeatherView({ weather, type, day }) {
    if (!weather.hasData) {
        return (
            <h3 style={{ textAlign: 'center' }}>
                Please select a location or wait for your browser to supply your location
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

const LocationSearch = ({ locationChanged }) => (
    <form className="navbar-form navbar-right" role="search">
        <div className="form-group">
            <Geosuggest id="location"
                placeholder="Search for locations"
                inputClassName="form-control"
                onSuggestSelect={(v) => v && v.location && locationChanged(v.location)}
                queryDelay={500}
            />
        </div>
    </form>
);

const WeatherNav = ({ locationChanged }) => (
    <Navbar>
        <Navbar.Header>
            <Navbar.Brand>
                <Link to="/">Big Fish Weather demo</Link>
            </Navbar.Brand>
        </Navbar.Header>
        <Nav>
            <IndexLinkContainer to="/">
                <NavItem eventkey={1}>
                    Current Weather
                        </NavItem>
            </IndexLinkContainer>
            <LinkContainer to="/forecast">
                <NavItem>
                    Forecast
                        </NavItem>
            </LinkContainer>
        </Nav>
        <LocationSearch locationChanged={locationChanged} />
    </Navbar>
)

const App = ({ locationChanged, currentWeather, forecastWeather }) => (
    <Router>
        <div>
            <WeatherNav locationChanged={locationChanged} />
            <Route
                exact path="/"
                component={() => <WeatherView weather={currentWeather} type="current" />}
            />
            <Route
                exact path="/forecast"
                component={() => <WeatherView weather={forecastWeather} type="forecast" day={0} />}
            />
            <Route
                path="/forecast/:n"
                component={({ match }) => <WeatherView weather={forecastWeather} type="forecast" day={match.params.n} />}
            />
        </div>
    </Router>
);

function mapStateToProps(state) {
    const { location, currentWeather, forecastWeather } = state;
    return { location, currentWeather, forecastWeather };
}

function mapDispatchToProps(dispatch) {
    return {
        locationChanged: (newLocation) => {
            dispatch(locationChanged(newLocation));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
