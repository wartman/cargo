var db = require('../db');
var field = require('../db/field');

// Setting
// -------
var Setting = db.Model.extend({

  tableName: 'rabbit_settings',

  schema: function () {
    return {
      'id': field.PrimaryKey(),
      'uuid': field.Int(),
      'key': field.Txt({nullable: false}),
      'value': field.Txt({nullable: false}),
      'created': field.DateTime({nullable:false}),
      'updated': field.DateTime()
    }
  }

});

var Settings = db.Collection.extend({
  model: Setting
});

module.exports.Setting = Setting;
module.exports.Settings = Settings;
