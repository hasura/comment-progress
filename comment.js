import {getCommentPrefix} from './identifier';

export async function findMatchingComment({ octokit, owner, repo, issue_number, identifier}) {
  let fetchMoreComments = true;
  let page = 0;
  let mathingComment;
  const commentPrefix = getCommentPrefix(identifier);
  while (fetchMoreComments) {
    page += 1;
    const comments = await octokit.issues.listComments({
      owner,
      repo,
      issue_number,
      per_page: 100,
      page,
    });
    fetchMoreComments = comments.data.length !== 0;
    for (let comment of comments.data) {
      if (comment.body.startsWith(commentPrefix)) {
        mathingComment = comment;
      }
    }
  }
  return mathingComment;
}
