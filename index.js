const core = require('@actions/core');
const github = require('@actions/github');

const {
  context,
  getOctokit
} = require('@actions/github');

const JIRA_REGEX = /[A-Z0-9]+-\d+/;
const BODY_JIRA_REGEX = /[A-Z0-9]+-\d+/g;

const run = async() => {
  try {
    const token = core.getInput('token', {required: true});
    const octokit = getOctokit(token);

    const repo = context.payload.repository.name;
    const owner = context.payload.repository.full_name.split('/')[0];
    const pullNumber = context.payload.pull_request.number;


    const title = context.payload.pull_request.title;
    const body = context.payload.pull_request.body;
    let titleContainsJiraId = (title).match(JIRA_REGEX) !== null;
    let body_regex = (body).match(BODY_JIRA_REGEX);
    let bodyContainsJiraId = body_regex !== null;
    console.log("Title is: ", title)
    console.log("Title Contain Jira ID? ", titleContainsJiraId);
    console.log("Body Contain Jira ID? ", bodyContainsJiraId);

    var message = ""
    
    // Damn continuity
    var issue_number = pullNumber;
    var pull_number = pullNumber;

    if(titleContainsJiraId) {
      console.log("Good to go! No action");
    }

    if(!titleContainsJiraId && !bodyContainsJiraId) {
      console.log("No JIRA ID found in PR title or body. Please add");
    }

    if(!titleContainsJiraId && bodyContainsJiraId) {
      console.log("Body contains", body_regex);
      var jiraID = body_regex[0];
      await octokit.rest.pulls.update({
        owner,
        repo,
        pull_number,
        title: jiraID + " " + title
      });
      await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
        owner,
        repo,
        issue_number,
        body: "Updating title with Jira ID from PR description"
      });
    }
  } catch(e) {
    core.setFailed(e.message);
  }
}

run();
