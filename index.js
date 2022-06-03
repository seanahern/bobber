const core = require('@actions/core');
const github = require('@actions/github');

const {
  context,
  getOctokit
} = require('@actions/github');

const JIRA_REGEX = /[A-Z0-9]+-\d+/;
const BODY_JIRA_REGEX = /[A-Z0-9]+-\d+/g;

console.log("Hello");

const run = async() => {
  const token = core.getInput('token', {required: true});
  const octokit = getOctokit(token);

  // Test
  const repo = context.payload.repository.name;
  const owner = context.payload.repository.full_name.split('/')[0];
  const pullNumber = context.payload.pull_request.number;


  const title = context.payload.pull_request.title;
  const body = context.payload.pull_request.body;
  let titleContainsJiraId = (title).match(JIRA_REGEX) !== null;
  let bodyContainsJiraId = (body).match(BODY_JIRA_REGEX) !== null;
  console.log("Title is: ", title)
  console.log("Title Contain Jira ID? ", titleContainsJiraId);
  console.log("Body Contain Jira ID? ", bodyContainsJiraId);

  var message = ""
  
  var issue_number = pullNumber;
  var pull_number = pullNumber;

  octokit.rest.pulls.update({
    owner,
    repo,
    pull_number,
    title: "FY22-1290 " + title
  });
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
