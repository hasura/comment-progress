import getCommentPrefix from '../identifier';
import IssueCommenter from './issue_commenter';
import CommitCommenter from './commit_commenter';

export async function getCommenter(octokit, {
  owner, repo, number, commitSHA,
}) {
  if ((number && commitSHA) || (!number && !commitSHA)) {
    throw new Error('Either set the `number` or the `commit-sha` field.');
  }
  if (number) {
    return new IssueCommenter(octokit, { owner, repo, number });
  }
  if (commitSHA) {
    return new CommitCommenter(octokit, { owner, repo, commitSHA });
  }
  return null;
}

export async function findMatchingComments(commenter, identifier) {
  let fetchMoreComments = true;
  let page = 0;
  const matchingComments = [];
  const commentPrefix = getCommentPrefix(identifier);

  while (fetchMoreComments) {
    page += 1;
    const comments = await commenter.listComments({
      page,
      perPage: 100,
    });
    fetchMoreComments = comments.data.length !== 0;
    for (const comment of comments.data) {
      if (comment.body.startsWith(commentPrefix)) {
        matchingComments.push(comment);
      }
    }
  }
  return matchingComments;
}

export async function findMatchingComment(commenter, identifier) {
  const matchingComments = await findMatchingComments(commenter, identifier);
  let matchingComment;
  if (matchingComments && matchingComments.length > 0) {
    matchingComment = matchingComments[matchingComments.length - 1];
  }
  return matchingComment;
}
