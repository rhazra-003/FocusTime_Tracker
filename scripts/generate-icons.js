import { exec } from 'child_process';
import { promisify } from 'util';
import { mkdir, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');
const iconsDir = resolve(rootDir, 'public/icons');

async function generateIcons() {
  try {
    // Create icons directory if it doesn't exist
    await mkdir(iconsDir, { recursive: true });

    // Generate a simple colored square icon for each size
    const sizes = [16, 48, 128];
    for (const size of sizes) {
      const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#4CAF50"/>
        <text x="50%" y="50%" font-family="Arial" font-size="${size/2}px" fill="white" text-anchor="middle" dominant-baseline="middle">FT</text>
      </svg>`;
      
      const svgPath = resolve(iconsDir, `icon${size}.svg`);
      await writeFile(svgPath, svg);
      
      // Convert SVG to PNG using sharp
      await sharp(svgPath)
        .png()
        .toFile(resolve(iconsDir, `icon${size}.png`));
    }

    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 