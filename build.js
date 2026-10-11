import fs from 'fs';

const indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Đồng bộ cho Vercel & Web hosting (public/ và dist/)
['public', 'dist'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(`${dir}/index.html`, indexHtml, 'utf8');
  console.log(`✅ Đồng bộ index.html -> ${dir}/index.html`);
});

// 2. Đồng bộ cho file xem trước offline
fs.writeFileSync('xem_truoc_bds_pro.html', indexHtml, 'utf8');
console.log('✅ Đồng bộ index.html -> xem_truoc_bds_pro.html');

// 3. Đồng bộ cho Google Apps Script nguồn
if (fs.existsSync('google-apps-script-source')) {
  fs.writeFileSync('google-apps-script-source/Index.html', indexHtml, 'utf8');
  console.log('✅ Đồng bộ index.html -> google-apps-script-source/Index.html');

  // Trích xuất mã JavaScript chính để đồng bộ vào JavaScript.html
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let allScripts = '';
  let match;
  while ((match = scriptRegex.exec(indexHtml)) !== null) {
    // Bỏ qua các script src bên ngoài nếu có
    if (match[1] && match[1].trim().length > 100) {
      allScripts += match[1].trim() + '\n\n';
    }
  }

  if (allScripts.length > 0) {
    fs.writeFileSync('google-apps-script-source/JavaScript.html', `<script>\n${allScripts}</script>\n`, 'utf8');
    console.log('✅ Đồng bộ mã script trích xuất -> google-apps-script-source/JavaScript.html');
  }
}

console.log('🚀 Build & Tổng hợp toàn bộ file dự án BĐS PRO thành công hoàn hảo!');
