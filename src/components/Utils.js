import React from 'react';
import loader from '../img/ajax-loader-white.gif';

export const KelvinToCelsius = kelvin => Math.round(kelvin - 273.15);

export function FetchingIcon({ isFetching, style, children }) {
    return (
        <span style={style}>
            <img src={loader} style={{ marginRight: '10px', visibility: isFetching ? 'visible' : 'hidden' }} alt="Loading..." />
            {children}
        </span>
    )
}

