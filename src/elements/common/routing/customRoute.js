/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import React from 'react';
import { useHistory, useLocation } from './customRouter';

const CustomRoute = ({ exact, path, render, component: Component, children }) => {
    console.log('[Custom Route]');

    const history = useHistory();
    const location = useLocation();
    const { pathname } = location;

    console.log('history in CustomRoute is: ', history);
    console.log('location in CustomRoute is: ', location);

    // Matching logic
    const isMatch = exact ? pathname === path : pathname.startsWith(path);

    if (!isMatch) {
        return null; // Don't render anything if the route doesn't match
    }

    // Render the appropriate content
    if (render) {
        return render({ history, location });
    }

    if (Component) {
        return <Component history={history} location={location} />;
    }

    return children;
};

export default CustomRoute;
