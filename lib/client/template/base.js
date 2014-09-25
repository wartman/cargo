module(function (_) {
  
  _.imports('jquery').as('$');
  _.imports('bind', 'each', 'defaults', 'map').from('underscore');
  _.imports('swig').as('swigBase');
  _.imports('Base', 'mixins').from('..core.base');
  _.imports('config').from('..config');
  _.imports('Promise', 'whenAll', {'resolve': 'resolvedPromise'},
            {'reject': 'rejectedPromise'}).from('..core.defer');

  // TemplateLoader
  // --------------
  // A wrapper for swig which sets up AJAX template loading.
  // Because we can't force Swig's template loader to be async, template
  // files are loaded using this seperate class, then served to Swig
  // from its cache.
  // @TODO: How to handle precompliled templates? Look into how Swig does things.
  var TemplateLoader = _.TemplateLoader = _.Base.extend({

    // Create a new instance. Pass swig here to create a new environment.
    constructor: function (swig) {
      this.cache = {};
      if (swig)
        this.setEngine(swig);
    },

    // Regular expressions used to check for additional files.
    finders: [
      /\{%\s*?extends\s*["']([^'"\s]+)["']\s*%\}/g,
      /\{%\s*?import\s*["']([^'"\s]+)["']\s*%\}/g,
      /\{%\s*?include\s*["']([^'"\s]+)["']\s*%\}/g
    ],

    // Resolve a template identifier using modus' normalizeModuleName method.
    resolve: function (to, from) {
      to = to.replace(/\.html/, '');
      from = from || _.config.paths.template;
      from = from.replace(/\//g, '.').replace(/\.html/, '');
      var modName = modus.normalizeModuleName(to, from);
      modName = modName.replace(/\./g, '/');
      return modName + '.html';
    },

    // Load a template into the cache. Returns a promise.
    load: function (src, parent, options) {
      var self = this;
      
      options = _.defaults((options || {}), {compile: true});
      src = this.resolve(src, parent);

      if (this.hasTemplate(src)) {
        if(options.compile)
          return _.resolvedPromise(this.getCompiledTemplate(src));
        return _.resolvedPromise();
      }

      // Cast AJAX to use our A+ compliant promise.
      return new _.Promise(_.$.ajax({
        url: src
      })).then(function (data) {
        self.addTemplate(src, data);
        return self.investigate(src);
      }).then(function () {
        if (options.compile)
          return self.getCompiledTemplate(src);
        else
          return '';
      });
    },

    // Check the template for any 'include', 'extends' or 'import' calls.
    // Returns a promise when everything is done.
    investigate: function (src) {
      var self = this;
      var tpl = this.getTemplate(src);

      if (!this.hasTemplate(src)) {
        return _.rejectedPromise(new Error('Template not found: ' + src));
      }

      _.each(this.finders, function (finder) {
        tpl.raw.replace(finder, function (match, dep) {
          tpl.deps.push(dep);
        });
      });

      return _.whenAll(_.map(tpl.deps, function (dep) {
        return self.load(dep, src, {compile: false});
      }));
    },

    // Check if a template is in our cachce
    hasTemplate: function (identifier) {
      return !!this.cache[identifier];
    },

    // Get a template from the cache.
    getTemplate: function (identifier) {
      return (this.hasTemplate(identifier))
        ? this.cache[identifier]
        : false;
    },

    // Get the uncompiled template.
    getRawTemplate: function (identifier, cb) {
      if(this.hasTemplate(identifier)) {
        var tpl = this.getTemplate(identifier);
        if (cb) cb(null, tpl.raw);
        return tpl.raw;
      }
      var err = new Error('could not find template: ' + identifier);
      if (cb)
        cb (err);
      else
        throw err;
    },

    // Get a template and compile it if it hasn't been already.
    getCompiledTemplate: function (identifier) {
      if (!this.hasTemplate(identifier)) 
        throw Error('Could not find template: ' + identifier);
      var tpl = this.getTemplate(identifier);
      if (!tpl.compiled) this.compileTemplate(identifier);
      return tpl.compiled;
    },

    // Add a template to the cache.
    addTemplate: function (identifier, raw) {
      this.cache[identifier] = {
        compiled: false,
        raw: raw,
        deps: []
      };
    },

    // Use swig to compile a template.
    compileTemplate: function (identifier, parent) {
      if (!this.hasTemplate(identifier)) 
        throw Error('Could not find template: ' + identifier);
      var tpl = this.getTemplate(identifier);
      // NOTE: Swig is set up to use this.getRawTemplate as its loader when compiling things,
      // so we don't need to worry about passing the raw string.
      tpl.compiled = this.swig.compileFile(identifier, {filename: (parent || identifier)});
    },

    // Create a new Swig environment for this loader.
    setEngine: function (swig) {
      var self = this;
      this.swig = new swig.Swig({loader: {
        resolve: _.bind(self.resolve, self),
        load: _.bind(self.getRawTemplate, self)
      }})
    },

    getEngine: function () {
      if (this.swig)
        return this.swig;
    }

  }, {

    // Static helper to set the swig engine
    setEngine: function (swig) {
      var self = this.getInstance();
      self.setEngine(swig);
    },

    // Static helper to get the swig engine.
    getEngine: function () {
      var self = this.getInstance();
      return self.getEngine();
    }

  });

  // TemplateLoader should always be used as a singleton (except for testing).
  TemplateLoader.mixinStatic(_.mixins.singleton);

  // Setup the base instance of the TemplateLoader to use the swig engine.
  TemplateLoader.setEngine(_.swigBase);

  // Quick reference for our instance of Swig.
  _.swig = TemplateLoader.getEngine();

  // Template-load helper -- likely all you'll need to use to get templates.
  // Returns a promise. Here's the typical use scenerio:
  //
  //    _.SomeView = _.View.extend({
  //      template: _.loadTemplate('./path/to/template'),
  //
  //      render: function () {
  //        var self = this;
  //        this.template.then(function (tpl) {
  //          self.$el.html(tpl({foo: 'bar'}));
  //        });
  //      }
  //    });
  //
  _.loadTemplate = function (path, parent) {
    var loader = TemplateLoader.getInstance();
    return loader.load(path, parent, {compile: true});
  };

});