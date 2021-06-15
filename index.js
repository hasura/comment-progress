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

    const modes = Object.freeze({
        NORMAL:     'normal',
        APPEND:     'append',
        RECREATE:   'recreate'
    });

    const number = core.getInput('number');
    const identifier = core.getInput('id');
    const append = core.getInput(modes.APPEND);
    const recreate = core.getInput(modes.RECREATE);
    const fail = core.getInput('fail');
    const githubToken = core.getInput('github-token');
    const message = core.getInput('message');

    let mode = modes.NORMAL;

    if (append === 'true' && recreate === 'true') {
      core.setFailed('Not allowed to set both `append` and `recreate` to true.');
      return;
    } else if (recreate === 'true') {
      mode = modes.RECREATE;
    } else if (append === 'true') {
      mode = modes.APPEND;
    }

    const octokit = github.getOctokit(githubToken);

    switch (mode) {
      case modes.NORMAL:
        await normalMode({octokit, owner, repo, number, identifier, message});
        break;
      case modes.RECREATE:
        await recreateMode({octokit, owner, repo, number, identifier, message});
        break;
      case modes.APPEND:
        await appendMode({octokit, owner, repo, number, identifier, message});
    }

    if (fail === 'true') {
      core.setFailed(message);
    }
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
})();
