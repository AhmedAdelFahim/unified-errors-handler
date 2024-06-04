import { DataTypes } from 'sequelize';
import { TABLES } from '../../../../database/table.constant';
import { PostgresDatabase } from '../../../../database/postgres-database';

const Pet = PostgresDatabase.getSequelizeInstance().define(
  TABLES.PET,
  {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    type: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export default Pet;
