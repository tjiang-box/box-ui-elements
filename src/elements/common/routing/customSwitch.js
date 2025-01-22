import React from 'react';
import { useLocation } from './customRouter';

const CustomSwitch = ({ children }) => {
    const location = useLocation();
    const { pathname } = location;

    let match = null;
    let matchedChild = null;

    React.Children.forEach(children, child => {
        if (!match && React.isValidElement(child)) {
            const { path, exact } = child.props;

            if (path) {
                const paths = Array.isArray(path) ? path : [path];
                // Match the route
                const isMatch = paths.some(p => {
                    return exact ? pathname === p : pathname.startsWith(p)
                });
                if (isMatch) {
                    match = true;
                    matchedChild = child;
                }
            }
        }
    });

    if (match) {
        return matchedChild;
    }
    return null;
};

export default CustomSwitch;
