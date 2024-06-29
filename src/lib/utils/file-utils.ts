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

export function fileSize(path: string, unit?: 'KB' | 'MB' | 'GB') {
  const info = fs.statSync(path);
  if (!isNil(unit)) {
    if (unit === 'MB') {
      return info.size / 1000;
    } else if (unit === 'GB') {
      return info.size / 1000000;
    } else {
      info.size;
    }
  }
}
