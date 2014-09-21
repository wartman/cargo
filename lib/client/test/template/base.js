module(function (_) {

  _.imports('TemplateLoader', 'loadTemplate').from('rabbit.template.base');

  var expect = chai.expect;
  var base = 'scripts/client/test/template/fixtures/';

  _.run = function () {

    describe('rabbit.template.base.TemplateLoader', function () {

      var tpl = _.TemplateLoader.getInstance();

      describe('#resolve', function () {

        it('resolves filenames', function () {
          expect(tpl.resolve('./foo', 'foo/bin/bar.html')).to.equal('foo/bin/foo.html');
        });

      });

      describe('#load', function () {
        
        it('loads templates', function (done) {
          tpl.load('./test-no-inherit', base)
            .then(function (tpl) {
              expect(tpl({foo:'bar'})).to.equal('bar');
              done();
            });
        });

        it('loads templates with inheritance', function (done) {
          tpl.load('./test', base)
            .then(function (tpl) {
              expect(tpl({foo:'bar'})).to.equal('layout: bar');
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