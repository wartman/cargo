module(function (_) {

  _.imports('each').from('underscore');
  _.imports('View', 'loadTemplate').from('..base');
  _.imports('mixins').from('...core.base');

  // A modal window/alert/etc.
  _.Modal = _.View.extend({

    template: _.loadTemplate('./ui/modal/modal'),

    show: function () {
      // to do
    },

    hide: function () {
      // to do
    },

    render: function () {
      var self = this;
      this.template.then(function (tpl) {
        self.$el.html(tpl({modal: self.model.toJSON()}));
      });
    }

  });

  // A singleton manager for all modals.
  _.ModalManager = _.View.extend({

    modal: _.Modal,

    template: _.loadTemplate('./ui/modal/container'),

    constructor: function() {
      this.cache = {};
    },

    // Add a modal to the cache.
    add: function(id, data) {
      // to do
    },

    // Hide all open modals.
    hideAll: function () {

    },

  });

  _.ModalManager.mixinStatic(_.mixins.singleton);

});