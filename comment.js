import github from '@actions/github';

export async function findMatchingComment({ owner, repo, issue_number, identifier}) {
  let fetchMoreComments = true;
  let page = 0;
  let mathingComment;
  const commentPrefix = `<!-- ${identifier}: do not delete/edit this line -->`;
  while (fetchMoreComments) {
    page += 1;
    const comments = await github.issues.listComments({
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
