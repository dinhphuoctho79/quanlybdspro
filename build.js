import fs from 'fs';

// Tạo cả thư mục public và dist để tương thích 100% với mọi cài đặt Vercel
['public', 'dist'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync('index.html', `${dir}/index.html`);
  console.log(`Copied index.html -> ${dir}/index.html`);
});

console.log('Build completed: Both public/ and dist/ directories ready for Vercel.');
