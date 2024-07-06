import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs-extra";

const convertToEpub = async (seriesPath: string) => {
  const htmlDir = path.join(seriesPath, "html");
  const outputFile = `"${seriesPath.split("/").pop()}.epub"`;
  
  const metadata = `--toc --toc-depth=2 --metadata title="${seriesPath
    .split("/")
    .pop()}"`;

  // Get a list of all HTML files in the directory
  
  const pandocCommand = `pandoc "${path.join(seriesPath,'html', "index.html")}" -o ${outputFile} ${metadata}`;

  // Execute the Pandoc command
  exec(pandocCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log("Ebook created successfully");
  });
};
// Define the directory containing the HTML files

export default convertToEpub;
