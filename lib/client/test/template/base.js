module(function (_) {

  _.imports('TemplateLoader', 'loadTemplate', 'swigBase').from('rabbit.template.base');

  var expect = chai.expect;
  var base = modus.getMappedPath(_.getModuleName(), {ext: 'html'});

  _.run = function () {

    describe('rabbit.template.base.TemplateLoader', function () {

      var tpl = new _.TemplateLoader(_.swigBase);

      describe('#resolve', function () {

        it('resolves filenames', function () {
          expect(tpl.resolve('./foo', 'foo/bin/bar.html')).to.equal('foo/bin/foo.html');
        });

      });

      describe('#load', function () {
        
        it('loads templates', function (done) {
          tpl.load('./fixtures/test-no-inherit', base)
            .then(function (tpl) {
              expect(tpl({foo:'bar'})).to.equal('bar');
              done();
            }).catch(function (err) {
              throw err;
              done();
            });
        });

        it('loads templates with inheritance', function (done) {
          tpl.load('./fixtures/test', base)
            .then(function (tpl) {
              expect(tpl({foo:'bar'})).to.equal('layout: bar');
              done();
            }).catch(function (err) {
              throw err;
              done();
            });
        });

      });

    });

    describe('rabbit.template.base.loadTemplate', function () {
      // just does the same thing as TemplateLoader.getInstance().load
    });

  };

});