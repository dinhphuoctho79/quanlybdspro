import fs from 'fs';

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}
fs.copyFileSync('index.html', 'dist/index.html');
console.log('Build completed: dist/index.html ready for Vercel.');
