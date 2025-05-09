/**
 * @flow
 * @file File picker header and list component
 * @author Box
 */

import * as React from 'react';
// $FlowFixMe TypeScript file
import EmptyView from '../common/empty-view';
import ProgressBar from '../common/progress-bar';
import ItemList from './ItemList';
import { VIEW_ERROR, VIEW_SELECTED } from '../../constants';
import type { View, Collection } from '../../common/types/core';
// $FlowFixMe TypeScript file
import type { ItemAction } from '../common/item';

import './Content.scss';

type Props = {
    canSetShareAccess: boolean,
    currentCollection: Collection,
    extensionsWhitelist: string[],
    focusedRow: number,
    hasHitSelectionLimit: boolean,
    isSingleSelect: boolean,
    isSmall: boolean,
    itemActions?: ItemAction[],
    onFocusChange: Function,
    onItemClick: Function,
    onItemSelect: Function,
    onShareAccessChange: Function,
    rootElement?: HTMLElement,
    rootId: string,
    selectableType: string,
    tableRef: Function,
    view: View,
};

/**
 * Determines if we should show the empty state
 *
 * @param {string} view the current view
 * @param {Object} currentCollection the current collection
 * @return {boolean} empty or not
 */
function isEmpty(view: View, currentCollection: Collection): boolean {
    const { items = [] } = currentCollection;
    return view === VIEW_ERROR || items.length === 0;
}

const Content = ({
    view,
    rootId,
    isSmall,
    rootElement,
    focusedRow,
    hasHitSelectionLimit,
    selectableType,
    currentCollection,
    tableRef,
    canSetShareAccess,
    isSingleSelect,
    onItemClick,
    onItemSelect,
    onShareAccessChange,
    onFocusChange,
    extensionsWhitelist,
    itemActions,
}: Props) => (
    <div className="bcp-content">
        {view === VIEW_ERROR || view === VIEW_SELECTED ? null : (
            <ProgressBar percent={currentCollection.percentLoaded} />
        )}
        {isEmpty(view, currentCollection) ? (
            <EmptyView view={view} isLoading={currentCollection.percentLoaded !== 100} />
        ) : (
            <ItemList
                view={view}
                rootId={rootId}
                isSmall={isSmall}
                rootElement={rootElement}
                focusedRow={focusedRow}
                currentCollection={currentCollection}
                tableRef={tableRef}
                canSetShareAccess={canSetShareAccess}
                hasHitSelectionLimit={hasHitSelectionLimit}
                isSingleSelect={isSingleSelect}
                selectableType={selectableType}
                onItemSelect={onItemSelect}
                onItemClick={onItemClick}
                onFocusChange={onFocusChange}
                onShareAccessChange={onShareAccessChange}
                extensionsWhitelist={extensionsWhitelist}
                itemActions={itemActions}
            />
        )}
    </div>
);

export default Content;
