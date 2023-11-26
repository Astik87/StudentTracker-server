import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { configModule } from './configModule';
import { typeOrm } from './typeOrm';

import { UsersModule } from './users';
import { CoursesModule } from './courses/courses.module';
import { FilesModule } from './files';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    configModule,
    typeOrm,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: { expiresIn: '15m' },
    }),
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      exclude: ['/api*'],
    }),
    UsersModule,
    CoursesModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
