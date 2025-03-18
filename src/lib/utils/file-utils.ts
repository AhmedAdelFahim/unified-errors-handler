import appRootPath from 'app-root-path';
import fs from 'fs';
import { isNil } from './utils-functions';

export function getProjectRootPath() {
  return appRootPath.path;
}

export function createDirIfNotExist(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getFileSize(path: string, unit?: 'KB' | 'MB' | 'GB') {
  const info = fs.statSync(path);
  if (!isNil(unit)) {
    if (unit === 'MB') {
      return info.size / 1024;
    } else if (unit === 'GB') {
      return info.size / (1024 * 1024);
    } else {
      info.size;
    }
  }
}
