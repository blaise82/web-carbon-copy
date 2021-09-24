import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";
const scrape = require('website-scraper'); 

const access = promisify(fs.access);
const copy = promisify(ncp);


export const reprintWeb = async (options)=>{
  await scrape({
    urls: [options.url],
    urlFilter: function (url) {
      return url.indexOf(options.url) === 0;
    },
    recursive: true,
    maxDepth: 50,
    prettifyUrls: true,
    filenameGenerator: "bySiteStructure",
    directory: `./${options.template}`,
  })
    .then((data) => {
      console.log("Entire website successfully downloaded");
    })
    .catch((err) => {
      return Promise.reject(new Error("An error ocurred", err));
    })
    return
}
export async function createProject(options) {
  const tasks = new Listr([
    {
      title: "Copying project files",
      task: () => reprintWeb(options),
    },
  ]);

  await tasks.run();

  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}
