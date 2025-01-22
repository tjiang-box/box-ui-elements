/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import React from 'react';
import { useHistory, useLocation, useMatch } from './customRouter';

const CustomRoute = (props) => {
    const { exact, path, render, component: Component, children } = props;

    const history = useHistory();
    const location = useLocation();
    const match = useMatch();
    const { pathname } = location;

    // Matching logic
    // path can be a string or an array of strings
    const paths = Array.isArray(path) ? path : [path];
    const isMatch = paths.some(p => {
        return exact ? pathname === p : pathname.startsWith(p)
    });

    if (!isMatch && !children) {
        return null;
    }

    // Render the appropriate content
    if (render) {
        return render({ history, location, match });
    }

    if (Component) {
        return <Component history={history} location={location} match={match} />;
    }

    return children({ history, location, match });
};

export default CustomRoute;
