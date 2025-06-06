/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import flow from 'lodash/flow';
import { FormattedMessage, useIntl } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { InlineError, LoadingIndicator } from '@box/blueprint-web';
import {
    AddMetadataTemplateDropdown,
    AutofillContextProvider,
    FilterInstancesDropdown,
    MetadataEmptyState,
    MetadataInstanceList,
    type FormValues,
    type JSONPatchOperations,
    type MetadataTemplate,
    type MetadataTemplateInstance,
} from '@box/metadata-editor';
import { TreeQueryInput } from '@box/combobox-with-api';

import API from '../../api';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { useFeatureEnabled } from '../common/feature-checking';
import {
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
    SIDEBAR_VIEW_METADATA,
    ERROR_CODE_METADATA_STRUCTURED_TEXT_REP,
} from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import useSidebarMetadataFetcher, { STATUS } from './hooks/useSidebarMetadataFetcher';

import { type WithLoggerProps } from '../../common/types/logging';

import messages from '../common/messages';
import './MetadataSidebarRedesign.scss';
import MetadataInstanceEditor from './MetadataInstanceEditor';
import { convertTemplateToTemplateInstance } from './utils/convertTemplateToTemplateInstance';
import { isExtensionSupportedForMetadataSuggestions } from './utils/isExtensionSupportedForMetadataSuggestions';
import { metadataTaxonomyFetcher, metadataTaxonomyNodeAncestorsFetcher } from './fetchers/metadataTaxonomyFetcher';
import { useMetadataSidebarFilteredTemplates } from './hooks/useMetadataSidebarFilteredTemplates';

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

export interface ExternalProps {
    isFeatureEnabled: boolean;
    getStructuredTextRep?: (fileId: string, accessToken: string) => Promise<string>;
}

interface PropsWithoutContext extends ExternalProps {
    elementId: string;
    fileExtension?: string;
    fileId: string;
    filteredTemplateIds?: string[];
    hasSidebarInitialized?: boolean;
}

export interface ErrorContextProps {
    onError: (error: Error, code: string, contextInfo?: Record<string, unknown>) => void;
}

export interface SuccessContextProps {
    onSuccess: (code: string, showNotification: boolean) => void;
}

export interface MetadataSidebarRedesignProps
    extends PropsWithoutContext,
        ErrorContextProps,
        SuccessContextProps,
        WithLoggerProps,
        RouteComponentProps {
    api: API;
    createSessionRequest?: (
        payload: Record<string, unknown>,
        fileId: string,
    ) => Promise<{ metadata: { is_large_file: boolean } }>;
}

function MetadataSidebarRedesign({
    api,
    elementId,
    fileExtension,
    fileId,
    filteredTemplateIds = [],
    history,
    onError,
    onSuccess,
    isFeatureEnabled,
    createSessionRequest,
    getStructuredTextRep,
}: MetadataSidebarRedesignProps) {
    const {
        clearExtractError,
        extractSuggestions,
        file,
        handleCreateMetadataInstance,
        handleDeleteMetadataInstance,
        handleUpdateMetadataInstance,
        templates,
        extractErrorCode,
        errorMessage,
        status,
        templateInstances,
    } = useSidebarMetadataFetcher(api, fileId, onError, onSuccess, isFeatureEnabled);

    const { formatMessage } = useIntl();
    const isBoxAiSuggestionsEnabled: boolean = useFeatureEnabled('metadata.aiSuggestions.enabled');
    const isBetaLanguageEnabled: boolean = useFeatureEnabled('metadata.betaLanguage.enabled');
    const isMetadataMultiLevelTaxonomyFieldEnabled: boolean = useFeatureEnabled('metadata.multilevelTaxonomy.enabled');
    const isAdvancedExtractAgentEnabled: boolean = useFeatureEnabled('metadata.extractAdvancedAgents.enabled');
    const isDeleteConfirmationModalCheckboxEnabled: boolean = useFeatureEnabled(
        'metadata.deleteConfirmationModalCheckbox.enabled',
    );
    const isSessionInitiated = useRef(false);

    const [isLargeFile, setIsLargeFile] = useState<boolean>(false);

    const [editingTemplate, setEditingTemplate] = useState<MetadataTemplateInstance | null>(null);
    const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);
    const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState<boolean>(false);
    const [appliedTemplateInstances, setAppliedTemplateInstances] =
        useState<Array<MetadataTemplateInstance | MetadataTemplate>>(templateInstances);
    const [pendingTemplateToEdit, setPendingTemplateToEdit] = useState<MetadataTemplateInstance | null>(null);
    const shouldFetchStructuredTextRep =
        isBoxAiSuggestionsEnabled &&
        fileExtension?.toLowerCase() === 'pdf' &&
        api.options?.token &&
        !!getStructuredTextRep;

    // Fetch structured text representation for Box AI
    useEffect(() => {
        if (shouldFetchStructuredTextRep) {
            api.options.token(fileId).then(({ read }) => {
                getStructuredTextRep(fileId, read)
                    .then()
                    .catch(error => {
                        onError(error, ERROR_CODE_METADATA_STRUCTURED_TEXT_REP);
                    });
            });
        }
    }, [
        api.options,
        fileExtension,
        fileId,
        getStructuredTextRep,
        isBoxAiSuggestionsEnabled,
        onError,
        shouldFetchStructuredTextRep,
    ]);

    useEffect(() => {
        // disable only pre-existing template instances from dropdown if not editing or editing pre-exiting one
        const isEditingTemplateAlreadyExisting =
            editingTemplate &&
            templateInstances.some(
                t => t.templateKey === editingTemplate.templateKey && t.scope === editingTemplate.scope,
            );

        if (!editingTemplate || isEditingTemplateAlreadyExisting) {
            setAppliedTemplateInstances(templateInstances);
        } else {
            setAppliedTemplateInstances([...templateInstances, editingTemplate]);
        }
    }, [editingTemplate, templateInstances, templateInstances.length]);

    const handleTemplateSelect = (selectedTemplate: MetadataTemplate) => {
        clearExtractError();

        if (editingTemplate) {
            setPendingTemplateToEdit(convertTemplateToTemplateInstance(file, selectedTemplate));
            setIsUnsavedChangesModalOpen(true);
        } else {
            setEditingTemplate(convertTemplateToTemplateInstance(file, selectedTemplate));
            setIsDeleteButtonDisabled(true);
        }
    };

    const handleCancel = () => {
        clearExtractError();
        setEditingTemplate(null);
    };

    const handleDiscardUnsavedChanges = () => {
        // check if user tried to edit another template before unsaved changes modal
        if (pendingTemplateToEdit) {
            setEditingTemplate(pendingTemplateToEdit);
            setIsDeleteButtonDisabled(true);

            setPendingTemplateToEdit(null);
        } else {
            handleCancel();
        }

        setIsUnsavedChangesModalOpen(false);
    };

    const handleDeleteInstance = async (metadataInstance: MetadataTemplateInstance) => {
        try {
            await handleDeleteMetadataInstance(metadataInstance);
        } catch {
            // ignore error, handled in useSidebarMetadataFetcher
        }
        clearExtractError();
        setEditingTemplate(null);
    };

    const isExistingMetadataInstance = (): boolean => {
        return (
            editingTemplate && !!templateInstances.find(templateInstance => templateInstance.id === editingTemplate.id)
        );
    };

    const handleSubmit = async (values: FormValues, operations: JSONPatchOperations) => {
        if (isExistingMetadataInstance()) {
            await handleUpdateMetadataInstance(values.metadata as MetadataTemplateInstance, operations, () =>
                setEditingTemplate(null),
            );
        } else {
            await handleCreateMetadataInstance(values.metadata as MetadataTemplateInstance, () =>
                setEditingTemplate(null),
            );
        }
    };

    const visibleTemplateInstances = templateInstances.filter(templateInstance => !templateInstance.hidden);

    const isSuccess = status === STATUS.SUCCESS;
    const isLoading = status === STATUS.LOADING;

    const isViewMode = !isLoading && file && templates && templateInstances && !editingTemplate;
    const showEmptyState = isViewMode && visibleTemplateInstances.length === 0;
    const showList = isViewMode && visibleTemplateInstances.length > 0;

    const areAiSuggestionsAvailable = isExtensionSupportedForMetadataSuggestions(file?.extension ?? '');

    const metadataDropdown = isSuccess && templates && (
        <AddMetadataTemplateDropdown
            availableTemplates={templates}
            selectedTemplates={appliedTemplateInstances as MetadataTemplate[]}
            onSelect={handleTemplateSelect}
        />
    );

    const { handleSetFilteredTemplates, filteredTemplates, templateInstancesList } =
        useMetadataSidebarFilteredTemplates(history, filteredTemplateIds, templateInstances);
    const filterDropdown =
        isSuccess && isViewMode && visibleTemplateInstances.length > 1 ? (
            <FilterInstancesDropdown
                appliedTemplates={visibleTemplateInstances as MetadataTemplate[]}
                selectedTemplates={filteredTemplates}
                setSelectedTemplates={handleSetFilteredTemplates}
            />
        ) : null;

    const errorMessageDisplay = status === STATUS.ERROR && errorMessage && (
        <InlineError className="bcs-MetadataSidebarRedesign-inline-error">
            <FormattedMessage {...errorMessage} />
        </InlineError>
    );

    const taxonomyOptionsFetcher = useCallback(
        (scope: string, templateKey: string, fieldKey: string, level: number, options: TreeQueryInput) =>
            metadataTaxonomyFetcher(api, fileId, scope, templateKey, fieldKey, level, options),
        [api, fileId],
    );

    const taxonomyNodeFetcher = useCallback(
        (scope: string, taxonomyKey: string, nodeID: string) =>
            metadataTaxonomyNodeAncestorsFetcher(api, fileId, scope, taxonomyKey, nodeID),
        [api, fileId],
    );

    useEffect(() => {
        if (createSessionRequest && fileId && !isSessionInitiated.current) {
            isSessionInitiated.current = true;
            createSessionRequest({ items: [{ id: fileId }] }, fileId).then(
                ({ metadata = { is_large_file: false } }) => {
                    setIsLargeFile(metadata.is_large_file);
                },
            );
        }
    }, [createSessionRequest, fileId]);

    return (
        <SidebarContent
            actions={metadataDropdown}
            className={'bcs-MetadataSidebarRedesign'}
            elementId={elementId}
            sidebarView={SIDEBAR_VIEW_METADATA}
            title={formatMessage(messages.sidebarMetadataTitle)}
            subheader={filterDropdown}
        >
            <div className="bcs-MetadataSidebarRedesign-content">
                {errorMessageDisplay}
                {isLoading && <LoadingIndicator aria-label={formatMessage(messages.loading)} />}
                {showEmptyState && (
                    <MetadataEmptyState level={'file'} isBoxAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled} />
                )}
                <AutofillContextProvider
                    fetchSuggestions={extractSuggestions}
                    isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                >
                    {editingTemplate && (
                        <MetadataInstanceEditor
                            areAiSuggestionsAvailable={areAiSuggestionsAvailable}
                            errorCode={extractErrorCode}
                            isBetaLanguageEnabled={isBetaLanguageEnabled}
                            isBoxAiSuggestionsEnabled={isBoxAiSuggestionsEnabled}
                            isDeleteButtonDisabled={isDeleteButtonDisabled}
                            isDeleteConfirmationModalCheckboxEnabled={isDeleteConfirmationModalCheckboxEnabled}
                            isLargeFile={isLargeFile}
                            isMetadataMultiLevelTaxonomyFieldEnabled={isMetadataMultiLevelTaxonomyFieldEnabled}
                            isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                            onCancel={handleCancel}
                            onDelete={handleDeleteInstance}
                            onDiscardUnsavedChanges={handleDiscardUnsavedChanges}
                            onSubmit={handleSubmit}
                            setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
                            taxonomyOptionsFetcher={taxonomyOptionsFetcher}
                            template={editingTemplate}
                            isAdvancedExtractAgentEnabled={isAdvancedExtractAgentEnabled}
                        />
                    )}
                    {showList && (
                        <MetadataInstanceList
                            areAiSuggestionsAvailable={areAiSuggestionsAvailable}
                            isAdvancedExtractAgentEnabled={isAdvancedExtractAgentEnabled}
                            isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                            isBetaLanguageEnabled={isBetaLanguageEnabled}
                            onEdit={templateInstance => {
                                setEditingTemplate(templateInstance);
                                setIsDeleteButtonDisabled(false);
                            }}
                            templateInstances={templateInstancesList}
                            taxonomyNodeFetcher={taxonomyNodeFetcher}
                        />
                    )}
                </AutofillContextProvider>
            </div>
        </SidebarContent>
    );
}

export { MetadataSidebarRedesign as MetadataSidebarRedesignComponent };
export default flow([
    withRouter,
    withLogger(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withErrorBoundary(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withAPIContext,
])(MetadataSidebarRedesign);
