import * as React from 'react';
import flow from 'lodash/flow';
import withRouter from '../../common/routing/withRouter';

class CustomNav extends React.Component<Props, State> {

    render() {
        const { history } = this.props;

        return (
            <div>
                <button onClick={() => history.push('/')}>Go to Activity Page</button>
                <button onClick={() => history.push('/details')}>Go to Details Page</button>
                <button onClick={() => history.push('/metadata')}>Go to Metadata Page</button>
            </div>
        );
    }
}

export default flow([withRouter])(CustomNav);