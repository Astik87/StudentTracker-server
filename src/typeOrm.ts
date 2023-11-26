import { TypeOrmModule } from '@nestjs/typeorm';
import databaseEntities from './entities';

export const typeOrm = TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: databaseEntities,
  synchronize: true,
});
