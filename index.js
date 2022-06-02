const core = require('@actions/core');
const github = require('@actions/github');

const {
  context,
  getOctokit
} = require('@actions/github');

console.log("Hello");

const run = async() => {
  const token = core.getInput('token', {required: true});
  const octokit = getOctokit(token);

	console.log(`Debugging

	${JSON.stringify(context.payload.repository, null , 4)}`);

  const repo = context.payload.repository.name;
  const owner = context.payload.repository.full_name.split('/')[0];
  const pullNumber = context.payload.pull_request.number;

  try {
    await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      owner,
      repo,
      pull_number,
      body: "Hello"
    });
  } catch(e) {

    core.setFailed(e.message);
  }
}

run();
