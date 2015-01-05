var uuid = require('node-uuid')
var moment = require('moment')

module.exports = function (db) {

  // Setting
  // -------
  // A required table.
  var Setting = new db.Schema('Setting', {
    'id': db.fields.primaryKey(),
    'uuid': db.fields.integer(),
    'key': db.fields.text({nullable: false}),
    'value': db.fields.text({nullable: false}),
    'created': db.fields.dateTime({nullable:false}),
    'updated': db.fields.dateTime()
  })

  Setting.addMethods({

    defaults: function () {
      return {
        uuid: uuid.v4(),
        created: moment().format(),
        updated: moment().format()
      }
    }

  })

  Setting.register()

}