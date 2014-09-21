module(function (_) {
  
  _.imports('jquery').as('$');
  _.imports('bind', 'each', 'defaults').from('underscore');
  _.imports('swig').as('swigBase');
  _.imports('Base', 'mixins').from('..core.base');
  _.imports('config').from('..config');
  _.imports('Promise', 'Deffered').from('..core.defer');

  // TemplateLoader
  // --------------
  // A wrapper for swig which sets up AJAX template loading.
  // Because we can't force Swig's template loader to be async, template
  // files are loaded using this seperate class, then served to Swig
  // from its cache.
  // @TODO: How to handle precompliled templates? Look into how Swig does things.
  var TemplateLoader = _.TemplateLoader = _.Base.extend({

    constructor: function () {
      this.cache = {};
    },

    // Regular expressions used to check for additional files.
    finders: [
      /\{%\s*?extends\s*["']([^'"\s]+)["']\s*%\}/g,
      /\{%\s*?import\s*["']([^'"\s]+)["']\s*%\}/g,
      /\{%\s*?include\s*["']([^'"\s]+)["']\s*%\}/g
    ],

    // Resolve a template identifier using modus' normalizeModuleName method.
    resolve: function (to, from) {
      from = from || _.config.paths.template;
      var modName = modus.normalizeModuleName(to, from.replace(/\//g, '.'));
      modName = modName.replace(/\./g, '/').replace(/\/html/g, '');
      return modName + '.html';
    },

    // Load a template into the cache. Returns a promise.
    load: function (src, parent, options) {
      var self = this;
      var defer = new _.Deffered();
      var promise = defer.promise();
      
      options = _.defaults((options || {}), {compile: true});
      src = this.resolve(src, parent);

      if (this.hasTemplate(src)) {
        if(options.compile)
          defer.resolve(this.getCompiledTemplate(src));
        else
          defer.resolve();
        return promise;
      }

      _.$.ajax({
        url: src
      }).done(function (data) {
        self.addTemplate(src, data);
        self.investigate(src)
          .then(function () {
            if (options.compile)
              defer.resolve(self.getCompiledTemplate(src));
            else
              defer.resolve();
          })
          .catches(function (err) {
            defer.reject(err);
          });
      }).fail(function (err) {
        defer.reject(err);
      });

      return promise;
    },

    // Check the template for any 'include', 'extends' or 'import' calls.
    // Returns a promise when everything is done.
    investigate: function (src) {
      var self = this;
      var tpl = this.getTemplate(src);
      var defer = new _.Deffered();

      if (!this.hasTemplate(src)) {
        defer.reject();
        return defer.promise(new Error('Template not found: ' + src));
      }

      _.each(this.finders, function (finder) {
        tpl.raw.replace(finder, function (match, dep) {
          tpl.deps.push(dep);
        });
      });

      var remaining = tpl.deps.length;

      if (remaining == 0) {
        defer.resolve();
      } else {
        _.each(tpl.deps, function (dep) {
          self.load(dep, src, {compile: false})
            .then(function () {
              remaining -= 1;
              if (remaining <= 0) 
                defer.resolve();
            })
            .catches(function (err) {
              defer.reject(err);
            });
        });
      }

      return defer.promise();
    },

    // Check if a template is in our cachce
    hasTemplate: function (identifier) {
      return this.cache.hasOwnProperty(identifier);
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
      var tpl = this.getTemplate(identifier);
      if (!tpl) return false;
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
      if (!this.hasTemplate(identifier)) return;
      var tpl = this.getTemplate(identifier);
      // NOTE: Swig is set up to use this.getRawTemplate as its loader when compiling things,
      // so we don't need to worry about passing the raw string.
      tpl.compiled = _.swig.compileFile(identifier, {filename: (parent || identifier)});
    }

  });

  TemplateLoader.mixinStatic(_.mixins.singleton);

  // Set up our Swig instance to load its files from the TemplateLoader cache.
  var loaderInstance = TemplateLoader.getInstance();
  _.swig = new _.swigBase.Swig({loader: {
    resolve: _.bind(loaderInstance.resolve, loaderInstance),
    load: _.bind(loaderInstance.getRawTemplate, loaderInstance)
  }});

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