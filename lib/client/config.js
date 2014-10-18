module(function (_) {

  _.imports('both.util.config');

  _.config.getInstance().set({
    paths: {
      api: '/api/v0.0.1/',
      template: 'content/theme/admin/'
    }
  });

  _['default'] = _.config.getInstance();

});