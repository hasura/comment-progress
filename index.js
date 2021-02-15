import * as core from '@actions/core';
import * as github from '@actions/github';
import { findMatchingComment } from './comment';

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
    const variables = core.getInput('variables');
    const githubToken = core.getInput('github-token');
    let message = core.getInput('message');

    const octokit = github.getOctokit(githubToken);

    console.log(`Checking if a comment already exists for ${identifier}.`);
    const matchingComment = await findMatchingComment({
      octokit,
      owner: repoOwner,
      repo: repoName,
      issue_number: number,
      identifier,
    });

    if (append === 'true' && matchingComment) {
      message = `${matchingComment.body}\n${message}`
    }

    if (matchingComment) {
      console.log(`Found a comment for ${identifier} and updating it.`);
      await octokit.issues.updateComment({
        owner: repoOwner,
        repo: repoName,
        comment_id: matchingComment.id,
        body: message,
      });
      return;
    }

    console.log(`Creating a new comment for ${identifier}`);
    await octokit.issues.createComment({
      owner: repoOwner,
      repo: repoName,
      issue_number: number,
      body: message,
    });
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
})();
