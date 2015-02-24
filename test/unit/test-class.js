var expect = require('expect.js')
var rabbit = require('../')

describe('rabbit.Class', function () {

  var Base
  beforeEach(function () {
    Base = rabbit.Class.extend({
      constructor: function (n) {
        this.n = n
      }
    })
  })
  
  describe('#extend', function () {

    it('creates a new class', function () {
      var Test = rabbit.Class.extend({
        constructor: function () {
          this.foo = 'foo'
        }
      })
      expect(Test).to.be.a('function')
      expect(Test.extend).to.be(rabbit.Class.extend)
      var test = new Test()
      expect(test).to.be.a(Test)
      expect(test.foo).to.be('foo')
    })

    it('throws an error when trying to add properties to the prototype', function () {
      expect(function () {
        var Bad = rabbit.Class.extend({
          foo: 'bar'
        })
      }).to.throwError(Error)
    })

    it('inherits instance methods', function () {
      var Test = rabbit.Class.extend({
        constructor: function (foo) {
          this.setFoo(foo)
        },
        getFoo: function () {
          return this.foo
        },
        setFoo: function (foo) {
          this.foo = foo
        }
      })
      expect(Test.prototype.getFoo).to.be.a('function')
      var test = new Test('foo')
      expect(test.getFoo).to.be.a('function')
      expect(test.setFoo).to.be.a('function')
      expect(test.getFoo()).to.be('foo')
      test.setFoo('bar')
      expect(test.getFoo()).to.be('bar')
    })

    it('does not call constructor twice', function (done) {
      var called = 0
      var timer = setTimeout(function () {
        expect(called).to.be(1)
        done()
      }, 200)
      var Base = rabbit.Class.extend({
        constructor: function () {
          called += 1
        }
      })
      new Base()
    })

    it('does not call first class\' constructor when extending', function () {
      var called = 0
      var Base = rabbit.Class.extend({
        constructor: function () {
          called += 1
        }
      })
      var Sub = Base.extend()
      expect(called).to.be(0)
    })

    it('doesn\'t bubble constructor to sub-classes', function () {
      var called = 0
      var Foo = rabbit.Class.extend({
        constructor: function() {
          called += 1
        }
      })
      var Bar = Foo.extend({
        constructor: function() {
          called += 1
        }
      })
      var Baz = Bar.extend({
        constructor: function() {
          called += 1
        }
      })
      //should only fire Baz's constructor
      var baz = new Baz()
      expect(called).to.be(1)
    })

    it('does not call constructor twice when no constructor used in sub', function (done) {
      called = 0
      var timer = setTimeout(function () {
        expect(called).to.be(1)
        done()
      }, 200)
      var Base = rabbit.Class.extend({
        constructor: function () {
          called += 1
        }
      })
      var Sub = Base.extend()
      expect(Sub.prototype._constructor).to.be(Base.prototype._constructor)
      new Sub()
    })

    it('does not call constructor twice when sub is extended with an object', function (done) {
      called = 0
      var timer = setTimeout(function () {
        expect(called).to.be(1)
        done()
      }, 200)
      var Base = rabbit.Class.extend({
        constructor: function () {
          called += 1
        }
      })
      var Sub = Base.extend({
        foo: function(){}
      })
      new Sub()
    })

    it('can access constructor within constructor', function () {
      var Base = rabbit.Class.extend({
        constructor: function () {
          expect(this.constructor.foo).to.be('foo')
        }
      })
      Base.foo = 'foo'
      new Base()
    })

    it('should inherit from superclass', function () {
      var Sub = Base.extend()
      var test = new Sub(5)
      expect(test.n).to.be(5)
    })

    it('should inherit super methods', function () {
      var Base = rabbit.Class.extend({
        foo: function () {
          return 'foo'
        }
      })
      var Sub = Base.extend()
      var test = new Sub()
      expect(test.foo).to.be.a('function')
      expect(test.foo()).to.be('foo')
    })

  })

  describe('#super', function () {

    it('does not endlessly loop', function () {
      var _called = ''
      var Test = rabbit.Class.extend({
        constructor: function () {
          _called += 'first'
        }
      })
      var SubTest = Test.extend({
        constructor: function () {
          _called += 'second'
          this.super()
        }
      })
      var SubSubTest = SubTest.extend({
        constructor: function () {
          _called += 'last'
          this.super()
        }
      })
      var test = new SubSubTest()
      expect(_called).to.be('lastsecondfirst')
    })

    it('passes arguments to super calls', function () {
      var Test = rabbit.Class.extend({
        constructor: function (foo) {
          this.setFoo(foo)
        },
        getFoo: function (append) {
          return this.foo + append
        },
        setFoo: function (foo) {
          this.foo = foo
        }
      })
      var TestTwo = Test.extend({
        constructor: function () {
          this.super('foo')
        },
        getFoo: function () {
          return this.super('bar')
        }
      })
      var test = new TestTwo()
      expect(test.getFoo()).to.be('foobar')
    })

    it('should call super methods from sub methods (including constructor)', function () {
      var methodTimes = 0
      var constructTimes = 0
      var Base = rabbit.Class.extend({
        foo: function () {
          ++methodTimes
          expect(methodTimes).to.be(1)
        }
      })
      var Sub = Base.extend({
        constructor: function () {
          constructTimes += 1
          expect(constructTimes).to.be(1)
        },
        foo: function () {
          this.super()
          ++methodTimes
          expect(methodTimes).to.be(2)
        }
      })
      var SubTwo = Sub.extend({
        constructor: function () {
          this.super()
          constructTimes += 1
          expect(constructTimes).to.be(2)
        },
        foo: function () {
          this.super()
          ++methodTimes
          expect(methodTimes).to.be(3)
        }
      })
      var test = new SubTwo()
      expect(constructTimes).to.be(2)
      test.foo()
      expect(methodTimes).to.be(3)
    })

    it('should access the correct super method', function () {
      var Base = rabbit.Class.extend({
        first: function () {
          return 'first'
        },
        second: function () {
          return 'second'
        }
      })
      var Sub = Base.extend({
        first: function () {
          this.second()
          return this.super()
        },
        second: function () {
          return this.super()
        }
      })
      var base = new Base()
      var sub = new Sub()
      expect(base.first()).to.be('first')
      expect(base.second()).to.be('second')
      expect(sub.first()).to.be('first')
      expect(sub.second()).to.be('second')
    })

    it('should reset when exceptions are thrown', function () {
      var caught = false
      var Base = rabbit.Class.extend({
        thrower: function () {
          throw new Exception()
        },
        catcher: function () {
          caught = true
        }
      })
      var Sub = Base.extend({
        thrower: function () {
          this.super()
        },
        catcher: function () {
          try {
            this.thrower()
          } finally {
            this.super()
          }
        }
      })
      var test = new Sub()
      try {test.catcher()} catch (ignored) {}
      expect(caught).to.be.true
    })

  })

})
