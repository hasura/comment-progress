import {getCommentPrefix} from './identifier';

class issueCommenter {
  constructor(octokit, {owner, repo, number}) {
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
    await this.octokit.issues.deleteComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentID,
      body: comment,
    });
  }
}

class commitCommenter {
  constructor(octokit, {owner, repo, commitSHA}) {
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
    await this.octokit.repos.deleteCommitComment({
      owner: this.owner,
      repo: this.repo,
      comment_id: commentID,
      body: comment,
    });
  }
}  

export async function getCommenter(octokit, {owner, repo, number, commitSHA}) {
  if ((number && commitSHA) || (!number && !commitSHA)) {
    throw 'Either set the `number` or the `commit-sha` field.'
  }
  if(number) {
    return new issueCommenter(octokit, {owner, repo, number});
  } else {
    return new commitCommenter(octokit, {owner, repo, commitSHA});
  }
}

export async function findMatchingComment(commenter, identifier) {
  const matchingComments = await findMatchingComments(commenter, identifier);
  let matchingComment;
  if (matchingComments && matchingComments.length > 0) {
    matchingComment = matchingComments[matchingComments.length-1];
  }
  return matchingComment;
}

export async function findMatchingComments(commenter, identifier) {
  let fetchMoreComments = true;
  let page = 0;
  let matchingComments = [];
  const commentPrefix = getCommentPrefix(identifier);

  while (fetchMoreComments) {
    page += 1;
    const comments = await commenter.listComments({
      page,
      perPage: 100
    });
    fetchMoreComments = comments.data.length !== 0;
    for (let comment of comments.data) {
      if (comment.body.startsWith(commentPrefix)) {
        matchingComments.push(comment);
      }
    }
  }
  return matchingComments;
}
