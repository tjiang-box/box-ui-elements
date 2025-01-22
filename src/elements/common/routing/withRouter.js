import * as React from 'react';
import { useHistory, useLocation, useMatch } from './customRouter';

export default function withRouter(WrappedComponent) {
    return props => {
        const history = useHistory();
        const location = useLocation();
        const match = useMatch();

        return <WrappedComponent {...props} location={location} history={history} match={match} />;
    };
}
