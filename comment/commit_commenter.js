export default class CommitCommenter {
  constructor(octokit, { owner, repo, commitSHA }) {
    this.octokit = octokit;
    this.owner = owner;
    this.repo = repo;
    this.commitSHA = commitSHA;
  }

  createComment(comment) {
    return this.octokit.repos.createCommitComment({
      owner: this.owner,
      repo: this.repo,
      commit_sha: this.commitSHA,
      body: comment,
    });
  }

  deleteComment(commentID) {
    return this.octokit.repos.deleteCommitComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentID,
    });
  }

  listComments(opts) {
    return this.octokit.repos.listCommentsForCommit({
      owner: this.owner,
      repo: this.repo,
      commit_sha: this.commitSHA,
      page: opts.page,
      per_page: opts.perPage,
    });
  }

  updateComment(commentID, comment) {
    return this.octokit.repos.updateCommitComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentID,
      body: comment,
    });
  }
}
