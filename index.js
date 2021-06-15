import * as core from '@actions/core';
import * as github from '@actions/github';
import { normalMode, recreateMode, appendMode } from './modes';

(async () => {
  try {
    const repository = core.getInput('repository');
    const [owner, repo] = repository.split('/');
    if (!owner || !repo) {
      throw new Error(`Invalid repository: ${repository}`);
    }

    const number = core.getInput('number');
    const identifier = core.getInput('id');
    const append = core.getInput('append');
    const recreate = core.getInput('recreate');
    const fail = core.getInput('fail');
    const githubToken = core.getInput('github-token');
    const message = core.getInput('message');

    let mode = normalMode;

    if (append === 'true' && recreate === 'true') {
      core.setFailed('Not allowed to set both `append` and `recreate` to true.');
      return;
    } else if (recreate === 'true') {
      mode = recreateMode;
    } else if (append === 'true') {
      mode = appendMode;
    }

    const octokit = github.getOctokit(githubToken);

    await mode({octokit, owner, repo, number, identifier, message});

    if (fail === 'true') {
      core.setFailed(message);
    }
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
})();
