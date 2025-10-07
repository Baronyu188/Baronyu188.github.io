// 测试终端功能
const puppeteer = require('puppeteer');

async function testTerminal() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:4323/');
    await page.waitForSelector('[data-terminal-input]');
    
    // 测试neofetch命令
    await page.type('[data-terminal-input]', 'neofetch');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(1000);
    
    // 测试help命令多次执行看滚动效果
    for (let i = 0; i < 5; i++) {
      await page.type('[data-terminal-input]', 'help');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
    }
    
    console.log('终端测试完成！');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testTerminal();