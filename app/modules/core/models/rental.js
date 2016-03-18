'use strict';

module.exports = function RentalSchema(sequelize, DataTypes) {

  var Rental = sequelize.define('Rental', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      field: 'name',
      allowNull: false
    },
    type: {
      /*eslint-disable new-cap */
      type: DataTypes.ENUM('apartment', 'house'),
      /*eslint-enable */
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      field: 'owner_id',
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
  }, {
    tableName: 'rentals',
    timestamps: true,
    underscored: true,
    paranoid: true,

    classMethods: {
      associate: function(models) {

        Rental.belongsTo(models.User, {
          foreignKey: 'ownerId'
        });

        Rental.hasMany(models.RentalImage, {
          foreignKey: 'rentalId'
        });

      }
    }

  });

  return Rental;

};
