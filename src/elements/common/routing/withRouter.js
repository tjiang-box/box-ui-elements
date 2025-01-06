import React from 'react';
import { useHistory } from './customRouter';

// Higher-Order Component (HOC)
export default function withRouter(WrappedComponent) {
    return props => {
        const history = useHistory();

        return <WrappedComponent {...props} history={history} />;
    };
}
