import * as core from '@actions/core';
import * as github from '@actions/github';
import { normalMode, recreateMode, appendMode, deleteMode } from './modes';
import { getCommenter } from './comment/commenter';

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
    const message = core.getInput('message');

    const octokit = github.getOctokit(githubToken);

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
