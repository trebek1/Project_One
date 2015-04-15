"use strict";
module.exports = function(sequelize, DataTypes) {
  var Year = sequelize.define("Year", {
    UserId: DataTypes.INTEGER,
    year: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.User);
        // associations can be defined here
      }
    }
  });
  return Year;
};