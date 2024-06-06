import { DataTypes } from 'sequelize';
import { TABLES } from '../../../../database/table.constant';
import { PostgresDatabase } from '../../../../database/postgres-database';

const User = PostgresDatabase.getSequelizeInstance().define(
  TABLES.USER,
  {
    name: DataTypes.STRING,
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    status: DataTypes.STRING,
    gender: {
      type: DataTypes.ENUM,
      values: ['MALE', 'FEMALE'],
    },
    age: DataTypes.INTEGER,
    email: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export default User;
