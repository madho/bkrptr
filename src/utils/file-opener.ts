// src/utils/file-opener.ts

import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';

const execAsync = promisify(exec);

export async function openInViewer(filePath: string): Promise<void> {
  const platform = os.platform();

  try {
    switch (platform) {
      case 'darwin': // macOS
        await execAsync(`open "${filePath}"`);
        break;
      case 'win32': // Windows
        await execAsync(`start "" "${filePath}"`);
        break;
      default: // Linux and others
        await execAsync(`xdg-open "${filePath}"`);
        break;
    }
  } catch (error) {
    throw new Error(`Failed to open file: ${error}`);
  }
}

export async function openInEditor(filePath: string, editor?: string): Promise<void> {
  const editorCommand = editor || process.env.EDITOR || 'vim';

  try {
    await execAsync(`${editorCommand} "${filePath}"`);
  } catch (error) {
    throw new Error(`Failed to open in editor: ${error}`);
  }
}
