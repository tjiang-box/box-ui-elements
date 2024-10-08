/**
 * @flow
 * @file Utils for the box APIs
 * @author Box
 */

import type Xhr from '../utils/Xhr';
import type { Comment } from '../common/types/feed';
import { getAbortError } from '../utils/error';

/**
 * Formats comment data (including replies) for use in components.
 *
 * @param {Comment} comment - An individual comment entry from the API
 * @return {Comment} Updated comment
 */
export const formatComment = (comment: Comment): Comment => {
    const formattedComment = {
        ...comment,
        tagged_message: comment.message,
    };

    if (comment.replies && comment.replies.length) {
        formattedComment.replies = comment.replies.map(formatComment);
    }

    return formattedComment;
};

export const handleOnAbort = (xhr: Xhr) => {
    xhr.abort();

    throw getAbortError();
};

export default {
    formatComment,
};
