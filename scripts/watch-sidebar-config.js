/**
 * 监听文件变化，自动重新生成侧边栏配置文件
 * 用于开发环境，当修改 _sidebar_scope.json 或 Markdown 文件的 Front Matter 时自动更新配置
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const docsDir = path.join(__dirname, '../docs');
const docsSDir = path.join(__dirname, '../docs_s');
const configFilePath = path.join(__dirname, '../src/context/generated-sidebar-config.json');

let isGenerating = false;
let lastGenerateTime = 0;

/**
 * 重新生成配置文件
 */
function regenerateConfig() {
  // 防抖：如果距离上次生成不到 1 秒，则跳过
  const now = Date.now();
  if (now - lastGenerateTime < 1000) {
    return;
  }
  
  // 如果正在生成，则跳过
  if (isGenerating) {
    return;
  }
  
  isGenerating = true;
  lastGenerateTime = now;
  
  console.log('\n🔄 检测到文件变化，重新生成配置文件...\n');
  
  // 运行生成脚本
  const generate = spawn('node', [path.join(__dirname, 'generate-sidebar-config.js')], {
    stdio: 'inherit',
    shell: true
  });
  
  generate.on('close', (code) => {
    isGenerating = false;
    if (code === 0) {
      console.log('\n✅ 配置文件已更新\n');
    } else {
      console.log('\n❌ 配置文件生成失败\n');
    }
  });
}

/**
 * 监听目录变化
 */
function watchDirectory(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  
  fs.watch(dir, { recursive: true }, (eventType, filename) => {
    if (!filename) {
      return;
    }
    
    // 只监听特定文件
    if (filename.endsWith('_sidebar_scope.json') || 
        (filename.endsWith('.md') && !filename.includes('node_modules'))) {
      console.log(`📝 文件变化: ${filename}`);
      regenerateConfig();
    }
  });
  
  console.log(`👀 监听目录: ${dir}`);
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 启动配置文件监听器...\n');
  
  // 监听 docs 目录
  watchDirectory(docsDir);
  
  // 监听 docs_s 目录
  if (fs.existsSync(docsSDir)) {
    watchDirectory(docsSDir);
  }
  
  console.log('\n✅ 监听器已启动，修改 _sidebar_scope.json 或 Markdown 文件的 Front Matter 将自动更新配置文件\n');
  console.log('💡 提示：按 Ctrl+C 停止监听\n');
}

main();
