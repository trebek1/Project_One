"use strict";
module.exports = function(sequelize, DataTypes) {
  var User_Song = sequelize.define("User_Song", {
    UserId: DataTypes.INTEGER,
    year: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.user)
        // associations can be defined here
      }
    }
  });
  return User_Song;
};