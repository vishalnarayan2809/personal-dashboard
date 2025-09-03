const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

async function createExtensionZip() {
  const version = require('../package.json').version;
  const outputPath = path.join(__dirname, '..', `personal-dashboard-v${version}.zip`);
  const sourcePath = path.join(__dirname, '..', 'dist');

  // Check if dist folder exists
  if (!fs.existsSync(sourcePath)) {
    console.error('❌ dist folder not found. Please run "npm run build" first.');
    process.exit(1);
  }

  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });

  archive.pipe(output);

  // Add all files from dist folder
  archive.directory(sourcePath, false);

  // Add root files needed for extension
  const rootFiles = [
    'manifest.json',
    'icon.png',
    'README.md'
  ];

  rootFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: file });
    }
  });

  await archive.finalize();

  output.on('close', () => {
    console.log(`✅ Extension packaged successfully!`);
    console.log(`📦 File: ${outputPath}`);
    console.log(`📊 Size: ${archive.pointer()} bytes`);
    console.log(`🚀 Ready for Chrome Web Store submission`);
  });

  output.on('error', (err) => {
    console.error('❌ Error creating package:', err);
    process.exit(1);
  });
}

createExtensionZip().catch(console.error);
