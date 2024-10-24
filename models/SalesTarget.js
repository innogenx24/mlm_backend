'use strict';

module.exports = (sequelize, DataTypes) => {
  const SalesTarget = sequelize.define('SalesTarget', {
    role: {
      type: DataTypes.ENUM(
        'Area Development Officer (ADO)', 
        'Master Distributor (MD)', 
        'Super Distributor (SD)', 
        'Distributor'
      ),
      allowNull: false,
      unique: true, // Ensures that each role is unique
    },
    productData: {
      type: DataTypes.JSON, // Use JSON to store an array of product types, targets, and durations
      allowNull: false,
    },
  }, {
    tableName: 'sales_target',
    timestamps: true,
  });

  return SalesTarget;
};
