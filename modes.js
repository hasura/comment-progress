import { findMatchingComment, findMatchingComments } from './comment';
import { getCommentPrefix } from './identifier';


async function createComment(data, context, isCommitComment) {
  if (!isCommitComment) {
    data.issue_number = context;
    await octokit.issues.createComment(data);
  } else {
    data.commit_sha = context;
    await octokit.repos.createCommitComment(data);
  }
}

async function deleteComment(data, isCommitComment) {
  if (!isCommitComment) {
    await octokit.issues.deleteComment(data);
  } else {
    await octokit.repos.deleteCommitComment(data);
  }
}

async function updateComment(data, isCommitComment) {
  if (!isCommitComment) {
    await octokit.issues.updateComment(data);
  } else {
    await octokit.issues.updateCommitComment(data);
  }
}

// normal mode creates a comment when there is no existing comment that match identifier
// and updates the matching comment if found
export async function normalMode({octokit, owner, repo, context, isCommitComment, identifier, message}) {
  console.log(`Checking if a comment already exists for ${identifier}.`);
  const matchingComment = await findMatchingComment({
    octokit,
    owner,
    repo,
    context,
    isCommitComment,
    identifier,
  });

  const comment = `${getCommentPrefix(identifier)}\n${message}`;

  if (matchingComment) {
    console.log(`Updating an existing comment for ${identifier}.`);
    await updateComment({
      owner,
      repo,
      comment,
    }, isCommitComment);
    return;
  }

  console.log(`Creating a new comment for ${identifier}.`);
  await createComment({
    owner,
    repo,
    comment,
  }, context, isCommitComment);
}

// recreate mode deletes existing comments that match the idemtifier
// and create a new comment
export async function recreateMode({octokit, owner, repo, context, isCommitComment, identifier, message}) {
  console.log(`Finding matching comments for ${identifier}.`);
  const matchingComments = await findMatchingComments({
    octokit,
    owner,
    repo,
    context,
    isCommitComment,
    identifier,
  });

  for (let comment of matchingComments) {
    console.log(`Deleting github comment ${comment.id}`);
    await deleteComment({
      owner,
      repo,
      comment_id: comment.id,
    }, isCommitComment);
  }

  const comment = `${getCommentPrefix(identifier)}\n${message}`;

  console.log(`Creating a new comment for ${identifier}.`);
  await createComment({
    owner,
    repo,
    comment,
  }, context, isCommitComment);
}


// append mode creates a comment when there is no existing comment that match identifier
// and appends message to a matching comment if found.
export async function appendMode({octokit, owner, repo, context, isCommitComment, identifier, message}) {
  console.log(`Checking if a comment already exists for ${identifier}.`);
  const matchingComment = await findMatchingComment({
    octokit,
    owner,
    repo,
    context,
    isCommitComment,
    identifier,
  });

  const comment = `${matchingComment.body}\n${message}`;

  if (matchingComment) {
    console.log(`Updating an existing comment for ${identifier}.`);
    await updateComment({
      owner,
      repo,
      comment_id: matchingComment.id,
      comment,
    }, isCommitComment);
    return;
  }

  console.log(`Creating a new comment for ${identifier}.`);
  await createComment({
    owner,
    repo,
    comment,
  }, context, isCommitComment);
}
