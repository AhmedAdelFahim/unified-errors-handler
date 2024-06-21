const importErrors: { [key: string]: string } = {
  sequelize: 'To parse sequelize exceptions, you should install sequelize module.\nnpm i sequelize',
  typeorm: 'To parse typeorm exceptions, you should install typeorm module.\nnpm i typeorm',
  mongoose: 'To parse mongoose exceptions, you should install mongoose module.\nnpm i mongoose',
};

export function lazyLoad(moduleName: string, importError?: string) {
  try {
    return require(moduleName);
  } catch (e) {
    if (importError) {
      throw new Error(importError);
    } else if (importErrors[moduleName]) {
      throw new Error(importErrors[moduleName]);
    }
  }
}
