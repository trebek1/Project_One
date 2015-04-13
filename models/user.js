"use strict";
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    passwordDigest: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        this.hasMany(models.user_song)
        // associations can be defined here
      }
    }
  });
  return User;
};