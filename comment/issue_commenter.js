export default class IssueCommenter {
  constructor(octokit, { owner, repo, number }) {
    this.octokit = octokit;
    this.owner = owner;
    this.repo = repo;
    this.number = number;
  }

  createComment(comment) {
    return this.octokit.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.number,
      body: comment,
    });
  }

  deleteComment(commentID) {
    return this.octokit.issues.deleteComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentID,
    });
  }

  listComments(opts) {
    return this.octokit.issues.listComments({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.number,
      page: opts.page,
      per_page: opts.perPage,
    });
  }

  updateComment(commentID, comment) {
    return this.octokit.issues.updateComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentID,
      body: comment,
    });
  }
}
