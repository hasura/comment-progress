export default class IssueCommenter {
  constructor(octokit, { owner, repo, number }) {
    this.octokit = octokit;
    this.owner = owner;
    this.repo = repo;
    this.number = number;
  }

  async createComment(comment) {
    await this.octokit.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.number,
      body: comment,
    });
  }

  async deleteComment(commentID) {
    await this.octokit.issues.deleteComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentID,
    });
  }

  async listComments(opts) {
    await this.octokit.issues.listComments({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.number,
      page: opts.page,
      per_page: opts.perPage,
    });
  }

  async updateComment(commentID, comment) {
    await this.octokit.issues.updateComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentID,
      body: comment,
    });
  }
}
