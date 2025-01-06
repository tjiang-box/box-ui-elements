import React from 'react';
import { useLocation } from './customRouter';

const CustomSwitch = ({ children }) => {
    console.log('[CustomSwitch]');
    const location = useLocation();
    const { pathname } = location;
    console.log('current pathname is: ', pathname);

    let match = null;
    let matchedChild = null;

    console.log('children is: ', children);

    React.Children.forEach(children, child => {
        if (!match && React.isValidElement(child)) {
            const { path, exact, to } = child.props;

            if (to) {
                // Handle CustomRedirect
                matchedChild = React.cloneElement(child);
                match = true;
            } else if (path) {
                // Match the route
                const isExactMatch = exact ? pathname === path : pathname.startsWith(path);
                if (isExactMatch) {
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
