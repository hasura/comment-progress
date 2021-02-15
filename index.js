import * as core from '@actions/core';
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
    const message = core.getInput('message');
    const append = core.getInput('append');
    const variables = core.getInput('variables');
    const githubToken = core.getInput('github-token');

    console.log(`repository = ${repository}`);
    console.log(`repoOwner = ${repoOwner}, repoName = ${repoName}`);
    console.log(`id = ${identifier}`);
    console.log(`variables = ${variables}`);

    const matchingComment = await findMatchingComment({
      token: githubToken,
      owner: repoOwner,
      repo: repoName,
      issue_number: number,
      identifier,
    });

    console.log(`matchingComment = ${matchingComment}`);
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
})();
