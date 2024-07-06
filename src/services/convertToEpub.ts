import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs-extra";

const convertToEpub = async (seriesPath: string) => {
  const htmlDir = path.join(seriesPath, "html");
  const outputFile = `"${seriesPath.split("/").pop()}.epub"`;
  const coverImage = path.join(
    seriesPath,
    "chapters",
    "chapter-1",
    "page-0.jpeg"
  );
  const metadata = `--toc --toc-depth=2 --metadata title="${seriesPath
    .split("/")
    .pop()}" --epub-cover-image="${coverImage}"`;

  // Get a list of all HTML files in the directory
  const htmlFiles = fs
    .readdirSync(htmlDir)
    .filter((file) => file.startsWith("chapter-") && file.endsWith(".html"))
    .sort((a, b) => {
      const aNum = parseInt(a.split("-")[1].split(".")[0]);
      const bNum = parseInt(b.split("-")[1].split(".")[0]);
      return aNum - bNum;
    })
    .map((file) => `"${path.join(htmlDir, file).replace(/\\/g, "/")}"`)
    .join(" ");

  // Build the Pandoc command
  const pandocCommand = `pandoc ${htmlFiles} -o ${outputFile} ${metadata}`;

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
