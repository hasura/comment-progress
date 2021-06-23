import {getCommentPrefix} from './identifier';

const issueCommenter = {
    createComment: async function(octokit, context, data) {
        data.issue_number = context;
        await octokit.issues.createComment(data);
    },
    deleteComment: async function(octokit, data) {
        data.issue_number = context;
        await octokit.issues.deleteComment(data);
    },
    updateComment: async function(octokit, data) {
        data.issue_number = context;
        await octokit.issues.updateComment(data);
    },
    listComments: async function(octokit, context, data) {
        data.issue_number = context;
        await octokit.issues.listComments(data);
    }
}

const commitCommenter = {
    createComment: async function(octokit, context, data) {
        data.commit_sha = context;
        await octokit.repos.createCommitComment(data);
    },
    deleteComment: async function(octokit, data) {
        data.commit_sha = context;
        await octokit.repos.deleteCommitComment(data);
    },
    updateComment: async function(octokit, data) {
        data.commit_sha = context;
        await octokit.repos.updateCommitComment(data);
    },
    listComments: async function(octokit, context, data) {
        data.commit_sha = context;
        await octokit.repos.listCommitComments(data);
    }
}

export async getCommentMethod(number, commitSHA) {
    if ((number && commitSHA) || (!number && !commitSHA)) {
        throw "Invalid"
    }
    if(!number) {
        return commitCommenter;
    } else {
        return issueCommenter;
    }
}

export async function findMatchingComment(octokit, identifier, commenter, context, data) {
  const matchingComments = await findMatchingComments(octokit, identifier, commenter, context, data);
  let matchingComment;
  if (matchingComments && matchingComments.length > 0) {
    matchingComment = matchingComments[matchingComments.length-1];
  }
  return matchingComment;
}

export async function findMatchingComments(octokit, identifier, commenter, context, data) {
  let fetchMoreComments = true;
  let page = 0;
  let matchingComments = [];
  const commentPrefix = getCommentPrefix(identifier);

  data.per_page = 100;

  while (fetchMoreComments) {
    page += 1;
    const comments = await commenter.listComments(octokit, context, data);
    fetchMoreComments = comments.data.length !== 0;
    for (let comment of comments.data) {
      if (comment.body.startsWith(commentPrefix)) {
        matchingComments.push(comment);
      }
    }
  }
  return matchingComments;
}
