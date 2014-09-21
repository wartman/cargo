module(function (_) {
  
  _.imports('Project', 'ProjectCollection').from('rabbit.model.project');

  _.run = function () {

    describe('rabbit.model.project', function () {
      // do stuff
      it('is a placeholder', function () {
        chai.expect('ok').to.equal('ok');
      });

    });

  };

})