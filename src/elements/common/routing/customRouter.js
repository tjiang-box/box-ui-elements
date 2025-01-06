/**
 * @flow
 * @file Custom Router component that provides a custom history object
 * @author Box
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createMemoryHistory, History } from 'history';

type Props = {
    children: React.ReactNode,
    history?: History,
    initialEntries?: History.LocationDescriptor[],
};

export const HistoryContext = createContext();
export const LocationContext = createContext();

export const CustomRouter = ({ children, ...rest }: Props) => {
    const { initialEntries = ['/'], initialIndex = 0 } = rest;
    const history = React.useMemo(
        () => createMemoryHistory({ initialEntries, initialIndex }),
        [initialEntries, initialIndex],
    );
    const [currentLocation, setCurrentLocation] = useState(history.location);

    useEffect(() => {
        // Listen for changes in history
        const unlisten = history.listen(location => {
            console.log('new location is: ', location);
            if (!location) {
                console.error('Location is undefined!');
            }
            setCurrentLocation(location);
        });

        return () => {
            unlisten();
        };
    }, [history, currentLocation]);

    return (
        <HistoryContext.Provider value={history}>
            <LocationContext.Provider value={currentLocation}>{children}</LocationContext.Provider>
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
