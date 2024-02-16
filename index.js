import * as core from '@actions/core';
import * as github from '@actions/github';
import { existsSync, readFileSync } from 'fs';
import { getCommenter } from './comment/commenter';
import { appendMode, deleteMode, normalMode, recreateMode } from './modes';

(async () => {
  try {
    const repository = core.getInput('repository');
    const [owner, repo] = repository.split('/');
    if (!owner || !repo) {
      throw new Error(`Invalid repository: ${repository}`);
    }

    const number = core.getInput('number');
    const commitSHA = core.getInput('commit-sha');
    const identifier = core.getInput('id');
    const appendComment = core.getInput('append');
    const recreateComment = core.getInput('recreate');
    const deleteComment = core.getInput('delete');
    const fail = core.getInput('fail');
    const githubToken = core.getInput('github-token');
    let message = core.getInput('message');
    const messagePath = core.getInput('message-path');

    const octokit = github.getOctokit(githubToken);

    if (messagePath && message) {
      core.setFailed("Only one of 'message' or 'message-path' can be set.");
      return;
    } else if (messagePath && !existsSync(messagePath)) {
      core.setFailed(`Input message-path: '${messagePath}' does not exist.`);
      return;
    } else if (messagePath) {
      console.log(`Read from message-path: ${messagePath} `);
      message = readFileSync(messagePath, 'utf-8');
    }

    let commenter;
    try {
      commenter = getCommenter(octokit, {
        owner,
        repo,
        number,
        commitSHA,
      });
    } catch (err) {
      core.setFailed(err);
      return;
    }

    let mode = normalMode;

    if (appendComment === 'true' && recreateComment === 'true') {
      core.setFailed('Not allowed to set both `append` and `recreate` to true.');
      return;
    }

    if (deleteComment === 'true' && (appendComment === 'true' || recreateComment === 'true')) {
      core.setFailed('Not allowed to set `delete` to true with `append` or `recreate`.');
      return;
    }

    if (recreateComment === 'true') {
      mode = recreateMode;
    } else if (appendComment === 'true') {
      mode = appendMode;
    } else if (deleteComment === 'true') {
      mode = deleteMode;
    }

    await mode(commenter, identifier, message);

    if (fail === 'true') {
      core.setFailed(message);
    }
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
})();
