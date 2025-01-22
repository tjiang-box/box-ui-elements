import * as React from 'react';
import { MemoryRouter, Router } from 'react-router';
import { History } from 'history';
import { CustomRouter } from '../routing/customRouter';

type Props = {
    children: React.ReactNode;
    history?: History;
    initialEntries?: History.LocationDescriptor[];
};

const NavRouter = ({ children, history, ...rest }: Props) => {
    if (history) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return <CustomRouter history={history}>{children}</CustomRouter>;
    }

    return <CustomRouter {...rest}>{children}</CustomRouter>;
};

export default NavRouter;
