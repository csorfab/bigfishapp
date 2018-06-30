import React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router';
import 'react-geosuggest/module/geosuggest.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { locationChanged } from './redux/actions';
import { WeatherNav } from './components/Nav';
import { WeatherView } from './components/WeatherView';


const App = ({ locationChanged, currentWeather, forecastWeather }) => (
    <Router>
        <div>
            <WeatherNav locationChanged={locationChanged} />
            <Switch>
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
            </Switch>
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
