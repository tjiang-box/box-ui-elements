import * as React from 'react';
import noop from 'lodash/noop';
import PaginationControls from './PaginationControls';
import { DEFAULT_PAGE_SIZE } from '../../../constants';

export interface OffsetBasedPaginationProps {
    isSmall: boolean;
    offset?: number;
    onOffsetChange?: (offset: number) => void;
    pageSize?: number;
    totalCount?: number;
}

const OffsetBasedPagination = ({
    isSmall,
    offset = 0,
    onOffsetChange = noop,
    pageSize = DEFAULT_PAGE_SIZE,
    totalCount = 0,
}: OffsetBasedPaginationProps) => {
    const pageCount = Math.ceil(totalCount / pageSize);
    if (pageCount <= 1) return null;

    const pageByOffset = Math.floor(offset / pageSize) + 1;
    const pageNumber = pageByOffset > 0 ? Math.min(pageCount, pageByOffset) : 1;
    const hasNextPage = pageNumber < pageCount;
    const hasPreviousPage = pageNumber > 1;

    const updateOffset = (newPageNumber: number) => {
        let newOffset = (newPageNumber - 1) * pageSize;

        if (newOffset <= 0) {
            newOffset = 0;
        }

        if (newOffset >= totalCount) {
            newOffset = totalCount - pageSize;
        }

        onOffsetChange(newOffset);
    };

    const handleNextClick = () => {
        updateOffset(pageNumber + 1);
    };

    const handlePreviousClick = () => {
        updateOffset(pageNumber - 1);
    };

    return (
        <PaginationControls
            handleNextClick={handleNextClick}
            handlePreviousClick={handlePreviousClick}
            hasNextPage={hasNextPage}
            hasPageEntryStatus={true}
            hasPreviousPage={hasPreviousPage}
            isSmall={isSmall}
            offset={offset}
            pageSize={pageSize}
            totalCount={totalCount}
        />
    );
};

export default OffsetBasedPagination;
