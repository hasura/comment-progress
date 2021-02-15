import * as core from '@actions/core';
import * as github from '@actions/github';
import { findMatchingComment } from './comment';
import { getCommentPrefix } from './identifier';

(async () => {
  try {
    const repository = core.getInput('repository');
    const [repoOwner, repoName] = repository.split('/');
    if (!repoOwner || !repoName) {
      throw new Error(`Invalid repository: ${repository}`);
    }

    const number = core.getInput('number');
    const identifier = core.getInput('id');
    const append = core.getInput('append');
    const fail = core.getInput('fail');
    const githubToken = core.getInput('github-token');
    const message = core.getInput('message');

    const octokit = github.getOctokit(githubToken);

    console.log(`Checking if a comment already exists for ${identifier}.`);
    const matchingComment = await findMatchingComment({
      octokit,
      owner: repoOwner,
      repo: repoName,
      issue_number: number,
      identifier,
    });

    let comment = `${getCommentPrefix(identifier)}`;

    if (append === 'true' && matchingComment) {
      comment = `${matchingComment.body}`;
    }

    comment = `${comment}\n${message}`;

    if (matchingComment) {
      console.log(`Updating an existing comment for ${identifier}.`);
      await octokit.issues.updateComment({
        owner: repoOwner,
        repo: repoName,
        comment_id: matchingComment.id,
        body: comment,
      });

      if (fail === 'true') {
        core.setFailed(message);
      }
      return;
    }

    console.log(`Creating a new comment for ${identifier}.`);
    await octokit.issues.createComment({
      owner: repoOwner,
      repo: repoName,
      issue_number: number,
      body: comment,
    });

    if (fail === 'true') {
      core.setFailed(message);
    }
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
})();
