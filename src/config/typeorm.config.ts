import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

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
  host: '172.20.0.103',
  port: 5434,
  username: 'cvallejos',
  password: 'cvallejos123',
  database: 'sie_produccion',
  entities: [join(__dirname, '../', '**', '*.entity.{ts,js}')],
  synchronize: false,
};

// This is used by TypeORM migration scripts
export const DatabaseSource = new DataSource({
  ...getDatabaseDataSourceOptions(typeOrmConfig as any),
});
