export default class CommitCommenter {
  constructor(octokit, { owner, repo, commitSHA }) {
    this.octokit = octokit;
    this.owner = owner;
    this.repo = repo;
    this.commitSHA = commitSHA;
  }

  async createComment(comment) {
    await this.octokit.repos.createCommitComment({
      owner: this.owner,
      repo: this.repo,
      commit_sha: this.commitSHA,
      body: comment,
    });
  }

  async deleteComment(commentID) {
    await this.octokit.repos.deleteCommitComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentID,
    });
  }

  async listComments(opts) {
    await this.octokit.repos.listCommitComments({
      owner: this.owner,
      repo: this.repo,
      commit_sha: this.commitSHA,
      page: opts.page,
      per_page: opts.perPage,
    });
  }

  async updateComment(commentID, comment) {
    await this.octokit.repos.updateCommitComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentID,
      body: comment,
    });
  }
}
