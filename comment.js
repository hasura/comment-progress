import {getCommentPrefix} from './identifier';

async function listComments(data, context, isCommitComment) {
  if (!isCommitComment) {
    data.issue_number = context;
    await octokit.issues.listComments(data);
  } else {
    data.commit_sha = context;
    await octokit.repos.listCommitComments(data);
  }
}

export async function findMatchingComment({octokit, owner, repo, context, isCommitComment, identifier}) {
  const matchingComments = await findMatchingComments({octokit, owner, repo, context, isCommitComment, identifier});
  let matchingComment;
  if (matchingComments && matchingComments.length > 0) {
    matchingComment = matchingComments[matchingComments.length-1];
  }
  return matchingComment;
}

export async function findMatchingComments({octokit, owner, repo, context, isCommitComment, identifier}) {
  let fetchMoreComments = true;
  let page = 0;
  let matchingComments = [];
  const commentPrefix = getCommentPrefix(identifier);
  while (fetchMoreComments) {
    page += 1;
    const comments = await listComments({
      owner,
      repo,
      per_page: 100,
      page,
    }, context, isCommitComment);
    fetchMoreComments = comments.data.length !== 0;
    for (let comment of comments.data) {
      if (comment.body.startsWith(commentPrefix)) {
        matchingComments.push(comment);
      }
    }
  }
  return matchingComments;
}
