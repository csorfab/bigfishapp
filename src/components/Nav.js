import React from 'react';
import { Link } from 'react-router-dom';
import Geosuggest from 'react-geosuggest';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Navbar, NavItem, Nav } from 'react-bootstrap';


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

export const WeatherNav = ({ locationChanged }) => (
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
