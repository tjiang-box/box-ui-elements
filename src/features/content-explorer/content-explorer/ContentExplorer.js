import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import ContentExplorerHeaderActions from './ContentExplorerHeaderActions';
import ContentExplorerEmptyState from './ContentExplorerEmptyState';
import ContentExplorerActionButtons from './ContentExplorerActionButtons';
import ContentExplorerSelectAll from './ContentExplorerSelectAll';
import ContentExplorerIncludeSubfolders from './ContentExplorerIncludeSubfolders';
import ContentExplorerInfoNotice from './ContentExplorerInfoNotice';

import ItemList from '../item-list';
import { ContentExplorerModePropType, FoldersPathPropType, ItemsPropType } from '../prop-types';
import ContentExplorerModes from '../modes';

import { TYPE_FOLDER } from '../../../constants';

import './ContentExplorer.scss';

class ContentExplorer extends Component {
    static propTypes = {
        /** Props for the action buttons container */
        actionButtonsProps: PropTypes.object,
        /**
         * Extra columns displayed in the folders table after folder name column
         * Each column has to be a Column element
         */
        additionalColumns: PropTypes.arrayOf(PropTypes.element),
        /** Items that will show up as selected */
        controlledSelectedItems: PropTypes.object,
        /**  Allow users to choose no selections in MULTI_SELECT mode, defaults to false  */
        isNoSelectionAllowed: PropTypes.bool,
        /** Custom icon for the breadcrumb. Overrides the default icon */
        breadcrumbIcon: PropTypes.element,
        /** Props for breadcrumbs */
        breadcrumbProps: PropTypes.object,
        /** Props for the cancel button */
        cancelButtonProps: PropTypes.object,
        /** Props for the choose button */
        chooseButtonProps: PropTypes.object,
        /** Custom text for the choose button */
        chooseButtonText: PropTypes.node,
        /** Adds class name. */
        className: PropTypes.string,
        /** Configures the content explorer based on the user's intended action (ex. select file or move/copy) */
        contentExplorerMode: ContentExplorerModePropType.isRequired,
        /** Props that contains the custom search input. Is rendered in header actions */
        customInput: PropTypes.func,
        /** Whether the user can see the breadcrumbs represented with the folder tree button */
        hasFolderTreeBreadcrumbs: PropTypes.bool,
        /** Any extra items in the header to the right of the search input (and new folder button) */
        headerActionsAccessory: PropTypes.node,
        /** Props for the include subfolders toggle */
        includeSubfoldersProps: PropTypes.object,
        /** Initial path of folders. The last folder in the array is the current folder. */
        initialFoldersPath: FoldersPathPropType.isRequired,
        /** Initial items that will show up as selected */
        initialSelectedItems: PropTypes.object,
        /** Whether to use the responsive version */
        isResponsive: PropTypes.bool,
        /**
         * Called when the current folder changes
         *
         * @param {Object} enteredFolder
         * @param {Array} newFoldersPath
         */
        onEnterFolder: PropTypes.func.isRequired,
        /** Called when the folders path is updated
         *
         * @param {Array} newFoldersPath
         */
        onFoldersPathUpdate: PropTypes.func,
        /** Called whenever the selected items list changes
         *
         * @param {Object} selectedItems
         */
        onSelectedItemsUpdate: PropTypes.func,
        /**
         * Called when an item is selected
         *
         * @param {Object} selectedItem
         * @param {number} selectedItemIndex
         */
        onSelectItem: PropTypes.func,
        /**
         * Called when an item is chosen
         *
         * @param {Object[]} chosenItems
         */
        onChooseItems: PropTypes.func,
        /** Called when selected button is clicked */
        onSelectedClick: PropTypes.func,
        /** Called when the number of items selected text is clicked */
        onViewSelectedClick: PropTypes.func,
        /**
         * Called when a destination folder has been selected for moving an item to
         *
         * @param {Object} destFolder destination folder
         */
        onMoveItem: PropTypes.func,
        /**
         * Called when a destination folder has been selected for copying an item to
         *
         * @param {Object} destFolder destination folder
         */
        onCopyItem: PropTypes.func,
        /** Called when cancel button is clicked */
        onCancelButtonClick: PropTypes.func,
        /** Called when new folder button is clicked */
        onCreateNewFolderButtonClick: PropTypes.func,
        /** Whether the new folder button should be shown */
        showCreateNewFolderButton: PropTypes.bool,
        /** Whether the choose button should be shown with a loading indicator */
        isChooseButtonLoading: PropTypes.bool,
        /** Whether the copy button should be shown with a loading indicator */
        isCopyButtonLoading: PropTypes.bool,
        /** Whether the user has permission to create a new folder */
        isCreateNewFolderAllowed: PropTypes.bool,
        /** Whether the user can see select all checkbox */
        isSelectAllAllowed: PropTypes.bool,
        /** Whether the move button should be shown with a loading indicator */
        isMoveButtonLoading: PropTypes.bool,
        /**
         * Called when a search query is submitted.
         *
         * @param {string} searchQuery
         */
        onSearchSubmit: PropTypes.func.isRequired,
        /**
         * Called when search mode is exited. An updated items list should now be passed in to display the user's file tree.
         *
         * @param {Object} folderBeforeSearch the previous folder object before entering search mode
         */
        onExitSearch: PropTypes.func.isRequired,
        /** List of items to display */
        items: ItemsPropType.isRequired,
        /** Number of items to load per page as the user scrolls */
        numItemsPerPage: PropTypes.number,
        /** Total number of items across all pages */
        numTotalItems: PropTypes.number,
        /** Called to load more items */
        onLoadMoreItems: PropTypes.func,
        /** Used to render item icons in the list. Overrides the default icons. */
        itemIconRenderer: PropTypes.func,
        /** Used to render item name links in the list. Overrides the default links. */
        itemNameLinkRenderer: PropTypes.func,
        /** Used to render item buttons in the list. Overrides the default buttons. */
        itemButtonRenderer: PropTypes.func,
        /** Height of an item row */
        itemRowHeight: PropTypes.number,
        /** Used to render the row element for items on the list. Allows row customizations such as adding tooltips, etc. */
        itemRowRenderer: PropTypes.func,
        /** Height of the item list header, defaults to 0, which makes header not visible */
        listHeaderHeight: PropTypes.number,
        /** Used to render the header row on the item list */
        listHeaderRenderer: PropTypes.func,
        /** Width of the item list */
        listWidth: PropTypes.number.isRequired,
        /** Height of the item list */
        listHeight: PropTypes.number.isRequired,
        /** Props for the search input */
        searchInputProps: PropTypes.object,
        /** Text for the informational notice, defaults to empty string, which makes notice not visible */
        infoNoticeText: PropTypes.string,
        /** Used to render the no items state. Overrides the default no items state. */
        noItemsRenderer: PropTypes.func,
    };

    static defaultProps = {
        actionButtonsProps: {},
        cancelButtonProps: {},
        chooseButtonProps: {},
        className: '',
        searchInputProps: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: props.initialSelectedItems || {},
            foldersPath: props.initialFoldersPath,
            isInSearchMode: false,
            isSelectAllChecked: false,
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick, true);
    }

    componentDidUpdate({ initialFoldersPath: prevInitialFoldersPath }) {
        const { initialFoldersPath, isSelectAllAllowed } = this.props;
        const { isSelectAllChecked } = this.state;

        if (prevInitialFoldersPath !== initialFoldersPath) {
            this.handleFoldersPathUpdated(initialFoldersPath);
        }
        if (!this.isLoadingItems() && isSelectAllAllowed) {
            const areAllItemsSelected = this.areAllItemsSelected();
            if (areAllItemsSelected !== isSelectAllChecked) {
                this.setState({ isSelectAllChecked: areAllItemsSelected });
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick, true);
    }

    getAllSelectedItems = () => {
        return { ...this.state.selectedItems, ...this.props.controlledSelectedItems };
    };

    areAllItemsSelected = () => {
        const { items } = this.props;
        const { selectedItems } = this.state;

        return items.length > 0 && items.every(item => selectedItems[item.id]);
    };

    isLoadingItems = () => {
        return this.props?.items?.[0]?.isLoading;
    };

    getCurrentFolder() {
        const { foldersPath } = this.state;
        return foldersPath[foldersPath.length - 1];
    }

    /**
     * Traverse the hirerachy up to the limit to see if any of the parent has the className
     */
    doAncestersContainClassname = (node, className, limit) => {
        let nodeOfInterest = node;
        let counter = 0;
        while (nodeOfInterest.parentNode && counter < limit) {
            // Done traversing (Document node does not have classnames)
            if (!nodeOfInterest.parentNode.className) {
                break;
            }

            if (nodeOfInterest.parentNode.className.includes(className)) {
                return true;
            }

            nodeOfInterest = nodeOfInterest.parentNode;
            counter += 1;
        }

        return false;
    };

    shouldDeselectItems = () => {
        const { contentExplorerMode } = this.props;

        return (
            // always deselect when not in multi select mode
            contentExplorerMode !== ContentExplorerModes.MULTI_SELECT
        );
    };

    handleDocumentClick = event => {
        const isInside = (this.domNode && this.domNode.contains(event.target)) || this.domNode === event.target;

        if (!isInside && this.shouldDeselectItems()) {
            this.deselectItems();
        }
    };

    handleContentExplorerClick = () => {
        if (this.shouldDeselectItems()) {
            this.deselectItems();
        }
    };

    deselectItems() {
        const { onSelectedItemsUpdate } = this.props;
        this.setState({
            selectedItems: {},
        });
        if (onSelectedItemsUpdate) {
            onSelectedItemsUpdate({});
        }
    }

    enterFolder = enteredFolder => {
        const { contentExplorerMode, onEnterFolder, onFoldersPathUpdate } = this.props;
        const { foldersPath } = this.state;

        const folderIndex = foldersPath.findIndex(folder => folder.id === enteredFolder.id);
        let newFoldersPath = foldersPath.slice();

        if (folderIndex === -1) {
            // Append folder to the path if it's not already in the folders path
            newFoldersPath = newFoldersPath.concat([
                {
                    ...enteredFolder,
                },
            ]);
        } else {
            // Otherwise, remove all folders that came after the entered folder
            newFoldersPath = newFoldersPath.slice(0, folderIndex + 1);
        }

        const newState = { foldersPath: newFoldersPath };
        if (contentExplorerMode !== ContentExplorerModes.MULTI_SELECT) {
            newState.selectedItems = {};
        }

        this.setState(newState);
        if (onFoldersPathUpdate) {
            onFoldersPathUpdate(newFoldersPath);
        }

        onEnterFolder(enteredFolder, newFoldersPath);
    };

    handleFoldersPathUpdated = newFoldersPath => {
        const { onFoldersPathUpdate } = this.props;

        this.setState({
            foldersPath: newFoldersPath,
        });
        if (onFoldersPathUpdate) {
            onFoldersPathUpdate(newFoldersPath);
        }
    };

    handleSearchSubmit = searchQuery => {
        const { onSearchSubmit } = this.props;

        this.setState({ isInSearchMode: true });
        onSearchSubmit(searchQuery);
    };

    handleExitSearch = folderBeforeSearch => {
        const { onExitSearch } = this.props;

        this.setState({ isInSearchMode: false });
        onExitSearch(folderBeforeSearch);
    };

    handleItemClick = ({ event, index }) => {
        const { contentExplorerMode, items, onSelectItem, onSelectedItemsUpdate } = this.props;
        const item = items[index];

        if (item.isDisabled || item.isLoading || item.isActionDisabled) {
            return;
        }

        // Prevent the event from bubbling up (so our content explorer click handler doesn't fire)
        event.stopPropagation();

        let newSelectedItems = {};
        if (contentExplorerMode === ContentExplorerModes.MULTI_SELECT) {
            newSelectedItems = this.toggleSelectedItem(this.getAllSelectedItems(), item);
        } else {
            newSelectedItems[item.id] = item;
        }

        this.setState({ selectedItems: newSelectedItems });
        if (onSelectedItemsUpdate) {
            onSelectedItemsUpdate(newSelectedItems);
        }

        if (onSelectItem) {
            onSelectItem(item, index);
        }
    };

    handleItemDoubleClick = ({ index }) => {
        const { items, onChooseItems } = this.props;
        const item = items[index];

        if (item.isDisabled || item.isLoading) {
            return;
        }

        if (item.type === TYPE_FOLDER) {
            this.enterFolder(item);
        } else if (!item.isActionDisabled) {
            onChooseItems([item]);
        }
    };

    handleItemNameClick = (event, index) => {
        const { items } = this.props;
        const item = items[index];

        if (item.isDisabled || item.isLoading) {
            return;
        }

        if (item.type !== TYPE_FOLDER) {
            return;
        }

        // Prevent the event from bubbling (so our row click handler doesn't fire)
        event.preventDefault();
        event.stopPropagation();

        this.enterFolder(item);
    };

    toggleSelectedItem = (selectedItems, item) => {
        const result = { ...selectedItems };
        if (result[item.id]) {
            delete result[item.id];
        } else {
            result[item.id] = item;
        }

        return result;
    };

    selectAll = () => {
        const { items } = this.props;
        const { selectedItems } = this.state;
        const result = { ...selectedItems };
        items.forEach(item => {
            if (!result[item.id]) {
                result[item.id] = item;
            }
        });
        return result;
    };

    unselectAll = () => {
        const { items } = this.props;
        const { selectedItems } = this.state;
        const result = { ...selectedItems };
        items.forEach(item => {
            if (result[item.id]) {
                delete result[item.id];
            }
        });
        return result;
    };

    handleSelectAllClick = async () => {
        const { onSelectedItemsUpdate } = this.props;
        if (this.isLoadingItems()) {
            return;
        }
        const { isSelectAllChecked } = this.state;
        const newSelectedItems = isSelectAllChecked ? this.unselectAll() : this.selectAll();

        this.setState({ selectedItems: newSelectedItems, isSelectAllChecked: !isSelectAllChecked });
        if (onSelectedItemsUpdate) {
            onSelectedItemsUpdate(newSelectedItems);
        }
    };

    renderItemListEmptyState = () => {
        const { foldersPath, isInSearchMode } = this.state;
        const isViewingSearchResults = isInSearchMode && foldersPath.length === 1;

        return <ContentExplorerEmptyState isSearch={isViewingSearchResults} />;
    };

    render() {
        const {
            actionButtonsProps,
            additionalColumns,
            controlledSelectedItems,
            isNoSelectionAllowed = false,
            breadcrumbIcon,
            breadcrumbProps,
            cancelButtonProps,
            chooseButtonProps,
            chooseButtonText,
            className,
            contentExplorerMode,
            customInput,
            hasFolderTreeBreadcrumbs,
            headerActionsAccessory,
            onChooseItems,
            onMoveItem,
            onCopyItem,
            onCancelButtonClick,
            onCreateNewFolderButtonClick,
            onSelectedClick,
            onViewSelectedClick,
            showCreateNewFolderButton,
            isChooseButtonLoading,
            isCopyButtonLoading,
            isCreateNewFolderAllowed,
            isMoveButtonLoading,
            isResponsive = false,
            isSelectAllAllowed,
            items,
            numItemsPerPage,
            numTotalItems,
            onLoadMoreItems,
            includeSubfoldersProps,
            itemIconRenderer,
            itemNameLinkRenderer,
            itemButtonRenderer,
            itemRowHeight,
            itemRowRenderer,
            listHeaderHeight,
            listHeaderRenderer,
            listWidth,
            listHeight,
            searchInputProps,
            infoNoticeText,
            noItemsRenderer,
            ...rest
        } = this.props;
        const { isInSearchMode, foldersPath, isSelectAllChecked } = this.state;
        const allSelectedItems = this.getAllSelectedItems();

        const isViewingSearchResults = isInSearchMode && foldersPath.length === 1;
        const currentFolder = this.getCurrentFolder();
        const contentExplorerProps = omit(rest, [
            'initialFoldersPath',
            'onEnterFolder',
            'onSelectItem',
            'onSearchSubmit',
            'onExitSearch',
            'initialSelectedItems',
            'onFoldersPathUpdate',
            'onSelectedItemsUpdate',
        ]);
        const canIncludeSubfolders = !!includeSubfoldersProps;
        const hasSubheader = canIncludeSubfolders || isSelectAllAllowed;

        const selectedItemsIds = Object.keys(allSelectedItems);
        let areActionButtonsDisabled;
        // NOTE: it almost feels like this whole section should be inside the
        // ContentExplorerActionButtons instead. There's a lot of implicit knowledge
        // of what the action buttons are and what they should be doing.
        const isFirstSelectedItemDisabled = allSelectedItems[selectedItemsIds[0]]?.isActionDisabled;
        if (contentExplorerMode === ContentExplorerModes.MULTI_SELECT) {
            // NOTE: only expecting to have 1 (choose) button so as long as something
            // is selected and that item's isActionDisabled is false, we enable the action button
            areActionButtonsDisabled =
                (selectedItemsIds.length === 0 && !isNoSelectionAllowed) ||
                (selectedItemsIds.length === 1 && isFirstSelectedItemDisabled);
        } else if (isViewingSearchResults || contentExplorerMode === ContentExplorerModes.SELECT_FILE) {
            // Buttons are only enabled when an item is selected
            // When viewing search results, there is no "current folder"
            // When selecting a file, the file can only selected from the list
            areActionButtonsDisabled = selectedItemsIds.length === 0 || isFirstSelectedItemDisabled;
        } else {
            // Buttons are enabled using the selected item or the current folder if no item is selected
            areActionButtonsDisabled =
                selectedItemsIds.length > 0 ? isFirstSelectedItemDisabled : currentFolder.isActionDisabled;
        }

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
            <div
                className={classNames('content-explorer', className, {
                    'bdl-ContentExplorer--responsive': isResponsive,
                })}
                data-testid="content-explorer"
                onClick={this.handleContentExplorerClick}
                ref={ref => {
                    this.domNode = ref;
                }}
                {...contentExplorerProps}
            >
                {infoNoticeText && <ContentExplorerInfoNotice infoNoticeText={infoNoticeText} />}
                <ContentExplorerHeaderActions
                    breadcrumbIcon={breadcrumbIcon}
                    breadcrumbProps={breadcrumbProps}
                    contentExplorerMode={contentExplorerMode}
                    customInput={customInput}
                    foldersPath={foldersPath}
                    hasFolderTreeBreadcrumbs={hasFolderTreeBreadcrumbs}
                    isCreateNewFolderAllowed={isCreateNewFolderAllowed}
                    onCreateNewFolderButtonClick={onCreateNewFolderButtonClick}
                    onFoldersPathUpdated={this.handleFoldersPathUpdated}
                    onEnterFolder={this.enterFolder}
                    onExitSearch={this.handleExitSearch}
                    onSearchSubmit={this.handleSearchSubmit}
                    numTotalItems={numTotalItems}
                    searchInputProps={searchInputProps}
                    showCreateNewFolderButton={showCreateNewFolderButton}
                >
                    {headerActionsAccessory}
                </ContentExplorerHeaderActions>
                {hasSubheader && (
                    <div className="bdl-ContentExplorer-subheader">
                        {canIncludeSubfolders && <ContentExplorerIncludeSubfolders {...includeSubfoldersProps} />}
                        {isSelectAllAllowed && (
                            <ContentExplorerSelectAll
                                handleSelectAllClick={this.handleSelectAllClick}
                                isLabelHidden={canIncludeSubfolders}
                                isSelectAllChecked={isSelectAllChecked}
                                numTotalItems={numTotalItems}
                            />
                        )}
                    </div>
                )}
                <ItemList
                    additionalColumns={additionalColumns}
                    contentExplorerMode={contentExplorerMode}
                    headerHeight={listHeaderHeight}
                    headerRenderer={listHeaderRenderer}
                    height={listHeight}
                    isResponsive={isResponsive}
                    itemButtonRenderer={itemButtonRenderer}
                    itemIconRenderer={itemIconRenderer}
                    itemNameLinkRenderer={itemNameLinkRenderer}
                    items={items}
                    itemRowRenderer={itemRowRenderer}
                    noItemsRenderer={noItemsRenderer || this.renderItemListEmptyState}
                    numItemsPerPage={numItemsPerPage}
                    numTotalItems={numTotalItems}
                    onItemClick={this.handleItemClick}
                    onItemDoubleClick={this.handleItemDoubleClick}
                    onItemNameClick={this.handleItemNameClick}
                    onLoadMoreItems={onLoadMoreItems}
                    rowHeight={itemRowHeight}
                    selectedItems={allSelectedItems}
                    width={listWidth}
                />
                <ContentExplorerActionButtons
                    actionButtonsProps={actionButtonsProps}
                    areButtonsDisabled={areActionButtonsDisabled}
                    cancelButtonProps={cancelButtonProps}
                    canIncludeSubfolders={canIncludeSubfolders}
                    chooseButtonProps={chooseButtonProps}
                    chooseButtonText={chooseButtonText}
                    contentExplorerMode={contentExplorerMode}
                    currentFolder={currentFolder}
                    isChooseButtonLoading={isChooseButtonLoading}
                    isCopyButtonLoading={isCopyButtonLoading}
                    isMoveButtonLoading={isMoveButtonLoading}
                    isResponsive={isResponsive}
                    isSelectAllAllowed={isSelectAllAllowed}
                    onCancelClick={onCancelButtonClick}
                    onChooseClick={onChooseItems}
                    onCopyClick={onCopyItem}
                    onFoldersPathUpdated={this.handleFoldersPathUpdated}
                    onSelectedClick={onSelectedClick}
                    onMoveClick={onMoveItem}
                    onViewSelectedClick={onViewSelectedClick}
                    selectedItems={allSelectedItems}
                    isNoSelectionAllowed={isNoSelectionAllowed}
                />
            </div>
        );
    }
}

export default ContentExplorer;
