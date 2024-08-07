import * as React from 'react';
import { shallow } from 'enzyme';

import MenuSeparator from '../MenuSeparator';

describe('components/menu/MenuSeparator', () => {
    test('should correctly render a separator list element', () => {
        const wrapper = shallow(<MenuSeparator />);

        expect(wrapper.is('li')).toBe(true);
        expect(wrapper.prop('role')).toEqual('separator');
        expect(wrapper.prop('className')).toEqual('bdl-MenuSeparator');
    });

    test('should correctly render a separator list element when className is provided', () => {
        const wrapper = shallow(<MenuSeparator className="hello-world" />);

        expect(wrapper.is('li')).toBe(true);
        expect(wrapper.prop('role')).toEqual('separator');
        expect(wrapper.prop('className')).toEqual('bdl-MenuSeparator hello-world');
    });
});
