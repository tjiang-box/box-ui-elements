/**
 * @flow
 * @file Custom Router component that provides a custom history object
 * @author Box
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserHistory, createMemoryHistory } from 'history';

type Props = {
    children: React.ReactNode,
    initialEntries?: History.LocationDescriptor[],
};

export const HistoryContext = createContext();
export const LocationContext = createContext();
export const MatchContext = createContext();

export const CustomRouter = ({ history: historyProp, children, ...rest }: Props) => {
    const { initialEntries, initialIndex = 0 } = rest;
    
    const history = React.useMemo(() => {
        return historyProp || (initialEntries ? createMemoryHistory({ initialEntries, initialIndex }) : createBrowserHistory());
    }, [historyProp, initialEntries, initialIndex]);

    const [currentLocation, setCurrentLocation] = useState(history.location);

    useEffect(() => {
        // Listen for changes in history
        const unlisten = history.listen(location => {
            setCurrentLocation(location);
        });

        return () => {
            unlisten();
        };
    }, [history]);

    const match = React.useMemo(() => {
        const path = currentLocation.pathname;
        return {
            path,
            url: path,
            isExact: path === currentLocation.pathname,
            params: {},
        };
    }, [currentLocation]);
    
    return (
        <HistoryContext.Provider value={history}>
            <LocationContext.Provider value={currentLocation}>
                <MatchContext.Provider value={match}>
                    {children}
                </MatchContext.Provider>
            </LocationContext.Provider>
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistory must be used within a CustomRouter');
    }
    return context;
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a CustomRouter');
    }
    return context;
};

export const useMatch = () => {
    const context = useContext(MatchContext);
    if (!context) {
        throw new Error('useMatch must be used within a CustomRouter');
    }
    return context;
}
