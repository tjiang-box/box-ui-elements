import * as React from 'react';
import { render, screen, fireEvent } from '../../../test-utils/testing-library';

import UploadsManagerAction, { UploadsManagerActionProps } from '../UploadsManagerAction';

describe('elements/content-uploader/UploadsManagerAction', () => {
    const renderComponent = (props: Partial<UploadsManagerActionProps>) =>
        render(<UploadsManagerAction hasMultipleFailedUploads={false} onClick={jest.fn()} {...props} />);

    test('should render correctly with hasMultipleFailedUploads as true', () => {
        renderComponent({ hasMultipleFailedUploads: true });

        expect(screen.getByText('Resume All')).toBeInTheDocument();
    });

    test('should render correctly with hasMultipleFailedUploads as false', () => {
        renderComponent({ hasMultipleFailedUploads: false });

        expect(screen.getByText('Resume')).toBeInTheDocument();
        expect(screen.queryByText('Resume All')).not.toBeInTheDocument();
    });

    test('should call onClick when resume button is clicked', () => {
        const handleResumeClick = jest.fn();
        renderComponent({ onClick: handleResumeClick });

        fireEvent.click(screen.getByText('Resume'));
        expect(handleResumeClick).toHaveBeenCalledTimes(1);
    });
});
