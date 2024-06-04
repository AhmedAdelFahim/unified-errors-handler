import { DataTypes } from 'sequelize';
import { TABLES } from '../../../database/table.constant';
import { Database } from '../../../database';

const User = Database.getSequelizeInstance().define(
  TABLES.USER,
  {
    name: DataTypes.STRING,
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    status: DataTypes.STRING,
    age: DataTypes.INTEGER,
    email: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export default User;
