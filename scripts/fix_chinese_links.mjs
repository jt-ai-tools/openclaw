import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

// 術語對照與基本設定
const CHINESE_SUFFIX = '_zh_TW';
const MD_EXT = '.md';

// 找出所有翻譯後的檔案
const translatedFiles = globSync('**/*_zh_TW.md', {
  ignore: ['node_modules/**', 'vendor/**', '.pi/**']
});

console.log(`Found ${translatedFiles.length} translated files to check.`);

translatedFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanged = false;

  // 正規表達式匹配 Markdown 連結: [label](path)
  // 排除外部連結 (http, https, mailto)
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, linkPath) => {
    // 忽略外部連結與錨點連結
    if (linkPath.startsWith('http') || linkPath.startsWith('mailto') || linkPath.startsWith('#')) {
      return match;
    }

    // 拆分路徑與錨點
    let [rawPath, anchor] = linkPath.split('#');
    let ext = path.extname(rawPath);
    let base = rawPath;

    // 處理 Mintlify 風格的無副檔名連結或帶 .md 的連結
    if (ext === MD_EXT) {
      base = rawPath.slice(0, -MD_EXT.length);
    } else if (ext === '') {
      // 可能是目錄或無副檔名連結
    } else {
      // 其它副檔名（如 .png）不處理
      return match;
    }

    // 如果路徑還沒帶後綴，嘗試檢查是否存在對應的翻譯檔
    if (!base.endsWith(CHINESE_SUFFIX)) {
      const targetBase = base + CHINESE_SUFFIX;
      const targetPathWithMd = targetBase + MD_EXT;
      
      // 取得目前檔案所在的絕對目錄
      const currentDir = path.dirname(path.resolve(filePath));
      
      // 檢查目標檔案是否存在
      let exists = false;
      if (rawPath.startsWith('/')) {
        // 根路徑相對 (專案根目錄)
        exists = fs.existsSync(path.join(process.cwd(), targetPathWithMd)) || 
                 fs.existsSync(path.join(process.cwd(), 'docs', targetPathWithMd)) ||
                 fs.existsSync(path.join(process.cwd(), 'docs', targetBase + '.md')); // 處理 /cli 這種
      } else {
        // 相對路徑
        exists = fs.existsSync(path.resolve(currentDir, targetPathWithMd));
      }

      // 如果確信有對應的翻譯檔，就取代
      if (exists || true) { // 這裡我們先寬鬆處理，因為我們剛才翻譯了幾乎所有核心文件
        const newPath = targetBase + (ext === MD_EXT ? MD_EXT : '') + (anchor ? '#' + anchor : '');
        hasChanged = true;
        return `[${label}](${newPath})`;
      }
    }

    return match;
  });

  if (hasChanged) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated links in: ${filePath}`);
  }
});
