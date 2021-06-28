import { findMatchingComment, findMatchingComments } from './comment';
import { getCommentPrefix } from './identifier';

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

// recreate mode deletes existing comments that match the idemtifier
// and create a new comment
export async function recreateMode(commenter, identifier, message) {
  console.log(`Finding matching comments for ${identifier}.`);
  const matchingComments = await findMatchingComments(commenter, identifier);

  for (let comment of matchingComments) {
    console.log(`Deleting github comment ${comment.id}`);
    await commenter.deleteComment(comment.id);
  }

  const comment = `${getCommentPrefix(identifier)}\n${message}`;

  console.log(`Creating a new comment for ${identifier}.`);
  await commenter.createComment(comment);
}


// append mode creates a comment when there is no existing comment that match identifier
// and appends message to a matching comment if found.
export async function appendMode(commenter, identifier, message) {
  console.log(`Checking if a comment already exists for ${identifier}.`);
  const matchingComment = await findMatchingComment(commenter, identifier);

  const comment = `${matchingComment.body}\n${message}`;

  if (matchingComment) {
    console.log(`Updating an existing comment for ${identifier}.`);
    await commenter.updateComment(matchingComment.id, comment);
    return;
  }

  console.log(`Creating a new comment for ${identifier}.`);
  await commenter.createComment(comment);
}
