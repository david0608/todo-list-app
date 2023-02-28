import { DataSource, DataSourceOptions } from 'typeorm';
import * as typeormConfig from './typeorm.config.json';

export default new DataSource(typeormConfig as DataSourceOptions);
