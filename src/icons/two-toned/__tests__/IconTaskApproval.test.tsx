import * as React from 'react';
import { shallow } from 'enzyme';
import IconTaskApproval from '../IconTaskApproval';

describe('icons/general/IconTaskApproval', () => {
    const getWrapper = (props = {}) => shallow(<IconTaskApproval {...props} />);

    test('should correctly render default icon', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height', () => {
        const width = 16;
        const height = 17;
        const wrapper = shallow(<IconTaskApproval height={height} width={width} />);

        expect(wrapper.find('AccessibleSVG').prop('width')).toEqual(width);
        expect(wrapper.find('AccessibleSVG').prop('height')).toEqual(height);
    });

    test('should correctly render icon with title', () => {
        const title = 'task-icon';
        const wrapper = shallow(<IconTaskApproval title={title} />);

        expect(wrapper.find('AccessibleSVG').prop('title')).toEqual(title);
    });
});
