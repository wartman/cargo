var API = require('./base')
var LocalStorage = require('../storage').LocalStorage

// ProjectAPI
// ----------
var ProjectAPI = API.extend({

	model: 'Project'

})

module.exports = ProjectAPI
