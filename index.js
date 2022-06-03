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

  // Test
  const repo = context.payload.repository.name;
  const owner = context.payload.repository.full_name.split('/')[0];
  const pullNumber = context.payload.pull_request.number;
  console.log([repo, owner])

  console.log("title");
  const title = context.payload.pull_request.title;
  console.log(title);
  console.log("Contain Jira ID?", (title).match(/[A-Z0-9]+-\d+/));

  var issue_number = pullNumber;
  try {
    await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      owner,
      repo,
      issue_number,
      body: "Hello"
    });
  } catch(e) {

    core.setFailed(e.message);
  }
}

run();
