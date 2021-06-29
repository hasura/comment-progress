import { findMatchingComment, findMatchingComments } from './comment/commenter';
import getCommentPrefix from './identifier';

// normal mode creates a comment when there is no existing comment that match identifier
// and updates the matching comment if found
export async function normalMode(commenter, identifier, message) {
  console.log(`Checking if a comment already exists for ${identifier}.`);
  const matchingComment = await findMatchingComment(commenter, identifier);

  const comment = `${getCommentPrefix(identifier)}\n${message}`;

  if (matchingComment) {
    console.log(`Updating an existing comment for ${identifier}.`);
    await commenter.updateComment(matchingComment.id, comment);
    return;
  }

  console.log(`Creating a new comment for ${identifier}.`);
  await commenter.createComment(comment);
}

// recreate mode deletes existing comments that match the identifier
// and creates a new comment
export async function recreateMode(commenter, identifier, message) {
  console.log(`Finding matching comments for ${identifier}.`);
  const matchingComments = await findMatchingComments(commenter, identifier);

  for (const comment of matchingComments) {
    console.log(`Deleting github comment ${comment.id}`);
    await commenter.deleteComment(comment.id);
  }

  console.log(`Creating a new comment for ${identifier}.`);
  const comment = `${getCommentPrefix(identifier)}\n${message}`;
  await commenter.createComment(comment);
}

// append mode creates a comment when there is no existing comment that match identifier
// and appends message to a matching comment if found.
export async function appendMode(commenter, identifier, message) {
  console.log(`Checking if a comment already exists for ${identifier}.`);
  const matchingComment = await findMatchingComment(commenter, identifier);

  if (matchingComment) {
    console.log(`Updating an existing comment for ${identifier}.`);
    const comment = `${matchingComment.body}\n${message}`;
    await commenter.updateComment(matchingComment.id, comment);
    return;
  }

  console.log(`Creating a new comment for ${identifier}.`);
  const comment = `${getCommentPrefix(identifier)}\n${message}`;
  await commenter.createComment(comment);
}
