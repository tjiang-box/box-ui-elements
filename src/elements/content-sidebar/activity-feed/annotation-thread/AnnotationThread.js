/**
 * @flow
 * @file Annotation Thread Container
 * @author Box
 */

import * as React from 'react';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import { IntlProvider } from 'react-intl';
import type EventEmitter from 'events';
import AnnotationThreadContent from './AnnotationThreadContent';
import AnnotationThreadCreate from './AnnotationThreadCreate';
import useAnnotationThread from './useAnnotationThread';
import API from '../../../../api/APIFactory';
import { DEFAULT_COLLAB_DEBOUNCE, DEFAULT_HOSTNAME_API } from '../../../../constants';

import type APICache from '../../../../utils/Cache';
import type { BoxItem, SelectorItems, StringMap, Token, User } from '../../../../common/types/core';
import type { ElementOrigin, ElementsXhrError } from '../../../../common/types/api';
import type { Annotation, Target } from '../../../../common/types/annotations';
import type { GetProfileUrlCallback } from '../../../common/flowTypes';

import './AnnotationThread.scss';

type Props = {
    annotationId?: string,
    apiHost?: string,
    cache?: APICache,
    className?: string,
    clientName: string,
    currentUser: User,
    eventEmitter: EventEmitter,
    file: BoxItem,
    getUserProfileUrl?: GetProfileUrlCallback,
    handleCancel: () => void,
    language?: string,
    messages?: StringMap,
    onAnnotationCreate: (annotation: Annotation) => void,
    onError: (error: ElementsXhrError | Error, code: string, contextInfo?: Object, origin?: ElementOrigin) => void,
    target: Target,
    token: Token,
};

const AnnotationThread = ({
    annotationId,
    apiHost = DEFAULT_HOSTNAME_API,
    cache,
    className = '',
    clientName,
    currentUser,
    eventEmitter,
    file,
    getUserProfileUrl,
    handleCancel,
    language,
    messages,
    onAnnotationCreate,
    onError,
    target,
    token,
}: Props) => {
    const [mentionSelectorContacts, setMentionSelectorContacts] = React.useState<SelectorItems<>>([]);

    const api = new API({
        apiHost,
        cache,
        clientName,
        language,
        token,
    });

    const {
        annotation,
        replies,
        isLoading,
        error,
        annotationActions: {
            handleAnnotationCreate,
            handleAnnotationDelete,
            handleAnnotationEdit,
            handleAnnotationStatusChange,
        },
        repliesActions: { handleReplyEdit, handleReplyCreate, handleReplyDelete },
    } = useAnnotationThread({
        api,
        annotationId,
        currentUser,
        errorCallback: onError,
        eventEmitter,
        file,
        onAnnotationCreate,
        target,
    });

    const getAvatarUrl = async (userId: string): Promise<?string> =>
        api.getUsersAPI(false).getAvatarUrlWithAccessToken(userId, file.id);

    const getMentionContactsSuccessCallback = ({ entries }: { entries: SelectorItems<> }): void => {
        setMentionSelectorContacts(entries);
    };

    const getMentionWithQuery = debounce(searchStr => {
        api.getFileCollaboratorsAPI(false).getCollaboratorsWithQuery(
            file.id,
            getMentionContactsSuccessCallback,
            onError,
            searchStr,
        );
    }, DEFAULT_COLLAB_DEBOUNCE);

    return (
        <div className={classNames('AnnotationThread', className)} data-testid="annotation-thread">
            <IntlProvider locale={language} messages={messages}>
                {!annotationId ? (
                    <AnnotationThreadCreate
                        currentUser={currentUser}
                        getAvatarUrl={getAvatarUrl}
                        getMentionWithQuery={getMentionWithQuery}
                        isPending={isLoading}
                        mentionSelectorContacts={mentionSelectorContacts}
                        onFormCancel={handleCancel}
                        onFormSubmit={handleAnnotationCreate}
                    />
                ) : (
                    <AnnotationThreadContent
                        annotation={annotation}
                        currentUser={currentUser}
                        error={error}
                        getAvatarUrl={getAvatarUrl}
                        getMentionWithQuery={getMentionWithQuery}
                        getUserProfileUrl={getUserProfileUrl}
                        isLoading={isLoading}
                        mentionSelectorContacts={mentionSelectorContacts}
                        onAnnotationDelete={handleAnnotationDelete}
                        onAnnotationEdit={handleAnnotationEdit}
                        onAnnotationStatusChange={handleAnnotationStatusChange}
                        onReplyCreate={handleReplyCreate}
                        onReplyDelete={handleReplyDelete}
                        onReplyEdit={handleReplyEdit}
                        replies={replies}
                    />
                )}
            </IntlProvider>
        </div>
    );
};

export default AnnotationThread;
