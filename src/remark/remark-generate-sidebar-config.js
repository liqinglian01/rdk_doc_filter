/**
 * 从 Markdown 文件的 Front Matter 中提取侧边栏显示配置
 * 并生成静态的配置文件
 *
 * 支持的 Front Matter 字段：
 * - sidebar_versions: 该文档在哪些版本下显示（逗号分隔）
 * - sidebar_products: 该文档在哪些产品下显示（逗号分隔）
 * - sidebar_only: 该文档仅在特定版本/产品下显示（优先级最高）
 *
 * 示例：
 * ---
 * sidebar_versions: 3.0.0,3.5.0
 * sidebar_products: RDK X3,RDK X5
 * ---
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configFilePath = path.join(__dirname, '../context/generated-sidebar-config.json');

// 确保目录存在
const configDir = path.dirname(configFilePath);
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// 初始化配置
let generatedConfig = {};
try {
  if (fs.existsSync(configFilePath)) {
    const existing = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    generatedConfig = existing;
  }
} catch (e) {
  generatedConfig = {};
}

function parseScopeList(value) {
  if (value == null) return [];
  const s = String(value).trim();
  if (s === '' || s === '*') return [];
  return s
    .split(/[,，]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * 保存配置到文件
 */
function saveConfig() {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(generatedConfig, null, 2), 'utf-8');
  } catch (e) {
    console.error('保存侧边栏配置失败:', e);
  }
}

/** @returns {import('unified').Plugin} */
export default function remarkGenerateSidebarConfig() {
  return (tree, file) => {
    // 获取 Front Matter
    const frontmatter = file.data?.frontMatter || {};
    
    // 只处理有侧边栏配置的文档
    if (!frontmatter.sidebar_versions && !frontmatter.sidebar_products) {
      return;
    }

    // 获取文档 ID
    let docId = '';
    if (file.path) {
      const path = file.path;
      // 尝试从路径中提取文档 ID
      const match = path.match(/docs[/\\](.*?)\.md$/);
      if (match) {
        docId = match[1].replace(/[/\\]/g, '/');
      } else {
        // 也可能在 docs_s 目录中
        const match2 = path.match(/docs_s[/\\](.*?)\.md$/);
        if (match2) {
          docId = match2[1].replace(/[/\\]/g, '/');
        }
      }
    }

    if (!docId) {
      return;
    }

    // 解析侧边栏控制字段
    const sidebarData = {
      versions: parseScopeList(frontmatter.sidebar_versions),
      products: parseScopeList(frontmatter.sidebar_products),
    };

    // 存储到配置中
    generatedConfig[docId] = sidebarData;
    
    // 保存配置
    saveConfig();
  };
}

// 导出配置文件路径供其他模块使用
export { configFilePath };
