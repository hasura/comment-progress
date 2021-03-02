import { findMatchingComment, findMatchingComments } from './comment';
import { getCommentPrefix } from './identifier';

// normal mode creates a comment when there is no existing comment that match identifier
// and updates the matching comment if found
export async function normalMode({octokit, owner, repo, number, identifier, message}) {
    console.log(`Checking if a comment already exists for ${identifier}.`);
    const matchingComment = await findMatchingComment({
      octokit,
      owner,
      repo,
      issue_number: number,
      identifier,
    });
  
    const comment = `${getCommentPrefix(identifier)}\n${message}`;
  
    if (matchingComment) {
      console.log(`Updating an existing comment for ${identifier}.`);
      await octokit.issues.updateComment({
        owner,
        repo,
        comment_id: matchingComment.id,
        body: comment,
      });
      return;
    }
  
    console.log(`Creating a new comment for ${identifier}.`);
    await octokit.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: number,
      body: comment,
    });
  }
  
  // recreate mode deletes existing comments that match the idemtifier
  // and create a new comment
  export async function recreateMode({octokit, owner, repo, number, identifier, message}) {
    console.log(`Finding matching comments for ${identifier}.`);
    const matchingComments = await findMatchingComments({
      octokit,
      owner,
      repo,
      issue_number: number,
      identifier,
    });
  
    for (let comment of matchingComments) {
      console.log(`Deleting github comment ${comment.id}`);
      await octokit.issues.deleteComment({
        owner,
        repo,
        comment_id: comment.id,
      });
    }
  
    const comment = `${getCommentPrefix(identifier)}\n${message}`;
  
    console.log(`Creating a new comment for ${identifier}.`);
    await octokit.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: number,
      body: comment,
    });
  }
  

  // append mode creates a comment when there is no existing comment that match identifier
  // and appends message to a matching comment if found.
  export async function appendMode({octokit, owner, repo, number, identifier, message}) {
    console.log(`Checking if a comment already exists for ${identifier}.`);
    const matchingComment = await findMatchingComment({
      octokit,
      owner,
      repo,
      issue_number: number,
      identifier,
    });
  
    const comment = `${matchingComment.body}\n${message}`;
  
    if (matchingComment) {
      console.log(`Updating an existing comment for ${identifier}.`);
      await octokit.issues.updateComment({
        owner,
        repo,
        comment_id: matchingComment.id,
        body: comment,
      });
      return;
    }
  
    console.log(`Creating a new comment for ${identifier}.`);
    await octokit.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: number,
      body: comment,
    });
  }