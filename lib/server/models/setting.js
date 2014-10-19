var model = require('./base');

// Setting
// -------
var Setting = model.Model.extend({

  tableName: 'rabbit_settings',

  schema: function () {
    return {
      'id': model.PrimaryKey(),
      'uuid': model.Int(),
      'key': model.Txt({nullable: false}),
      'value': model.Txt({nullable: false}),
      'created': model.DateTime({nullable:false}),
      'updated': model.DateTime()
    }
  }

});

var Settings = model.Collection.extend({
  model: Setting
});

module.exports.Setting = model.model('Setting', Setting);
module.exports.Settings = model.collection('Settings', Settings);
