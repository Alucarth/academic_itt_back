import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';


require('dotenv').config()
export const getDatabaseDataSourceOptions = ({
  port,
  host,
  username,
  database,
  schema,
  password,
}): DataSourceOptions => {
  return {
    type: 'postgres',
    port,
    host,
    username,
    database,
    schema,
    password: password,
    entities: [join(__dirname, '../', '**', '*.entity.{ts,js}')],
  };
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: [join(__dirname, '../', '**', '*.entity.{ts,js}')],
  synchronize: false,
};

// This is used by TypeORM migration scripts
export const DatabaseSource = new DataSource({
  ...getDatabaseDataSourceOptions(typeOrmConfig as any),
});
