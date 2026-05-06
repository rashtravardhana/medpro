const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = process.cwd();

// 🔍 Scan folders
function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    if (
      file === "node_modules" ||
      file === ".git" ||
      file === ".next"
    ) return;

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath.replace(PROJECT_ROOT, ""));
    }
  });

  return fileList;
}

// 📄 Generate context
function generateContext() {
  const files = getFiles(PROJECT_ROOT);

  let content = `# 🧠 Auto AI Context (Generated)

## 📅 Last Updated
${new Date().toISOString()}

## 📁 Project Files
`;

  files.forEach((file) => {
    content += `- ${file}\n`;
  });

  content += `

## 🧠 Notes
- Auto-generated file
- Do NOT edit manually
- Used for AI understanding

`;

  fs.writeFileSync("ai-context.md", content);
  console.log("✅ AI Context updated!");
}

generateContext();
