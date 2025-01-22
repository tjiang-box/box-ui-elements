import { useEffect } from 'react';
import { useHistory } from './customRouter';

const CustomRedirect = ({ to }) => {
    const history = useHistory();

    useEffect(() => {
        history.push(to.pathname, to.state);
    }, [history, to]);

    return null;
};

export default CustomRedirect;
