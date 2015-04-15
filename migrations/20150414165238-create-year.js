"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
  	migration.createTable("Years", {
  		id: {
  		  	allowNull: false,
  		  	autoIncrement: true,
  		  	primaryKey: true,
  		  	type: DataTypes.INTEGER
  		},
  		UserId: {
  			type: DataTypes.INTEGER
  		},
  		year: {
  			type: DataTypes.STRING
  		},
  		createdAt: {
  		  allowNull: false,
  		  type: DataTypes.DATE
  		},
  		updatedAt: {
  		  allowNull: false,
  		  type: DataTypes.DATE
  		}
  	}).done(done);
  },

  down: function(migration, DataTypes, done) {
  	migration.dropTable("Years").done(done);
  }
};
