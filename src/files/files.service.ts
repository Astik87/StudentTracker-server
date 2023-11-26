import { Injectable } from '@nestjs/common';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { v4 } from 'uuid';

import { UPLOAD_PATH } from '@/files/config';

@Injectable()
export class FilesService {
  constructor() {
    this.createUploadDirIfNotExits();
  }

  createUploadDirIfNotExits() {
    const uploadDirIsExits = existsSync(UPLOAD_PATH);

    if (uploadDirIsExits) {
      return;
    }

    mkdirSync(UPLOAD_PATH);
  }

  saveFile(file: Express.Multer.File) {
    const fileExtName = extname(file.originalname);
    const filePath = `${UPLOAD_PATH}/${v4()}.${fileExtName}`;
    writeFileSync(filePath, file.buffer);

    return filePath;
  }
}
