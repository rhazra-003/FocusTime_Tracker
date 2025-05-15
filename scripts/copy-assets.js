import { copyFile, mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');

async function copyAssets() {
  try {
    // Create dist directory if it doesn't exist
    await mkdir(distDir, { recursive: true });
    await mkdir(resolve(distDir, 'icons'), { recursive: true });

    // Copy manifest.json
    await copyFile(
      resolve(rootDir, 'manifest.json'),
      resolve(distDir, 'manifest.json')
    );

    // Copy icons
    const iconSizes = [16, 48, 128];
    for (const size of iconSizes) {
      try {
        await copyFile(
          resolve(rootDir, `public/icons/icon${size}.png`),
          resolve(distDir, `icons/icon${size}.png`)
        );
      } catch (error) {
        console.warn(`Warning: Could not copy icon${size}.png - file may be missing`);
      }
    }

    console.log('Assets copied successfully!');
  } catch (error) {
    console.error('Error copying assets:', error);
    process.exit(1);
  }
}

copyAssets(); 