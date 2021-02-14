const core = require('@actions/core');
const github = require('@actions/github');

try {
  const repository = core.getInput('repository');
  const number = core.getInput('number');
  const id = core.getInput('id');
  const message = core.getInput('message');
  const append = core.getInput('append');
  const variables = core.getInput('variables');

  console.log(`repository = ${repository}`);
  console.log(`variables = ${variables}`);

} catch (error) {
  core.setFailed(error.message);
}
