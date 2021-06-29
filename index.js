import * as core from '@actions/core';
import * as github from '@actions/github';
import { normalMode, recreateMode, appendMode } from './modes';
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
    const append = core.getInput('append');
    const recreate = core.getInput('recreate');
    const fail = core.getInput('fail');
    const githubToken = core.getInput('github-token');
    const message = core.getInput('message');

    const octokit = github.getOctokit(githubToken);

    let commenter;
    try {
      commenter = getCommenter(octokit, {
        owner, repo, number, commitSHA,
      });
    } catch (err) {
      core.setFailed(err);
      return;
    }

    let mode = normalMode;

    if (append === 'true' && recreate === 'true') {
      core.setFailed('Not allowed to set both `append` and `recreate` to true.');
      return;
    }

    if (recreate === 'true') {
      mode = recreateMode;
    } else if (append === 'true') {
      mode = appendMode;
    }

    console.log('commenter', commenter);

    await mode(commenter, identifier, message);

    if (fail === 'true') {
      core.setFailed(message);
    }
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
})();
