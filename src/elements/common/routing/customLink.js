import React from 'react';
import { useHistory } from './customRouter';

const CustomLink = ({ to, children }) => {
    const history = useHistory();

    const handleClick = e => {
        e.preventDefault();
        history.push(to);
    };

    return (
        <a href={to} onClick={handleClick}>
            {children}
        </a>
    );
};

export default CustomLink;
