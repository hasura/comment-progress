import core from '@actions/core';
import { findMatchingComment } from './comment';

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

  console.log(`repository = ${repository}`);
  console.log(`repoOwner = ${repoOwner}, repoName = ${repoName}`);
  console.log(`id = ${id}`);
  console.log(`variables = ${variables}`);
} catch (error) {
  core.setFailed(error.message);
}

(async () => {
  try {
    const matchingComment = await findMatchingComment({
      owner: repoOwner,
      repo: repoName,
      issue_number: number,
      identifier,
    });

    console.log(`matchingComment = ${matchingComment}`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
