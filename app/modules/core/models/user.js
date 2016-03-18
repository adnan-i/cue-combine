'use strict';
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.TEXT,
      field: 'first_name',
      allowNull: false
    },
    lastName: {
      type: DataTypes.TEXT,
      field: 'last_name',
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      set: function(val) {
        this.setDataValue('email', val && val.toString().toLowerCase());
      },
      validate: {
        isEmail: {
          msg: 'Invalid email'
        },
        isUnique: function(email, done) {

          return this.Model.findOne({
              where: {
                email: email
              }
            })
            .then(function(existingEmail) {
              if (existingEmail) {
                return done('This email is already registered.');
              }
              done();
            })
            .catch(done);

        },
      }
    },
    password: {
      type: DataTypes.TEXT,
      set: function(val) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(val, salt);
        this.setDataValue('salt', salt);
        this.setDataValue('password', hash);
      },
      allowNull: false,
    },
    salt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Rental, {
          foreignKey: 'ownerId'
        });
      }
    },
    instanceMethods: {
      isValidPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
    }
  });

  return User;

};

// 'use strict';

// /**
//  * Module dependencies.
//  */
// var Uuid     = require('node-uuid'),
//     crypto   = require('crypto');

// /**
//  * User Schema
//  */
// var User = {

//   identity: 'user',
//   connection: 'postgreDefault',
//   autoPK: false,
//   autoCreatedAt: true,
//   autoUpdatedAt: true,

//   types: {

//     /**
//      * A Validation function for local strategy password
//      */
//     password: function (password) {

//       return (this.provider !== 'local' ||
//       (password && password.length > 6));
//     }
//   },

//   attributes: {
//     id: {
//       type: 'text',
//       primaryKey: true,
//       unique: true,
//       required: true,
//       defaultsTo: function () {
//         return Uuid.v4();
//       }
//     },
//     firstName: {
//       type: 'string',
//       required: true
//     },
//     lastName: {
//       type: 'string',
//       required: true
//     },
//     displayName: {
//       type: 'string'
//     },
//     username: {
//       type: 'string',
//       required: true,
//       unique: true
//     },
//     provider: {
//       type: 'string',
//       required: true
//     },
//     providerData: 'json',
//     additionalProvidersData: 'json',
//     roles: {
//       type: 'string',
//       enum: ['user', 'admin'],
//       defaultsTo: ['user']
//     },
//     articles: {
//       collection: 'article',
//       via: 'id'
//     },
//     email: {
//       required: function() {
//         return this.provider === 'local';
//       },
//       type: 'email'
//     },
//     password: {
//       type: 'string',
//       required: function() {
//         return this.provider === 'local';
//       },
//       password: true
//     },
//     salt: {
//       type: 'string'
//     },
//     /* For reset password */
//     resetPasswordToken: {
//       type: 'string'
//     },
//     resetPasswordExpires: {
//       type: 'datetime'
//     },

//     /**
//      * Remove sensitive data.
//      */
//     toJSON: function () {

//       var obj = this.toObject();
//       delete obj.password;
//       delete obj.salt;
//       delete obj.resetPasswordExpires;
//       delete obj.resetPasswordToken;
//       if (obj.additionalProvidersData) {
//         for (var provider in obj.additionalProvidersData) {
//           delete obj.additionalProvidersData[provider].accessToken;
//         }
//       }
//       if (obj.providerData)
//         delete obj.providerData.accessToken;

//       return obj;
//     },
//     /**
//      * Create instance method for authenticating user
//      */
//     authenticate: function (password) {

//       if (!password) return false;
//       return this.password === User.hashPassword(password, this.salt);
//     }
//   },


//   /**
//    * Create instance method for hashing a password
//    */
//   hashPassword: function (password, salt) {

//     if (!salt)
//       salt = this.salt;
//     if (salt && password) {
//       return crypto.pbkdf2Sync(password,
//         new Buffer(salt, 'base64'), 10000, 64).toString('base64');
//     } else {
//       return password;
//     }
//   },

//   /**
//    * Hook a pre save method to hash the password
//    */
//   beforeCreate: function (values, next) {

//     if (values.password && values.password.length > 6) {
//       values.salt = crypto.randomBytes(16).toString('base64');
//       values.password = this.hashPassword(values.password, values.salt);
//     }
//     next();
//   },

//   /**
//    * Find possible not used username
//    */
//   findUniqueUsername: function (username, suffix, callback) {

//     var _this = this;
//     var possibleUsername = username + (suffix || '');

//     _this.findOne()
//     .where({username: possibleUsername})
//     .exec(function (err, user) {

//       if (!err) {
//         if (!user) {
//           callback(possibleUsername);
//         } else {
//           return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
//         }
//       } else {
//         callback(null);
//       }
//     });
//   },

//   /**
//    * Hook a pre update method in order to change the given name and password
//    */
//   beforeUpdate: function (values, next) {

//     // Update password if new password is provided
//     if (values.hasNewPassword) {
//       if (values.password && values.password.length > 6) {
//         values.salt = crypto.randomBytes(16).toString('base64');
//         values.password = this.hashPassword(values.password, values.salt);
//       }
//       delete values.hasNewPassword;
//     }
//     // Update given name if new first or last name is provided
//     if (values.firstName || values.lastName) {
//       values.displayName = values.firstName + ' ' + values.lastName;
//     }

//     next();
//   }
// };

// module.exports = User;
