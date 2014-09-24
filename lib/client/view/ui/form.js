module(function (_) {

  _.imports('jquery').as('$');
  _.imports('isFunction', 'uniqueId', 'each').from('underscore');
  _.imports('View', 'loadTemplate').from('..base');

  // Helpers
  // -------
  
  // A simple trim helper.
  function trim (el) {
    return (''.trim) ? el.val().trim() : _.$.trim(el.val());
  }

  // Test functions
  // --------------
  _.tests = {
    USPhone: function (val) {
      return /^\(?(\d{3})\)?[\- ]?\d{3}[\- ]?\d{4}$/.test(val);
    },
    // matches mm/dd/yyyy (requires leading 0's (which may be a bit silly, what do you think?)
    date: function (val) {
      return /^(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12][0-9]|3[01])\/(?:\d{4})/.test(val);
    },
    email: function (val) {
      return /^(?:\w+\.?\+?)*\w+@(?:\w+\.)+\w+$/.test(val);
    },
    minLength: function (val, length) {
      return val.length >= length;
    },
    maxLength: function (val, length) {
      return val.length <= length;
    },
    equal: function (val1, val2) {
      return (val1 == val2);
    },
    checked: function () {
      return this.$el.is(':checked');
    }
  };

  _.Field = _.View.extend({
    
    options: {
      message: '',
      msgClass: 'form-warn',
      required: false,
      type: 'text',
      test: function () { return true; },
      anim: {
        deactivate: {
          height: 0,
          opacity: 0
        },
        activate: {
          height: 30,
          opacity: 1
        },
        speed: 100
      }
    },

    events: {
      'blur': 'isValid',
      'change': 'isValid'
    },

    initilaize: function () {
      // Check validity on focus (or user defined event).
      this.cid = _.uniqueId('field-');
      this.options.type = (this.$el.attr('type') || 'text');
      if (this.$el.is('select')) this.options.type = 'select';
      this.$parent = this.options.parent.$el;
    },

    template: _.loadTemplate('./layout/ui/forms/invalid'), // or something

    // template: app.plus.instance.compile('<span {{?id}}id="{{id}}"{{/?}} class="{{msgClass}} {{msgClass}}-{{type}}" role="alert">{{message}}</span>'),

    isValid: function (submit) {
      var val = '';
      var el = this.$el;
      var error = false;
      var opts = this.options;
      var arg = (_.isFunction(opts.arg))? opts.arg() : opts.arg;

      if (this.options.type === 'checkbox') {
        val = (el.is(':checked'))? 'checked' : '';
      } else {
        if(_.isFunction(opts.clean)) {
          val = opts.clean(el.val());
        } else if (!(opts.type === 'password')) {
          val = trim(el);
        } else {
          val = el.val();
        }
        // Write back.
        el.val(val);
      }

      var doTest = ((val.length > 0 || opts.required === 'sometimes') && _.isFunction(opts.test));

      if (submit && opts.required === true && val.length === 0) {
        error = true;
      } else if (doTest) {
        error = !opts.test.call(this, val, arg);
      }

      if (error) {
        this.invalid();
        return false;
      } else {
        this.valid();
        return true;
      }
    },

    valid: function () {
      this.$el.removeClass('is__invalid');
      if (this.$parent.has('#' + this.cid).length > 0) {
        var message = this.$parent.find('#' + this.cid);
        message.animate(this.options.anim.deactivate, this.options.anim.speed);
      }
    },

    invalid: function (msg) {
      var self = this;
      this.$el.addClass('is__invalid');
      if (this.$parent.has('#' + this.cid).length <= 0) { 
        this.render().then(function () {
          var message = this.$parent.find('#' + this.cid);
          // this.options.anim.activate.height = message.css('height').replace('px', '') || 30;
          // setup;
          message.css(this.options.anim.deactivate);
        });
      }
      msg = msg || this.options.message;
      var message = this.$parent.find('#' + this.cid);
      message.html(msg);
      message.animate(this.options.anim.activate, this.options.anim.speed);
    },

    render: function () {
      var self = this;
      this.options.id = this.cid;
      return this.template.then(function () {
        self.$el.after(this.template.render(this.options));
      });
    }

  });

  _.Validator = _.View.extend({

    events: {
      'submit': 'submit'
    },

    fields: {},

    field: _.Field,

    options: {
      submitOnce: false
    },

    init: function () {
      this._fields = {};
      this._submitted = false;
      this._disabled = false;
      this.pauseMessages = false;
      this.item = null;
      // Add all fields
      _.each(this.fields, function (settings, el) {
        this.add(el, settings);
      }, this);
    },

    disable: function () {
      this._disabled = true;
    },

    enable: function () {
      this._disabled = false;
    },

    add: function (el, options) {
      options.el = this.el + ' ' + el;
      options.parent = this;
      var field = new this.field(options);
      this._fields[el] = field;
    },

    submit: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var errors = false;
      var self = this;
      _.each(this._fields, function (field, el){
        if (!field.isValid(true)) errors = true;
      });
      if (errors) return this.invalid();
      this.valid();
    },

    invalid: function () {
      // console.log('invalid');
    },

    valid: function () {
      if (this._disabled) return;
      if (this.options.submitOnce && this._submitted) return;
      var self = this;
      this._submitted = true;
      this.undelegateEvents();
      this.$el.submit().delay(50).queue(function () {
        self.delegateEvents();
      });
    }

  });

});