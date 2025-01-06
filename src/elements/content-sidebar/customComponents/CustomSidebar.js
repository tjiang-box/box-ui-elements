import * as React from 'react';

import CustomRoute from '../../common/routing/customRoute';
import CustomSwitch from '../../common/routing/customSwitch';

class CustomSidebar extends React.Component<Props, State> {
    render() {
        return (
            <CustomSwitch initialEntries={['/']}>
                <CustomRoute exact path="/">
                    <h1>Activity Page</h1>
                </CustomRoute>
                <CustomRoute path="/details">
                    <h1>Details Page</h1>
                </CustomRoute>
                <CustomRoute
                        exact
                        path="/metadata"
                        render={() => {
                            return (
                                <div>
                                    <h1>Metadata Page</h1>
                                </div>
                            );
                        }}
                    />
            </CustomSwitch>
        );
    }
}

export default CustomSidebar;
