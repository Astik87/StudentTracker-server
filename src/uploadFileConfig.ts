import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const uploadFileConfig: MulterOptions = {
  dest: `${__dirname}/../public/upload`,
};
