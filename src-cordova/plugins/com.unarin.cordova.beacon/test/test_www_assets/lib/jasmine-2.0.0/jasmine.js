/*
Copyright (c) 2008-2013 Pivotal Labs

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
function getJasmineRequireObj() {
  if (typeof module !== 'undefined' && module.exports) {
    return exports;
  } else {
    window.jasmineRequire = window.jasmineRequire || {};
    return window.jasmineRequire;
  }
}

getJasmineRequireObj().core = function (jRequire) {
  const j$ = {};

  jRequire.base(j$);
  j$.util = jRequire.util();
  j$.Any = jRequire.Any();
  j$.CallTracker = jRequire.CallTracker();
  j$.Clock = jRequire.Clock();
  j$.DelayedFunctionScheduler = jRequire.DelayedFunctionScheduler();
  j$.Env = jRequire.Env(j$);
  j$.ExceptionFormatter = jRequire.ExceptionFormatter();
  j$.Expectation = jRequire.Expectation();
  j$.buildExpectationResult = jRequire.buildExpectationResult();
  j$.JsApiReporter = jRequire.JsApiReporter();
  j$.matchersUtil = jRequire.matchersUtil(j$);
  j$.ObjectContaining = jRequire.ObjectContaining(j$);
  j$.pp = jRequire.pp(j$);
  j$.QueueRunner = jRequire.QueueRunner();
  j$.ReportDispatcher = jRequire.ReportDispatcher();
  j$.Spec = jRequire.Spec(j$);
  j$.SpyStrategy = jRequire.SpyStrategy();
  j$.Suite = jRequire.Suite();
  j$.Timer = jRequire.Timer();
  j$.version = jRequire.version();

  j$.matchers = jRequire.requireMatchers(jRequire, j$);

  return j$;
};

getJasmineRequireObj().requireMatchers = function (jRequire, j$) {
  const availableMatchers = [
    'toBe',
    'toBeCloseTo',
    'toBeDefined',
    'toBeFalsy',
    'toBeGreaterThan',
    'toBeLessThan',
    'toBeNaN',
    'toBeNull',
    'toBeTruthy',
    'toBeUndefined',
    'toContain',
    'toEqual',
    'toHaveBeenCalled',
    'toHaveBeenCalledWith',
    'toMatch',
    'toThrow',
    'toThrowError',
  ];
  const matchers = {};

  for (let i = 0; i < availableMatchers.length; i++) {
    const name = availableMatchers[i];
    matchers[name] = jRequire[name](j$);
  }

  return matchers;
};

getJasmineRequireObj().base = function (j$) {
  j$.unimplementedMethod_ = function () {
    throw new Error('unimplemented method');
  };

  j$.MAX_PRETTY_PRINT_DEPTH = 40;
  j$.DEFAULT_TIMEOUT_INTERVAL = 5000;

  j$.getGlobal = (function () {
    const jasmineGlobal = eval.call(null, 'this');
    return function () {
      return jasmineGlobal;
    };
  })();

  j$.getEnv = function (options) {
    const env = (j$.currentEnv_ = j$.currentEnv_ || new j$.Env(options));
    // jasmine. singletons in here (setTimeout blah blah).
    return env;
  };

  j$.isArray_ = function (value) {
    return j$.isA_('Array', value);
  };

  j$.isString_ = function (value) {
    return j$.isA_('String', value);
  };

  j$.isNumber_ = function (value) {
    return j$.isA_('Number', value);
  };

  j$.isA_ = function (typeName, value) {
    return (
      Object.prototype.toString.apply(value) === '[object ' + typeName + ']'
    );
  };

  j$.isDomNode = function (obj) {
    return obj.nodeType > 0;
  };

  j$.any = function (clazz) {
    return new j$.Any(clazz);
  };

  j$.objectContaining = function (sample) {
    return new j$.ObjectContaining(sample);
  };

  j$.createSpy = function (name, originalFn) {
    const spyStrategy = new j$.SpyStrategy({
      name,
      fn: originalFn,
      getSpy() {
        return spy;
      },
    });
    const callTracker = new j$.CallTracker();
    var spy = function () {
      callTracker.track({
        object: this,
        args: Array.prototype.slice.apply(arguments),
      });
      return spyStrategy.exec.apply(this, arguments);
    };

    for (const prop in originalFn) {
      if (prop === 'and' || prop === 'calls') {
        throw new Error(
          "Jasmine spies would overwrite the 'and' and 'calls' properties on the object being spied upon"
        );
      }

      spy[prop] = originalFn[prop];
    }

    spy.and = spyStrategy;
    spy.calls = callTracker;

    return spy;
  };

  j$.isSpy = function (putativeSpy) {
    if (!putativeSpy) {
      return false;
    }
    return (
      putativeSpy.and instanceof j$.SpyStrategy &&
      putativeSpy.calls instanceof j$.CallTracker
    );
  };

  j$.createSpyObj = function (baseName, methodNames) {
    if (!j$.isArray_(methodNames) || methodNames.length === 0) {
      throw 'createSpyObj requires a non-empty array of method names to create spies for';
    }
    const obj = {};
    for (let i = 0; i < methodNames.length; i++) {
      obj[methodNames[i]] = j$.createSpy(baseName + '.' + methodNames[i]);
    }
    return obj;
  };
};

getJasmineRequireObj().util = function () {
  const util = {};

  util.inherit = function (childClass, parentClass) {
    const Subclass = function () {};
    Subclass.prototype = parentClass.prototype;
    childClass.prototype = new Subclass();
  };

  util.htmlEscape = function (str) {
    if (!str) {
      return str;
    }
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  util.argsToArray = function (args) {
    const arrayOfArgs = [];
    for (let i = 0; i < args.length; i++) {
      arrayOfArgs.push(args[i]);
    }
    return arrayOfArgs;
  };

  util.isUndefined = function (obj) {
    return obj === void 0;
  };

  return util;
};

getJasmineRequireObj().Spec = function (j$) {
  function Spec(attrs) {
    this.expectationFactory = attrs.expectationFactory;
    this.resultCallback = attrs.resultCallback || function () {};
    this.id = attrs.id;
    this.description = attrs.description || '';
    this.fn = attrs.fn;
    this.beforeFns =
      attrs.beforeFns ||
      function () {
        return [];
      };
    this.afterFns =
      attrs.afterFns ||
      function () {
        return [];
      };
    this.onStart = attrs.onStart || function () {};
    this.exceptionFormatter = attrs.exceptionFormatter || function () {};
    this.getSpecName =
      attrs.getSpecName ||
      function () {
        return '';
      };
    this.expectationResultFactory =
      attrs.expectationResultFactory || function () {};
    this.queueRunnerFactory = attrs.queueRunnerFactory || function () {};
    this.catchingExceptions =
      attrs.catchingExceptions ||
      function () {
        return true;
      };

    this.timer = attrs.timer || { setTimeout, clearTimeout };

    if (!this.fn) {
      this.pend();
    }

    this.result = {
      id: this.id,
      description: this.description,
      fullName: this.getFullName(),
      failedExpectations: [],
    };
  }

  Spec.prototype.addExpectationResult = function (passed, data) {
    if (passed) {
      return;
    }
    this.result.failedExpectations.push(this.expectationResultFactory(data));
  };

  Spec.prototype.expect = function (actual) {
    return this.expectationFactory(actual, this);
  };

  Spec.prototype.execute = function (onComplete) {
    const self = this;
    let timeout;

    this.onStart(this);

    if (this.markedPending || this.disabled) {
      complete();
      return;
    }

    function timeoutable(fn) {
      return function (done) {
        timeout = Function.prototype.apply.apply(self.timer.setTimeout, [
          j$.getGlobal(),
          [
            function () {
              onException(
                new Error(
                  'Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.'
                )
              );
              done();
            },
            j$.DEFAULT_TIMEOUT_INTERVAL,
          ],
        ]);

        const callDone = function () {
          clearTimeoutable();
          done();
        };

        fn.call(this, callDone); // TODO: do we care about more than 1 arg?
      };
    }

    function clearTimeoutable() {
      Function.prototype.apply.apply(self.timer.clearTimeout, [
        j$.getGlobal(),
        [timeout],
      ]);
      timeout = void 0;
    }

    const allFns = this.beforeFns().concat(this.fn).concat(this.afterFns());
    const allTimeoutableFns = [];
    for (let i = 0; i < allFns.length; i++) {
      const fn = allFns[i];
      allTimeoutableFns.push(fn.length > 0 ? timeoutable(fn) : fn);
    }

    this.queueRunnerFactory({
      fns: allTimeoutableFns,
      onException,
      onComplete: complete,
    });

    function onException(e) {
      clearTimeoutable();
      if (Spec.isPendingSpecException(e)) {
        self.pend();
        return;
      }

      self.addExpectationResult(false, {
        matcherName: '',
        passed: false,
        expected: '',
        actual: '',
        error: e,
      });
    }

    function complete() {
      self.result.status = self.status();
      self.resultCallback(self.result);

      if (onComplete) {
        onComplete();
      }
    }
  };

  Spec.prototype.disable = function () {
    this.disabled = true;
  };

  Spec.prototype.pend = function () {
    this.markedPending = true;
  };

  Spec.prototype.status = function () {
    if (this.disabled) {
      return 'disabled';
    }

    if (this.markedPending) {
      return 'pending';
    }

    if (this.result.failedExpectations.length > 0) {
      return 'failed';
    } else {
      return 'passed';
    }
  };

  Spec.prototype.getFullName = function () {
    return this.getSpecName(this);
  };

  Spec.pendingSpecExceptionMessage = '=> marked Pending';

  Spec.isPendingSpecException = function (e) {
    return e.toString().includes(Spec.pendingSpecExceptionMessage);
  };

  return Spec;
};

if (typeof window === void 0 && typeof exports === 'object') {
  exports.Spec = jasmineRequire.Spec;
}

getJasmineRequireObj().Env = function (j$) {
  function Env(options) {
    options = options || {};

    const self = this;
    const global = options.global || j$.getGlobal();

    let totalSpecsDefined = 0;

    let catchExceptions = true;

    const realSetTimeout = j$.getGlobal().setTimeout;
    const realClearTimeout = j$.getGlobal().clearTimeout;
    this.clock = new j$.Clock(global, new j$.DelayedFunctionScheduler());

    const runnableLookupTable = {};

    let spies = [];

    let currentSpec = null;
    let currentSuite = null;

    const reporter = new j$.ReportDispatcher([
      'jasmineStarted',
      'jasmineDone',
      'suiteStarted',
      'suiteDone',
      'specStarted',
      'specDone',
    ]);

    this.specFilter = function () {
      return true;
    };

    const equalityTesters = [];

    let customEqualityTesters = [];
    this.addCustomEqualityTester = function (tester) {
      customEqualityTesters.push(tester);
    };

    j$.Expectation.addCoreMatchers(j$.matchers);

    let nextSpecId = 0;
    const getNextSpecId = function () {
      return 'spec' + nextSpecId++;
    };

    let nextSuiteId = 0;
    const getNextSuiteId = function () {
      return 'suite' + nextSuiteId++;
    };

    const expectationFactory = function (actual, spec) {
      return j$.Expectation.Factory({
        util: j$.matchersUtil,
        customEqualityTesters,
        actual,
        addExpectationResult,
      });

      function addExpectationResult(passed, result) {
        return spec.addExpectationResult(passed, result);
      }
    };

    const specStarted = function (spec) {
      currentSpec = spec;
      reporter.specStarted(spec.result);
    };

    const beforeFns = function (suite) {
      return function () {
        let befores = [];
        while (suite) {
          befores = befores.concat(suite.beforeFns);
          suite = suite.parentSuite;
        }
        return befores.reverse();
      };
    };

    const afterFns = function (suite) {
      return function () {
        let afters = [];
        while (suite) {
          afters = afters.concat(suite.afterFns);
          suite = suite.parentSuite;
        }
        return afters;
      };
    };

    const getSpecName = function (spec, suite) {
      return suite.getFullName() + ' ' + spec.description;
    };

    // TODO: we may just be able to pass in the fn instead of wrapping here
    const buildExpectationResult = j$.buildExpectationResult;
    const exceptionFormatter = new j$.ExceptionFormatter();
    const expectationResultFactory = function (attrs) {
      attrs.messageFormatter = exceptionFormatter.message;
      attrs.stackFormatter = exceptionFormatter.stack;

      return buildExpectationResult(attrs);
    };

    // TODO: fix this naming, and here's where the value comes in
    this.catchExceptions = function (value) {
      catchExceptions = !!value;
      return catchExceptions;
    };

    this.catchingExceptions = function () {
      return catchExceptions;
    };

    const maximumSpecCallbackDepth = 20;
    let currentSpecCallbackDepth = 0;

    function clearStack(fn) {
      currentSpecCallbackDepth++;
      if (currentSpecCallbackDepth >= maximumSpecCallbackDepth) {
        currentSpecCallbackDepth = 0;
        realSetTimeout(fn, 0);
      } else {
        fn();
      }
    }

    const catchException = function (e) {
      return j$.Spec.isPendingSpecException(e) || catchExceptions;
    };

    const queueRunnerFactory = function (options) {
      options.catchException = catchException;
      options.clearStack = options.clearStack || clearStack;

      new j$.QueueRunner(options).execute();
    };

    const topSuite = new j$.Suite({
      env: this,
      id: getNextSuiteId(),
      description: 'Jasmine__TopLevel__Suite',
      queueRunner: queueRunnerFactory,
      resultCallback() {}, // TODO - hook this up
    });
    runnableLookupTable[topSuite.id] = topSuite;
    currentSuite = topSuite;

    this.topSuite = function () {
      return topSuite;
    };

    this.execute = function (runnablesToRun) {
      runnablesToRun = runnablesToRun || [topSuite.id];

      const allFns = [];
      for (let i = 0; i < runnablesToRun.length; i++) {
        const runnable = runnableLookupTable[runnablesToRun[i]];
        allFns.push(
          (function (runnable) {
            return function (done) {
              runnable.execute(done);
            };
          })(runnable)
        );
      }

      reporter.jasmineStarted({
        totalSpecsDefined,
      });

      queueRunnerFactory({ fns: allFns, onComplete: reporter.jasmineDone });
    };

    this.addReporter = function (reporterToAdd) {
      reporter.addReporter(reporterToAdd);
    };

    this.addMatchers = function (matchersToAdd) {
      j$.Expectation.addMatchers(matchersToAdd);
    };

    this.spyOn = function (obj, methodName) {
      if (j$.util.isUndefined(obj)) {
        throw new TypeError(
          'spyOn could not find an object to spy upon for ' + methodName + '()'
        );
      }

      if (j$.util.isUndefined(obj[methodName])) {
        throw new TypeError(methodName + '() method does not exist');
      }

      if (obj[methodName] && j$.isSpy(obj[methodName])) {
        // TODO?: should this return the current spy? Downside: may cause user confusion about spy state
        throw new Error(methodName + ' has already been spied upon');
      }

      const spy = j$.createSpy(methodName, obj[methodName]);

      spies.push({
        spy,
        baseObj: obj,
        methodName,
        originalValue: obj[methodName],
      });

      obj[methodName] = spy;

      return spy;
    };

    const suiteFactory = function (description) {
      const suite = new j$.Suite({
        env: self,
        id: getNextSuiteId(),
        description,
        parentSuite: currentSuite,
        queueRunner: queueRunnerFactory,
        onStart: suiteStarted,
        resultCallback(attrs) {
          reporter.suiteDone(attrs);
        },
      });

      runnableLookupTable[suite.id] = suite;
      return suite;
    };

    this.describe = function (description, specDefinitions) {
      const suite = suiteFactory(description);

      const parentSuite = currentSuite;
      parentSuite.addChild(suite);
      currentSuite = suite;

      let declarationError = null;
      try {
        specDefinitions.call(suite);
      } catch (e) {
        declarationError = e;
      }

      if (declarationError) {
        this.it('encountered a declaration exception', function () {
          throw declarationError;
        });
      }

      currentSuite = parentSuite;

      return suite;
    };

    this.xdescribe = function (description, specDefinitions) {
      const suite = this.describe(description, specDefinitions);
      suite.disable();
      return suite;
    };

    const specFactory = function (description, fn, suite) {
      totalSpecsDefined++;

      const spec = new j$.Spec({
        id: getNextSpecId(),
        beforeFns: beforeFns(suite),
        afterFns: afterFns(suite),
        expectationFactory,
        exceptionFormatter,
        resultCallback: specResultCallback,
        getSpecName(spec) {
          return getSpecName(spec, suite);
        },
        onStart: specStarted,
        description,
        expectationResultFactory,
        queueRunnerFactory,
        fn,
        timer: { setTimeout: realSetTimeout, clearTimeout: realClearTimeout },
      });

      runnableLookupTable[spec.id] = spec;

      if (!self.specFilter(spec)) {
        spec.disable();
      }

      return spec;

      function removeAllSpies() {
        for (let i = 0; i < spies.length; i++) {
          const spyEntry = spies[i];
          spyEntry.baseObj[spyEntry.methodName] = spyEntry.originalValue;
        }
        spies = [];
      }

      function specResultCallback(result) {
        removeAllSpies();
        j$.Expectation.resetMatchers();
        customEqualityTesters = [];
        currentSpec = null;
        reporter.specDone(result);
      }
    };

    var suiteStarted = function (suite) {
      reporter.suiteStarted(suite.result);
    };

    this.it = function (description, fn) {
      const spec = specFactory(description, fn, currentSuite);
      currentSuite.addChild(spec);
      return spec;
    };

    this.xit = function (description, fn) {
      const spec = this.it(description, fn);
      spec.pend();
      return spec;
    };

    this.expect = function (actual) {
      return currentSpec.expect(actual);
    };

    this.beforeEach = function (beforeEachFunction) {
      currentSuite.beforeEach(beforeEachFunction);
    };

    this.afterEach = function (afterEachFunction) {
      currentSuite.afterEach(afterEachFunction);
    };

    this.pending = function () {
      throw j$.Spec.pendingSpecExceptionMessage;
    };
  }

  return Env;
};

getJasmineRequireObj().JsApiReporter = function () {
  const noopTimer = {
    start() {},
    elapsed() {
      return 0;
    },
  };

  function JsApiReporter(options) {
    const timer = options.timer || noopTimer;
    let status = 'loaded';

    this.started = false;
    this.finished = false;

    this.jasmineStarted = function () {
      this.started = true;
      status = 'started';
      timer.start();
    };

    let executionTime;

    this.jasmineDone = function () {
      this.finished = true;
      executionTime = timer.elapsed();
      status = 'done';
    };

    this.status = function () {
      return status;
    };

    const suites = {};

    this.suiteStarted = function (result) {
      storeSuite(result);
    };

    this.suiteDone = function (result) {
      storeSuite(result);
    };

    function storeSuite(result) {
      suites[result.id] = result;
    }

    this.suites = function () {
      return suites;
    };

    const specs = [];
    this.specStarted = function (result) {};

    this.specDone = function (result) {
      specs.push(result);
    };

    this.specResults = function (index, length) {
      return specs.slice(index, index + length);
    };

    this.specs = function () {
      return specs;
    };

    this.executionTime = function () {
      return executionTime;
    };
  }

  return JsApiReporter;
};

getJasmineRequireObj().Any = function () {
  function Any(expectedObject) {
    this.expectedObject = expectedObject;
  }

  Any.prototype.jasmineMatches = function (other) {
    if (this.expectedObject == String) {
      return typeof other === 'string' || other instanceof String;
    }

    if (this.expectedObject == Number) {
      return typeof other === 'number' || other instanceof Number;
    }

    if (this.expectedObject == Function) {
      return typeof other === 'function' || other instanceof Function;
    }

    if (this.expectedObject == Object) {
      return typeof other === 'object';
    }

    if (this.expectedObject == Boolean) {
      return typeof other === 'boolean';
    }

    return other instanceof this.expectedObject;
  };

  Any.prototype.jasmineToString = function () {
    return '<jasmine.any(' + this.expectedClass + ')>';
  };

  return Any;
};

getJasmineRequireObj().CallTracker = function () {
  function CallTracker() {
    let calls = [];

    this.track = function (context) {
      calls.push(context);
    };

    this.any = function () {
      return !!calls.length;
    };

    this.count = function () {
      return calls.length;
    };

    this.argsFor = function (index) {
      const call = calls[index];
      return call ? call.args : [];
    };

    this.all = function () {
      return calls;
    };

    this.allArgs = function () {
      const callArgs = [];
      for (let i = 0; i < calls.length; i++) {
        callArgs.push(calls[i].args);
      }

      return callArgs;
    };

    this.first = function () {
      return calls[0];
    };

    this.mostRecent = function () {
      return calls[calls.length - 1];
    };

    this.reset = function () {
      calls = [];
    };
  }

  return CallTracker;
};

getJasmineRequireObj().Clock = function () {
  function Clock(global, delayedFunctionScheduler) {
    const self = this;
    const realTimingFunctions = {
      setTimeout: global.setTimeout,
      clearTimeout: global.clearTimeout,
      setInterval: global.setInterval,
      clearInterval: global.clearInterval,
    };
    const fakeTimingFunctions = {
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
    };
    let installed = false;
    let timer;

    self.install = function () {
      replace(global, fakeTimingFunctions);
      timer = fakeTimingFunctions;
      installed = true;
    };

    self.uninstall = function () {
      delayedFunctionScheduler.reset();
      replace(global, realTimingFunctions);
      timer = realTimingFunctions;
      installed = false;
    };

    self.setTimeout = function (fn, delay, params) {
      if (legacyIE()) {
        if (arguments.length > 2) {
          throw new Error(
            'IE < 9 cannot support extra params to setTimeout without a polyfill'
          );
        }
        return timer.setTimeout(fn, delay);
      }
      return Function.prototype.apply.apply(timer.setTimeout, [
        global,
        arguments,
      ]);
    };

    self.setInterval = function (fn, delay, params) {
      if (legacyIE()) {
        if (arguments.length > 2) {
          throw new Error(
            'IE < 9 cannot support extra params to setInterval without a polyfill'
          );
        }
        return timer.setInterval(fn, delay);
      }
      return Function.prototype.apply.apply(timer.setInterval, [
        global,
        arguments,
      ]);
    };

    self.clearTimeout = function (id) {
      return Function.prototype.call.apply(timer.clearTimeout, [global, id]);
    };

    self.clearInterval = function (id) {
      return Function.prototype.call.apply(timer.clearInterval, [global, id]);
    };

    self.tick = function (millis) {
      if (installed) {
        delayedFunctionScheduler.tick(millis);
      } else {
        throw new Error(
          'Mock clock is not installed, use jasmine.clock().install()'
        );
      }
    };

    return self;

    function legacyIE() {
      // if these methods are polyfilled, apply will be present
      return !(
        realTimingFunctions.setTimeout || realTimingFunctions.setInterval
      ).apply;
    }

    function replace(dest, source) {
      for (const prop in source) {
        dest[prop] = source[prop];
      }
    }

    function setTimeout(fn, delay) {
      return delayedFunctionScheduler.scheduleFunction(
        fn,
        delay,
        argSlice(arguments, 2)
      );
    }

    function clearTimeout(id) {
      return delayedFunctionScheduler.removeFunctionWithId(id);
    }

    function setInterval(fn, interval) {
      return delayedFunctionScheduler.scheduleFunction(
        fn,
        interval,
        argSlice(arguments, 2),
        true
      );
    }

    function clearInterval(id) {
      return delayedFunctionScheduler.removeFunctionWithId(id);
    }

    function argSlice(argsObj, n) {
      return Array.prototype.slice.call(argsObj, 2);
    }
  }

  return Clock;
};

getJasmineRequireObj().DelayedFunctionScheduler = function () {
  function DelayedFunctionScheduler() {
    const self = this;
    let scheduledLookup = [];
    let scheduledFunctions = {};
    let currentTime = 0;
    let delayedFnCount = 0;

    self.tick = function (millis) {
      millis = millis || 0;
      const endTime = currentTime + millis;

      runScheduledFunctions(endTime);
      currentTime = endTime;
    };

    self.scheduleFunction = function (
      funcToCall,
      millis,
      params,
      recurring,
      timeoutKey,
      runAtMillis
    ) {
      let f;
      if (typeof funcToCall === 'string') {
        /* jshint evil: true */
        f = function () {
          return eval(funcToCall);
        };
        /* jshint evil: false */
      } else {
        f = funcToCall;
      }

      millis = millis || 0;
      timeoutKey = timeoutKey || ++delayedFnCount;
      runAtMillis = runAtMillis || currentTime + millis;

      const funcToSchedule = {
        runAtMillis,
        funcToCall: f,
        recurring,
        params,
        timeoutKey,
        millis,
      };

      if (runAtMillis in scheduledFunctions) {
        scheduledFunctions[runAtMillis].push(funcToSchedule);
      } else {
        scheduledFunctions[runAtMillis] = [funcToSchedule];
        scheduledLookup.push(runAtMillis);
        scheduledLookup.sort(function (a, b) {
          return a - b;
        });
      }

      return timeoutKey;
    };

    self.removeFunctionWithId = function (timeoutKey) {
      for (const runAtMillis in scheduledFunctions) {
        const funcs = scheduledFunctions[runAtMillis];
        const i = indexOfFirstToPass(funcs, function (func) {
          return func.timeoutKey === timeoutKey;
        });

        if (i > -1) {
          if (funcs.length === 1) {
            delete scheduledFunctions[runAtMillis];
            deleteFromLookup(runAtMillis);
          } else {
            funcs.splice(i, 1);
          }

          // intervals get rescheduled when executed, so there's never more
          // than a single scheduled function with a given timeoutKey
          break;
        }
      }
    };

    self.reset = function () {
      currentTime = 0;
      scheduledLookup = [];
      scheduledFunctions = {};
      delayedFnCount = 0;
    };

    return self;

    function indexOfFirstToPass(array, testFn) {
      let index = -1;

      for (let i = 0; i < array.length; ++i) {
        if (testFn(array[i])) {
          index = i;
          break;
        }
      }

      return index;
    }

    function deleteFromLookup(key) {
      const value = Number(key);
      const i = indexOfFirstToPass(scheduledLookup, function (millis) {
        return millis === value;
      });

      if (i > -1) {
        scheduledLookup.splice(i, 1);
      }
    }

    function reschedule(scheduledFn) {
      self.scheduleFunction(
        scheduledFn.funcToCall,
        scheduledFn.millis,
        scheduledFn.params,
        true,
        scheduledFn.timeoutKey,
        scheduledFn.runAtMillis + scheduledFn.millis
      );
    }

    function runScheduledFunctions(endTime) {
      if (scheduledLookup.length === 0 || scheduledLookup[0] > endTime) {
        return;
      }

      do {
        currentTime = scheduledLookup.shift();

        const funcsToRun = scheduledFunctions[currentTime];
        delete scheduledFunctions[currentTime];

        for (let i = 0; i < funcsToRun.length; ++i) {
          const funcToRun = funcsToRun[i];
          funcToRun.funcToCall.apply(null, funcToRun.params || []);

          if (funcToRun.recurring) {
            reschedule(funcToRun);
          }
        }
      } while (
        scheduledLookup.length > 0 &&
        // checking first if we're out of time prevents setTimeout(0)
        // scheduled in a funcToRun from forcing an extra iteration
        currentTime !== endTime &&
        scheduledLookup[0] <= endTime
      );
    }
  }

  return DelayedFunctionScheduler;
};

getJasmineRequireObj().ExceptionFormatter = function () {
  function ExceptionFormatter() {
    this.message = function (error) {
      let message = error.name + ': ' + error.message;

      if (error.fileName || error.sourceURL) {
        message += ' in ' + (error.fileName || error.sourceURL);
      }

      if (error.line || error.lineNumber) {
        message += ' (line ' + (error.line || error.lineNumber) + ')';
      }

      return message;
    };

    this.stack = function (error) {
      return error ? error.stack : null;
    };
  }

  return ExceptionFormatter;
};

getJasmineRequireObj().Expectation = function () {
  const matchers = {};

  function Expectation(options) {
    this.util = options.util || { buildFailureMessage() {} };
    this.customEqualityTesters = options.customEqualityTesters || [];
    this.actual = options.actual;
    this.addExpectationResult = options.addExpectationResult || function () {};
    this.isNot = options.isNot;

    for (const matcherName in matchers) {
      this[matcherName] = matchers[matcherName];
    }
  }

  Expectation.prototype.wrapCompare = function (name, matcherFactory) {
    return function () {
      const args = Array.prototype.slice.call(arguments, 0);
      let expected = args.slice(0);
      let message = '';

      args.unshift(this.actual);

      const matcher = matcherFactory(this.util, this.customEqualityTesters);
      let matcherCompare = matcher.compare;

      function defaultNegativeCompare() {
        const result = matcher.compare.apply(null, args);
        result.pass = !result.pass;
        return result;
      }

      if (this.isNot) {
        matcherCompare = matcher.negativeCompare || defaultNegativeCompare;
      }

      const result = matcherCompare.apply(null, args);

      if (!result.pass) {
        if (!result.message) {
          args.unshift(this.isNot);
          args.unshift(name);
          message = this.util.buildFailureMessage.apply(null, args);
        } else {
          message = result.message;
        }
      }

      if (expected.length == 1) {
        expected = expected[0];
      }

      // TODO: how many of these params are needed?
      this.addExpectationResult(result.pass, {
        matcherName: name,
        passed: result.pass,
        message,
        actual: this.actual,
        expected, // TODO: this may need to be arrayified/sliced
      });
    };
  };

  Expectation.addCoreMatchers = function (matchers) {
    const prototype = Expectation.prototype;
    for (const matcherName in matchers) {
      const matcher = matchers[matcherName];
      prototype[matcherName] = prototype.wrapCompare(matcherName, matcher);
    }
  };

  Expectation.addMatchers = function (matchersToAdd) {
    for (const name in matchersToAdd) {
      const matcher = matchersToAdd[name];
      matchers[name] = Expectation.prototype.wrapCompare(name, matcher);
    }
  };

  Expectation.resetMatchers = function () {
    for (const name in matchers) {
      delete matchers[name];
    }
  };

  Expectation.Factory = function (options) {
    options = options || {};

    const expect = new Expectation(options);

    // TODO: this would be nice as its own Object - NegativeExpectation
    // TODO: copy instead of mutate options
    options.isNot = true;
    expect.not = new Expectation(options);

    return expect;
  };

  return Expectation;
};

// TODO: expectation result may make more sense as a presentation of an expectation.
getJasmineRequireObj().buildExpectationResult = function () {
  function buildExpectationResult(options) {
    const messageFormatter = options.messageFormatter || function () {};
    const stackFormatter = options.stackFormatter || function () {};

    return {
      matcherName: options.matcherName,
      expected: options.expected,
      actual: options.actual,
      message: message(),
      stack: stack(),
      passed: options.passed,
    };

    function message() {
      if (options.passed) {
        return 'Passed.';
      } else if (options.message) {
        return options.message;
      } else if (options.error) {
        return messageFormatter(options.error);
      }
      return '';
    }

    function stack() {
      if (options.passed) {
        return '';
      }

      let error = options.error;
      if (!error) {
        try {
          throw new Error(message());
        } catch (e) {
          error = e;
        }
      }
      return stackFormatter(error);
    }
  }

  return buildExpectationResult;
};

getJasmineRequireObj().ObjectContaining = function (j$) {
  function ObjectContaining(sample) {
    this.sample = sample;
  }

  ObjectContaining.prototype.jasmineMatches = function (
    other,
    mismatchKeys,
    mismatchValues
  ) {
    if (typeof this.sample !== 'object') {
      throw new TypeError(
        "You must provide an object to objectContaining, not '" +
          this.sample +
          "'."
      );
    }

    mismatchKeys = mismatchKeys || [];
    mismatchValues = mismatchValues || [];

    const hasKey = function (obj, keyName) {
      return obj !== null && !j$.util.isUndefined(obj[keyName]);
    };

    for (const property in this.sample) {
      if (!hasKey(other, property) && hasKey(this.sample, property)) {
        mismatchKeys.push(
          "expected has key '" + property + "', but missing from actual."
        );
      } else if (
        !j$.matchersUtil.equals(this.sample[property], other[property])
      ) {
        mismatchValues.push(
          "'" +
            property +
            "' was '" +
            (other[property]
              ? j$.util.htmlEscape(other[property].toString())
              : other[property]) +
            "' in actual, but was '" +
            (this.sample[property]
              ? j$.util.htmlEscape(this.sample[property].toString())
              : this.sample[property]) +
            "' in expected."
        );
      }
    }

    return mismatchKeys.length === 0 && mismatchValues.length === 0;
  };

  ObjectContaining.prototype.jasmineToString = function () {
    return '<jasmine.objectContaining(' + j$.pp(this.sample) + ')>';
  };

  return ObjectContaining;
};

getJasmineRequireObj().pp = function (j$) {
  function PrettyPrinter() {
    this.ppNestLevel_ = 0;
  }

  PrettyPrinter.prototype.format = function (value) {
    this.ppNestLevel_++;
    try {
      if (j$.util.isUndefined(value)) {
        this.emitScalar('undefined');
      } else if (value === null) {
        this.emitScalar('null');
      } else if (value === j$.getGlobal()) {
        this.emitScalar('<global>');
      } else if (value.jasmineToString) {
        this.emitScalar(value.jasmineToString());
      } else if (typeof value === 'string') {
        this.emitString(value);
      } else if (j$.isSpy(value)) {
        this.emitScalar('spy on ' + value.and.identity());
      } else if (value instanceof RegExp) {
        this.emitScalar(value.toString());
      } else if (typeof value === 'function') {
        this.emitScalar('Function');
      } else if (typeof value.nodeType === 'number') {
        this.emitScalar('HTMLNode');
      } else if (value instanceof Date) {
        this.emitScalar('Date(' + value + ')');
      } else if (value.__Jasmine_been_here_before__) {
        this.emitScalar(
          '<circular reference: ' +
            (j$.isArray_(value) ? 'Array' : 'Object') +
            '>'
        );
      } else if (j$.isArray_(value) || j$.isA_('Object', value)) {
        value.__Jasmine_been_here_before__ = true;
        if (j$.isArray_(value)) {
          this.emitArray(value);
        } else {
          this.emitObject(value);
        }
        delete value.__Jasmine_been_here_before__;
      } else {
        this.emitScalar(value.toString());
      }
    } finally {
      this.ppNestLevel_--;
    }
  };

  PrettyPrinter.prototype.iterateObject = function (obj, fn) {
    for (const property in obj) {
      if (!obj.hasOwnProperty(property)) {
        continue;
      }
      if (property == '__Jasmine_been_here_before__') {
        continue;
      }
      fn(
        property,
        obj.__lookupGetter__
          ? !j$.util.isUndefined(obj.__lookupGetter__(property)) &&
              obj.__lookupGetter__(property) !== null
          : false
      );
    }
  };

  PrettyPrinter.prototype.emitArray = j$.unimplementedMethod_;
  PrettyPrinter.prototype.emitObject = j$.unimplementedMethod_;
  PrettyPrinter.prototype.emitScalar = j$.unimplementedMethod_;
  PrettyPrinter.prototype.emitString = j$.unimplementedMethod_;

  function StringPrettyPrinter() {
    PrettyPrinter.call(this);

    this.string = '';
  }

  j$.util.inherit(StringPrettyPrinter, PrettyPrinter);

  StringPrettyPrinter.prototype.emitScalar = function (value) {
    this.append(value);
  };

  StringPrettyPrinter.prototype.emitString = function (value) {
    this.append("'" + value + "'");
  };

  StringPrettyPrinter.prototype.emitArray = function (array) {
    if (this.ppNestLevel_ > j$.MAX_PRETTY_PRINT_DEPTH) {
      this.append('Array');
      return;
    }

    this.append('[ ');
    for (let i = 0; i < array.length; i++) {
      if (i > 0) {
        this.append(', ');
      }
      this.format(array[i]);
    }
    this.append(' ]');
  };

  StringPrettyPrinter.prototype.emitObject = function (obj) {
    if (this.ppNestLevel_ > j$.MAX_PRETTY_PRINT_DEPTH) {
      this.append('Object');
      return;
    }

    const self = this;
    this.append('{ ');
    let first = true;

    this.iterateObject(obj, function (property, isGetter) {
      if (first) {
        first = false;
      } else {
        self.append(', ');
      }

      self.append(property);
      self.append(' : ');
      if (isGetter) {
        self.append('<getter>');
      } else {
        self.format(obj[property]);
      }
    });

    this.append(' }');
  };

  StringPrettyPrinter.prototype.append = function (value) {
    this.string += value;
  };

  return function (value) {
    const stringPrettyPrinter = new StringPrettyPrinter();
    stringPrettyPrinter.format(value);
    return stringPrettyPrinter.string;
  };
};

getJasmineRequireObj().QueueRunner = function () {
  function QueueRunner(attrs) {
    this.fns = attrs.fns || [];
    this.onComplete = attrs.onComplete || function () {};
    this.clearStack =
      attrs.clearStack ||
      function (fn) {
        fn();
      };
    this.onException = attrs.onException || function () {};
    this.catchException =
      attrs.catchException ||
      function () {
        return true;
      };
    this.userContext = {};
  }

  QueueRunner.prototype.execute = function () {
    this.run(this.fns, 0);
  };

  QueueRunner.prototype.run = function (fns, recursiveIndex) {
    const length = fns.length;
    const self = this;
    let iterativeIndex;

    for (
      iterativeIndex = recursiveIndex;
      iterativeIndex < length;
      iterativeIndex++
    ) {
      const fn = fns[iterativeIndex];
      if (fn.length > 0) {
        return attemptAsync(fn);
      } else {
        attemptSync(fn);
      }
    }

    const runnerDone = iterativeIndex >= length;

    if (runnerDone) {
      this.clearStack(this.onComplete);
    }

    function attemptSync(fn) {
      try {
        fn.call(self.userContext);
      } catch (e) {
        handleException(e);
      }
    }

    function attemptAsync(fn) {
      const next = function () {
        self.run(fns, iterativeIndex + 1);
      };

      try {
        fn.call(self.userContext, next);
      } catch (e) {
        handleException(e);
        next();
      }
    }

    function handleException(e) {
      self.onException(e);
      if (!self.catchException(e)) {
        // TODO: set a var when we catch an exception and
        // use a finally block to close the loop in a nice way..
        throw e;
      }
    }
  };

  return QueueRunner;
};

getJasmineRequireObj().ReportDispatcher = function () {
  function ReportDispatcher(methods) {
    const dispatchedMethods = methods || [];

    for (let i = 0; i < dispatchedMethods.length; i++) {
      const method = dispatchedMethods[i];
      this[method] = (function (m) {
        return function () {
          dispatch(m, arguments);
        };
      })(method);
    }

    const reporters = [];

    this.addReporter = function (reporter) {
      reporters.push(reporter);
    };

    return this;

    function dispatch(method, args) {
      for (let i = 0; i < reporters.length; i++) {
        const reporter = reporters[i];
        if (reporter[method]) {
          reporter[method].apply(reporter, args);
        }
      }
    }
  }

  return ReportDispatcher;
};

getJasmineRequireObj().SpyStrategy = function () {
  function SpyStrategy(options) {
    options = options || {};

    const identity = options.name || 'unknown';
    const originalFn = options.fn || function () {};
    const getSpy = options.getSpy || function () {};
    let plan = function () {};

    this.identity = function () {
      return identity;
    };

    this.exec = function () {
      return plan.apply(this, arguments);
    };

    this.callThrough = function () {
      plan = originalFn;
      return getSpy();
    };

    this.returnValue = function (value) {
      plan = function () {
        return value;
      };
      return getSpy();
    };

    this.throwError = function (something) {
      const error =
        something instanceof Error ? something : new Error(something);
      plan = function () {
        throw error;
      };
      return getSpy();
    };

    this.callFake = function (fn) {
      plan = fn;
      return getSpy();
    };

    this.stub = function (fn) {
      plan = function () {};
      return getSpy();
    };
  }

  return SpyStrategy;
};

getJasmineRequireObj().Suite = function () {
  function Suite(attrs) {
    this.env = attrs.env;
    this.id = attrs.id;
    this.parentSuite = attrs.parentSuite;
    this.description = attrs.description;
    this.onStart = attrs.onStart || function () {};
    this.resultCallback = attrs.resultCallback || function () {};
    this.clearStack =
      attrs.clearStack ||
      function (fn) {
        fn();
      };

    this.beforeFns = [];
    this.afterFns = [];
    this.queueRunner = attrs.queueRunner || function () {};
    this.disabled = false;

    this.children = [];

    this.result = {
      id: this.id,
      status: this.disabled ? 'disabled' : '',
      description: this.description,
      fullName: this.getFullName(),
    };
  }

  Suite.prototype.getFullName = function () {
    let fullName = this.description;
    for (
      let parentSuite = this.parentSuite;
      parentSuite;
      parentSuite = parentSuite.parentSuite
    ) {
      if (parentSuite.parentSuite) {
        fullName = parentSuite.description + ' ' + fullName;
      }
    }
    return fullName;
  };

  Suite.prototype.disable = function () {
    this.disabled = true;
  };

  Suite.prototype.beforeEach = function (fn) {
    this.beforeFns.unshift(fn);
  };

  Suite.prototype.afterEach = function (fn) {
    this.afterFns.unshift(fn);
  };

  Suite.prototype.addChild = function (child) {
    this.children.push(child);
  };

  Suite.prototype.execute = function (onComplete) {
    const self = this;
    if (this.disabled) {
      complete();
      return;
    }

    const allFns = [];

    for (let i = 0; i < this.children.length; i++) {
      allFns.push(wrapChildAsAsync(this.children[i]));
    }

    this.onStart(this);

    this.queueRunner({
      fns: allFns,
      onComplete: complete,
    });

    function complete() {
      self.resultCallback(self.result);

      if (onComplete) {
        onComplete();
      }
    }

    function wrapChildAsAsync(child) {
      return function (done) {
        child.execute(done);
      };
    }
  };

  return Suite;
};

if (typeof window === void 0 && typeof exports === 'object') {
  exports.Suite = jasmineRequire.Suite;
}

getJasmineRequireObj().Timer = function () {
  function Timer(options) {
    options = options || {};

    const now =
      options.now ||
      function () {
        return new Date().getTime();
      };
    let startTime;

    this.start = function () {
      startTime = now();
    };

    this.elapsed = function () {
      return now() - startTime;
    };
  }

  return Timer;
};

getJasmineRequireObj().matchersUtil = function (j$) {
  // TODO: what to do about jasmine.pp not being inject? move to JSON.stringify? gut PrettyPrinter?

  return {
    equals(a, b, customTesters) {
      customTesters = customTesters || [];

      return eq(a, b, [], [], customTesters);
    },

    contains(haystack, needle, customTesters) {
      customTesters = customTesters || [];

      if (Object.prototype.toString.apply(haystack) === '[object Array]') {
        for (let i = 0; i < haystack.length; i++) {
          if (eq(haystack[i], needle, [], [], customTesters)) {
            return true;
          }
        }
        return false;
      }
      return haystack.includes(needle);
    },

    buildFailureMessage() {
      const args = Array.prototype.slice.call(arguments, 0);
      const matcherName = args[0];
      const isNot = args[1];
      const actual = args[2];
      const expected = args.slice(3);
      const englishyPredicate = matcherName.replace(/[A-Z]/g, function (s) {
        return ' ' + s.toLowerCase();
      });

      let message =
        'Expected ' +
        j$.pp(actual) +
        (isNot ? ' not ' : ' ') +
        englishyPredicate;

      if (expected.length > 0) {
        for (let i = 0; i < expected.length; i++) {
          if (i > 0) {
            message += ',';
          }
          message += ' ' + j$.pp(expected[i]);
        }
      }

      return message + '.';
    },
  };

  // Equality function lovingly adapted from isEqual in
  //   [Underscore](http://underscorejs.org)
  function eq(a, b, aStack, bStack, customTesters) {
    let result = true;

    for (let i = 0; i < customTesters.length; i++) {
      const customTesterResult = customTesters[i](a, b);
      if (!j$.util.isUndefined(customTesterResult)) {
        return customTesterResult;
      }
    }

    if (a instanceof j$.Any) {
      result = a.jasmineMatches(b);
      if (result) {
        return true;
      }
    }

    if (b instanceof j$.Any) {
      result = b.jasmineMatches(a);
      if (result) {
        return true;
      }
    }

    if (b instanceof j$.ObjectContaining) {
      result = b.jasmineMatches(a);
      if (result) {
        return true;
      }
    }

    if (a instanceof Error && b instanceof Error) {
      return a.message == b.message;
    }

    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) {
      return a !== 0 || 1 / a == 1 / b;
    }
    // A strict comparison is necessary because `null == undefined`.
    if (a === null || b === null) {
      return a === b;
    }
    const className = Object.prototype.toString.call(a);
    if (className != Object.prototype.toString.call(b)) {
      return false;
    }
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : a === 0 ? 1 / a == 1 / b : a == +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return (
          a.source == b.source &&
          a.global == b.global &&
          a.multiline == b.multiline &&
          a.ignoreCase == b.ignoreCase
        );
    }
    if (typeof a !== 'object' || typeof b !== 'object') {
      return false;
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    let length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) {
        return bStack[length] == b;
      }
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    let size = 0;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack, customTesters))) {
            break;
          }
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      const aCtor = a.constructor;
      const bCtor = b.constructor;
      if (
        aCtor !== bCtor &&
        !(
          isFunction(aCtor) &&
          aCtor instanceof aCtor &&
          isFunction(bCtor) &&
          bCtor instanceof bCtor
        )
      ) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (
            !(result =
              has(b, key) && eq(a[key], b[key], aStack, bStack, customTesters))
          ) {
            break;
          }
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (has(b, key) && !size--) {
            break;
          }
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();

    return result;

    function has(obj, key) {
      return obj.hasOwnProperty(key);
    }

    function isFunction(obj) {
      return typeof obj === 'function';
    }
  }
};

getJasmineRequireObj().toBe = function () {
  function toBe() {
    return {
      compare(actual, expected) {
        return {
          pass: actual === expected,
        };
      },
    };
  }

  return toBe;
};

getJasmineRequireObj().toBeCloseTo = function () {
  function toBeCloseTo() {
    return {
      compare(actual, expected, precision) {
        if (precision !== 0) {
          precision = precision || 2;
        }

        return {
          pass: Math.abs(expected - actual) < Math.pow(10, -precision) / 2,
        };
      },
    };
  }

  return toBeCloseTo;
};

getJasmineRequireObj().toBeDefined = function () {
  function toBeDefined() {
    return {
      compare(actual) {
        return {
          pass: void 0 !== actual,
        };
      },
    };
  }

  return toBeDefined;
};

getJasmineRequireObj().toBeFalsy = function () {
  function toBeFalsy() {
    return {
      compare(actual) {
        return {
          pass: !actual,
        };
      },
    };
  }

  return toBeFalsy;
};

getJasmineRequireObj().toBeGreaterThan = function () {
  function toBeGreaterThan() {
    return {
      compare(actual, expected) {
        return {
          pass: actual > expected,
        };
      },
    };
  }

  return toBeGreaterThan;
};

getJasmineRequireObj().toBeLessThan = function () {
  function toBeLessThan() {
    return {
      compare(actual, expected) {
        return {
          pass: actual < expected,
        };
      },
    };
  }

  return toBeLessThan;
};
getJasmineRequireObj().toBeNaN = function (j$) {
  function toBeNaN() {
    return {
      compare(actual) {
        const result = {
          pass: actual !== actual,
        };

        if (result.pass) {
          result.message = 'Expected actual not to be NaN.';
        } else {
          result.message = 'Expected ' + j$.pp(actual) + ' to be NaN.';
        }

        return result;
      },
    };
  }

  return toBeNaN;
};

getJasmineRequireObj().toBeNull = function () {
  function toBeNull() {
    return {
      compare(actual) {
        return {
          pass: actual === null,
        };
      },
    };
  }

  return toBeNull;
};

getJasmineRequireObj().toBeTruthy = function () {
  function toBeTruthy() {
    return {
      compare(actual) {
        return {
          pass: !!actual,
        };
      },
    };
  }

  return toBeTruthy;
};

getJasmineRequireObj().toBeUndefined = function () {
  function toBeUndefined() {
    return {
      compare(actual) {
        return {
          pass: void 0 === actual,
        };
      },
    };
  }

  return toBeUndefined;
};

getJasmineRequireObj().toContain = function () {
  function toContain(util, customEqualityTesters) {
    customEqualityTesters = customEqualityTesters || [];

    return {
      compare(actual, expected) {
        return {
          pass: util.contains(actual, expected, customEqualityTesters),
        };
      },
    };
  }

  return toContain;
};

getJasmineRequireObj().toEqual = function () {
  function toEqual(util, customEqualityTesters) {
    customEqualityTesters = customEqualityTesters || [];

    return {
      compare(actual, expected) {
        const result = {
          pass: false,
        };

        result.pass = util.equals(actual, expected, customEqualityTesters);

        return result;
      },
    };
  }

  return toEqual;
};

getJasmineRequireObj().toHaveBeenCalled = function (j$) {
  function toHaveBeenCalled() {
    return {
      compare(actual) {
        const result = {};

        if (!j$.isSpy(actual)) {
          throw new Error('Expected a spy, but got ' + j$.pp(actual) + '.');
        }

        if (arguments.length > 1) {
          throw new Error(
            'toHaveBeenCalled does not take arguments, use toHaveBeenCalledWith'
          );
        }

        result.pass = actual.calls.any();

        result.message = result.pass
          ? 'Expected spy ' +
            actual.and.identity() +
            ' not to have been called.'
          : 'Expected spy ' + actual.and.identity() + ' to have been called.';

        return result;
      },
    };
  }

  return toHaveBeenCalled;
};

getJasmineRequireObj().toHaveBeenCalledWith = function (j$) {
  function toHaveBeenCalledWith(util) {
    return {
      compare() {
        const args = Array.prototype.slice.call(arguments, 0);
        const actual = args[0];
        const expectedArgs = args.slice(1);
        const result = { pass: false };

        if (!j$.isSpy(actual)) {
          throw new Error('Expected a spy, but got ' + j$.pp(actual) + '.');
        }

        if (!actual.calls.any()) {
          result.message =
            'Expected spy ' +
            actual.and.identity() +
            ' to have been called with ' +
            j$.pp(expectedArgs) +
            ' but it was never called.';
          return result;
        }

        if (util.contains(actual.calls.allArgs(), expectedArgs)) {
          result.pass = true;
          result.message =
            'Expected spy ' +
            actual.and.identity() +
            ' not to have been called with ' +
            j$.pp(expectedArgs) +
            ' but it was.';
        } else {
          result.message =
            'Expected spy ' +
            actual.and.identity() +
            ' to have been called with ' +
            j$.pp(expectedArgs) +
            ' but actual calls were ' +
            j$.pp(actual.calls.allArgs()).replace(/^\[ | \]$/g, '') +
            '.';
        }

        return result;
      },
    };
  }

  return toHaveBeenCalledWith;
};

getJasmineRequireObj().toMatch = function () {
  function toMatch() {
    return {
      compare(actual, expected) {
        const regexp = new RegExp(expected);

        return {
          pass: regexp.test(actual),
        };
      },
    };
  }

  return toMatch;
};

getJasmineRequireObj().toThrow = function (j$) {
  function toThrow(util) {
    return {
      compare(actual, expected) {
        const result = { pass: false };
        let threw = false;
        let thrown;

        if (typeof actual !== 'function') {
          throw new TypeError('Actual is not a Function');
        }

        try {
          actual();
        } catch (e) {
          threw = true;
          thrown = e;
        }

        if (!threw) {
          result.message = 'Expected function to throw an exception.';
          return result;
        }

        if (arguments.length == 1) {
          result.pass = true;
          result.message =
            'Expected function not to throw, but it threw ' +
            j$.pp(thrown) +
            '.';

          return result;
        }

        if (util.equals(thrown, expected)) {
          result.pass = true;
          result.message =
            'Expected function not to throw ' + j$.pp(expected) + '.';
        } else {
          result.message =
            'Expected function to throw ' +
            j$.pp(expected) +
            ', but it threw ' +
            j$.pp(thrown) +
            '.';
        }

        return result;
      },
    };
  }

  return toThrow;
};

getJasmineRequireObj().toThrowError = function (j$) {
  function toThrowError(util) {
    return {
      compare(actual) {
        let threw = false;
        let thrown;
        let errorType;
        let message;
        let regexp;
        let name;
        let constructorName;

        if (typeof actual !== 'function') {
          throw new TypeError('Actual is not a Function');
        }

        extractExpectedParams.apply(null, arguments);

        try {
          actual();
        } catch (e) {
          threw = true;
          thrown = e;
        }

        if (!threw) {
          return fail('Expected function to throw an Error.');
        }

        if (!(thrown instanceof Error)) {
          return fail(
            'Expected function to throw an Error, but it threw ' + thrown + '.'
          );
        }

        if (arguments.length == 1) {
          return pass(
            'Expected function not to throw an Error, but it threw ' +
              fnNameFor(thrown) +
              '.'
          );
        }

        if (errorType) {
          name = fnNameFor(errorType);
          constructorName = fnNameFor(thrown.constructor);
        }

        if (errorType && message) {
          if (
            thrown.constructor == errorType &&
            util.equals(thrown.message, message)
          ) {
            return pass(
              'Expected function not to throw ' +
                name +
                ' with message "' +
                message +
                '".'
            );
          } else {
            return fail(
              'Expected function to throw ' +
                name +
                ' with message "' +
                message +
                '", but it threw ' +
                constructorName +
                ' with message "' +
                thrown.message +
                '".'
            );
          }
        }

        if (errorType && regexp) {
          if (thrown.constructor == errorType && regexp.test(thrown.message)) {
            return pass(
              'Expected function not to throw ' +
                name +
                ' with message matching ' +
                regexp +
                '.'
            );
          } else {
            return fail(
              'Expected function to throw ' +
                name +
                ' with message matching ' +
                regexp +
                ', but it threw ' +
                constructorName +
                ' with message "' +
                thrown.message +
                '".'
            );
          }
        }

        if (errorType) {
          if (thrown.constructor == errorType) {
            return pass('Expected function not to throw ' + name + '.');
          } else {
            return fail(
              'Expected function to throw ' +
                name +
                ', but it threw ' +
                constructorName +
                '.'
            );
          }
        }

        if (message) {
          if (thrown.message == message) {
            return pass(
              'Expected function not to throw an exception with message ' +
                j$.pp(message) +
                '.'
            );
          } else {
            return fail(
              'Expected function to throw an exception with message ' +
                j$.pp(message) +
                ', but it threw an exception with message ' +
                j$.pp(thrown.message) +
                '.'
            );
          }
        }

        if (regexp) {
          if (regexp.test(thrown.message)) {
            return pass(
              'Expected function not to throw an exception with a message matching ' +
                j$.pp(regexp) +
                '.'
            );
          } else {
            return fail(
              'Expected function to throw an exception with a message matching ' +
                j$.pp(regexp) +
                ', but it threw an exception with message ' +
                j$.pp(thrown.message) +
                '.'
            );
          }
        }

        function fnNameFor(func) {
          return (
            func.name || func.toString().match(/^\s*function\s*(\w*)\s*\(/)[1]
          );
        }

        function pass(notMessage) {
          return {
            pass: true,
            message: notMessage,
          };
        }

        function fail(message) {
          return {
            pass: false,
            message,
          };
        }

        function extractExpectedParams() {
          if (arguments.length == 1) {
            return;
          }

          if (arguments.length == 2) {
            const expected = arguments[1];

            if (expected instanceof RegExp) {
              regexp = expected;
            } else if (typeof expected === 'string') {
              message = expected;
            } else if (checkForAnErrorType(expected)) {
              errorType = expected;
            }

            if (!(errorType || message || regexp)) {
              throw new Error('Expected is not an Error, string, or RegExp.');
            }
          } else {
            if (checkForAnErrorType(arguments[1])) {
              errorType = arguments[1];
            } else {
              throw new Error('Expected error type is not an Error.');
            }

            if (arguments[2] instanceof RegExp) {
              regexp = arguments[2];
            } else if (typeof arguments[2] === 'string') {
              message = arguments[2];
            } else {
              throw new TypeError(
                'Expected error message is not a string or RegExp.'
              );
            }
          }
        }

        function checkForAnErrorType(type) {
          if (typeof type !== 'function') {
            return false;
          }

          const Surrogate = function () {};
          Surrogate.prototype = type.prototype;
          return new Surrogate() instanceof Error;
        }
      },
    };
  }

  return toThrowError;
};

getJasmineRequireObj().version = function () {
  return '2.0.0';
};
