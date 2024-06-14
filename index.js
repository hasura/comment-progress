import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  normalMode, recreateMode, appendMode, deleteMode, replaceMode,
} from './modes';
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
    const fail = core.getInput('fail');
    const githubToken = core.getInput('github-token');
    const message = core.getInput('message');

    const appendComment = core.getInput('append');
    const replaceComment = core.getInput('replace');
    const recreateComment = core.getInput('recreate');
    const deleteComment = core.getInput('delete');

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

    const effectiveModes = [
      { name: 'recreate', flag: recreateComment },
      { name: 'append', flag: appendComment },
      { name: 'replace', flag: replaceComment },
      { name: 'delete', flag: deleteComment },
    ].filter((m) => m.flag === 'true');

    if (effectiveModes.length > 1) {
      const effectiveModeNames = effectiveModes.map((m) => m.name).join(', ');
      core.setFailed(`Only one of ${effectiveModeNames} can be set to true.`);
      return;
    }

    let mode;

    switch (effectiveModes[0].name) {
      case 'recreate':
        mode = recreateMode;
        break;
      case 'append':
        mode = appendMode;
        break;
      case 'replace':
        mode = replaceMode;
        break;
      case 'delete':
        mode = deleteMode;
        break;
      default:
        mode = normalMode;
        break;
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
