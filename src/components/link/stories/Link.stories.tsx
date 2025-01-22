import * as React from 'react';
import { CustomRouter } from '../../../elements/common/routing/customRouter';
import CustomLink from '../../../elements/common/routing/customLink';

import Link from '../Link';
import notes from './Link.stories.md';

export const basic = () => <Link href="https://www.box.com/platform">A link</Link>;

export const withCustomComponent = () => {
    // You can pass a custom component to be used instead of the default "a" tag, like a React Router link:
    // import { BrowserRouter as Router, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

    const CustomRouterLink = ({ href, children, ...rest }) => (
        // @ts-ignore TODO: figure out why this is giving a TS error
        <CustomLink to={href} {...rest}>
            {children}
        </CustomLink>
    );

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <CustomRouter>
            <Link component={CustomRouterLink} href="/">
                A link
            </Link>
        </CustomRouter>
    );
};

export default {
    title: 'Components/Links/Link',
    component: Link,
    parameters: {
        notes,
    },
};
