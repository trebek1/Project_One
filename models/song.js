"use strict";
module.exports = function(sequelize, DataTypes) {
  var Song = sequelize.define("Song", {
    song_name: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.User_Song)
        // associations can be defined here
      }
    }
  });
  return Song;
};