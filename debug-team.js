// 调试团队图片路径问题
import { teamAssetModules } from './src/data/content.ts';

console.log('Team asset modules:');
console.log('Type:', typeof teamAssetModules);
console.log('Keys:', Object.keys(teamAssetModules));

Object.entries(teamAssetModules).forEach(([key, value]) => {
  console.log(`\nKey: ${key}`);
  console.log(`Value type: ${typeof value}`);
  console.log(`Value:`, value);
  if (typeof value === 'object' && value !== null) {
    console.log(`Object keys:`, Object.keys(value));
  }
});