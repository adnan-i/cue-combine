'use strict';
const ioc = require('electrolyte');
const Config = ioc.create('config/config');
const sprintf = require('sprintf-js').sprintf;
const _ = require('lodash');

const dimensions = [{
  width: 100,
  height: 60
}, {
  width: 200,
  height: 120
}, {
  width: 400,
  height: 240
}, {
  width: 800,
  height: 480
}, {
  width: 1600,
  height: 960
}];

module.exports = function(sequelize, DataTypes) {

  let attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bucket: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Config.s3.bucket,
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: true
    },
    sizes: {
      type: DataTypes.JSON,
      allowNull: true
    },
    rentalId: {
      type: DataTypes.INTEGER,
      field: 'rental_id',
      allowNull: false,
      references: {
        model: 'Rental',
        key: 'id'
      }
    },
    originalUrl: {
      type: DataTypes.VIRTUAL,
      get: function() {
        return sprintf('https://s3.%s.amazonaws.com/%s/%s', Config.s3.region, this.bucket, this.key);
      }
    }
  };

  _.each(dimensions, function(dimension) {
    attributes['size' + dimension.width + 'Url'] = {
      type: DataTypes.VIRTUAL,
      get: function() {
        if (!this.sizes || !_.isArray(this.sizes)) {
          return null;
        }
        let size = _.find(this.sizes, function(_size) {
          return _size.dimensions.width === dimension.width;
        });
        if (!size) {
          return null;
        }

        return sprintf('https://s3.%s.amazonaws.com/%s/%s', Config.s3.region, size.bucket, size.key);
      }

    };
  });

  let RentalImage = sequelize.define('RentalImage', attributes, {
    tableName: 'images',
    underscored: true,
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function(models) {
        RentalImage.belongsTo(models.Rental, {
          foreignKey: 'rentalId'
        });
      }
    },
  });

  return RentalImage;

};
