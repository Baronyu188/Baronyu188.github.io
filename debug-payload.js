// 调试payload的JSON序列化
import fs from 'fs';

async function debugPayload() {
  try {
    // 模拟heroContent
    const heroContent = {
      title: "校园计算机协会",
      description: "探索人工智能，连接技术爱好者，共建创新未来",
      metrics: [
        { label: "活跃成员", value: "200+" },
        { label: "技术活动", value: "50+" },
        { label: "合作项目", value: "15+" }
      ],
      primaryAction: { href: "/about", label: "了解更多" },
      secondaryAction: { href: "/contact", label: "联系我们" }
    };
    
    // 构建与Hero.astro中相同的payload
    const commands = [
      { name: 'help', description: '显示可用命令' },
      { name: 'history', description: '显示命令历史' },
      { name: 'date', description: '显示当前时间' },
      { name: 'ls', description: '列出目录内容' },
      { name: 'cat', description: '查看文件内容' },
      { name: 'tree', description: '显示目录树' },
      { name: 'refresh', description: '刷新页面' },
      { name: 'clear', description: '清空终端' },
      { name: 'banner', description: '显示横幅' },
      { name: 'whoami', description: '显示当前用户' },
      { name: 'about', description: '关于我们' },
      { name: 'contact', description: '联系方式' },
      { name: 'github', description: 'GitHub链接' }
    ];
    
    const asciiArt = [
      "███████╗███████╗████████╗██████╗  ██████╗ ██╗     ██╗  ██╗██╗████████╗",
      "██╔════╝██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║  ██║██║╚══██╔══╝",
      "█████╗  ███████╗   ██║   ██████╔╝██║   ██║██║     ███████║██║   ██║   ",
      "██╔══╝  ╚════██║   ██║   ██╔═══╝ ██║   ██║██║     ██╔══██║██║   ██║   ",
      "██║     ███████║   ██║   ██║     ╚██████╔╝███████╗██║  ██║██║   ██║   ",
      "╚═╝     ╚══════╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   "
    ];
    
    // 简化的文件系统结构
    const fsTree = {
      name: '/',
      type: 'dir',
      children: [
        { name: 'about.md', type: 'file', content: '# 关于我们\\n\\n我们是一个专注于人工智能和计算机技术的学生组织。' },
        { name: 'contact.md', type: 'file', content: '# 联系方式\\n\\n邮箱：contact@example.com' },
        { name: 'blog', type: 'dir', children: [
          { name: 'hello-world.md', type: 'file', content: '# Hello World\\n\\n欢迎来到我们的博客！' }
        ]}
      ]
    };
    
    const payload = {
      title: heroContent.title,
      description: heroContent.description,
      metrics: heroContent.metrics,
      commands,
      asciiArt,
      fs: fsTree
    };
    
    console.log('=== PAYLOAD DEBUG ===');
    console.log('Title:', heroContent.title);
    console.log('Description:', heroContent.description);
    console.log('Metrics:', JSON.stringify(heroContent.metrics, null, 2));
    
    // 尝试序列化
    let jsonString;
    try {
      jsonString = JSON.stringify(payload, null, 2);
      console.log('JSON serialization successful');
      console.log('JSON length:', jsonString.length);
      console.log('First 500 chars:');
      console.log(jsonString.substring(0, 500));
    } catch (e) {
      console.error('JSON serialization failed:', e.message);
      return;
    }
    
    // 应用转义
    const escapedJson = jsonString
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');
    
    console.log('\\n=== AFTER ESCAPING ===');
    console.log('Escaped JSON length:', escapedJson.length);
    console.log('First 500 chars of escaped:');
    console.log(escapedJson.substring(0, 500));
    
    // 测试解析
    try {
      const parsed = JSON.parse(escapedJson);
      console.log('\\nEscaped JSON parsing: SUCCESS');
    } catch (e) {
      console.error('\\nEscaped JSON parsing FAILED:', e.message);
      
      // 找到错误位置
      const errorPos = parseInt(e.message.match(/position (\\d+)/)?.[1] || '0');
      console.log('Error around position', errorPos, ':');
      const start = Math.max(0, errorPos - 50);
      const end = Math.min(escapedJson.length, errorPos + 50);
      console.log('Context:', escapedJson.substring(start, end));
    }
    
    // 保存原始和转义的版本进行对比
    fs.writeFileSync('/tmp/original-payload.json', jsonString);
    fs.writeFileSync('/tmp/escaped-payload.json', escapedJson);
    console.log('\\nPayload files saved to /tmp/ for inspection');
    
  } catch (error) {
    console.error('Debug failed:', error.message);
  }
}

debugPayload();