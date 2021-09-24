import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
import chalk from "chalk";
import fs from "fs";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--yes": Boolean,
      "--javascript": Boolean,
      "--typescript": Boolean,
      "-js": "--javascript",
      "-tx": "--typescript",
      "-y": "--yes",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    template: args._[0],
    url: args._[1],
  };
}

function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
    return 'Invalid url provided';
    else
        return true;
}

async function promptForMissingOptions(options) {
  const defaultType = "JavaScript";
  const defaultTemplate = `${new Date().getTime()}-project`;
  if (options.skipPrompts) {
    return {
      ...options,
      url: options.url,
      template: options.template || defaultTemplate,
    };
  }
  const questions = [];
  if (!options.template) {
    questions.push({
      type: "input",
      name: "template",
      message: "Invalid project/template name, Please provide a project/template name: ",
      // choices: ["JavaScript", "TypeScript"],
      default: defaultTemplate,
    });
  }
  if(fs.existsSync(`./${options.template}`)){
    questions.push({
      type: "input",
      name: "template",
      message: "Invalid project/template name, Please provide a project/template name: ",
      // choices: ["JavaScript", "TypeScript"],
      default: defaultTemplate,
    });
  }

  if (!options.url) {
    questions.push({
      type: "input",
      name: "url",
      message: "Please provide a valid url: ",
      // choices: ["JavaScript", "TypeScript"],
      // default: defaultType,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: answers.template || options.template || defaultTemplate ,
    url: options.url || answers.url,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
