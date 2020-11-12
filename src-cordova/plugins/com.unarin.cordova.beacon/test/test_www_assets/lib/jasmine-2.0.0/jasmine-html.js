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
jasmineRequire.html = function (j$) {
  j$.ResultsNode = jasmineRequire.ResultsNode();
  j$.HtmlReporter = jasmineRequire.HtmlReporter(j$);
  j$.QueryString = jasmineRequire.QueryString();
  j$.HtmlSpecFilter = jasmineRequire.HtmlSpecFilter();
};

jasmineRequire.HtmlReporter = function (j$) {
  const noopTimer = {
    start() {},
    elapsed() {
      return 0;
    },
  };

  function HtmlReporter(options) {
    const env = options.env || {};
    const getContainer = options.getContainer;
    const createElement = options.createElement;
    const createTextNode = options.createTextNode;
    const onRaiseExceptionsClick =
      options.onRaiseExceptionsClick || function () {};
    const timer = options.timer || noopTimer;
    const results = [];
    let specsExecuted = 0;
    let failureCount = 0;
    let pendingSpecCount = 0;
    let htmlReporterMain;
    let symbols;

    this.initialize = function () {
      htmlReporterMain = createDom(
        'div',
        { className: 'html-reporter' },
        createDom(
          'div',
          { className: 'banner' },
          createDom('span', { className: 'title' }, 'Jasmine'),
          createDom('span', { className: 'version' }, j$.version)
        ),
        createDom('ul', { className: 'symbol-summary' }),
        createDom('div', { className: 'alert' }),
        createDom(
          'div',
          { className: 'results' },
          createDom('div', { className: 'failures' })
        )
      );
      getContainer().appendChild(htmlReporterMain);

      symbols = find('.symbol-summary');
    };

    let totalSpecsDefined;
    this.jasmineStarted = function (options) {
      totalSpecsDefined = options.totalSpecsDefined || 0;
      timer.start();
    };

    const summary = createDom('div', { className: 'summary' });

    const topResults = new j$.ResultsNode({}, '', null);
    let currentParent = topResults;

    this.suiteStarted = function (result) {
      currentParent.addChild(result, 'suite');
      currentParent = currentParent.last();
    };

    this.suiteDone = function (result) {
      if (currentParent == topResults) {
        return;
      }

      currentParent = currentParent.parent;
    };

    this.specStarted = function (result) {
      currentParent.addChild(result, 'spec');
    };

    const failures = [];
    this.specDone = function (result) {
      if (result.status != 'disabled') {
        specsExecuted++;
      }

      symbols.appendChild(
        createDom('li', {
          className: result.status,
          id: 'spec_' + result.id,
          title: result.fullName,
        })
      );

      if (result.status == 'failed') {
        failureCount++;

        const failure = createDom(
          'div',
          { className: 'spec-detail failed' },
          createDom(
            'div',
            { className: 'description' },
            createDom(
              'a',
              { title: result.fullName, href: specHref(result) },
              result.fullName
            )
          ),
          createDom('div', { className: 'messages' })
        );
        const messages = failure.childNodes[1];

        for (let i = 0; i < result.failedExpectations.length; i++) {
          const expectation = result.failedExpectations[i];
          messages.appendChild(
            createDom(
              'div',
              { className: 'result-message' },
              expectation.message
            )
          );
          messages.appendChild(
            createDom('div', { className: 'stack-trace' }, expectation.stack)
          );
        }

        failures.push(failure);
      }

      if (result.status == 'pending') {
        pendingSpecCount++;
      }
    };

    this.jasmineDone = function () {
      const banner = find('.banner');
      banner.appendChild(
        createDom(
          'span',
          { className: 'duration' },
          'finished in ' + timer.elapsed() / 1000 + 's'
        )
      );

      const alert = find('.alert');

      alert.appendChild(
        createDom(
          'span',
          { className: 'exceptions' },
          createDom(
            'label',
            { className: 'label', for: 'raise-exceptions' },
            'raise exceptions'
          ),
          createDom('input', {
            className: 'raise',
            id: 'raise-exceptions',
            type: 'checkbox',
          })
        )
      );
      const checkbox = find('input');

      checkbox.checked = !env.catchingExceptions();
      checkbox.onclick = onRaiseExceptionsClick;

      if (specsExecuted < totalSpecsDefined) {
        const skippedMessage =
          'Ran ' +
          specsExecuted +
          ' of ' +
          totalSpecsDefined +
          ' specs - run all';
        alert.appendChild(
          createDom(
            'span',
            { className: 'bar skipped' },
            createDom(
              'a',
              { href: '?', title: 'Run all specs' },
              skippedMessage
            )
          )
        );
      }
      let statusBarMessage =
        '' +
        pluralize('spec', specsExecuted) +
        ', ' +
        pluralize('failure', failureCount);
      if (pendingSpecCount) {
        statusBarMessage += ', ' + pluralize('pending spec', pendingSpecCount);
      }

      const statusBarClassName =
        'bar ' + (failureCount > 0 ? 'failed' : 'passed');
      alert.appendChild(
        createDom('span', { className: statusBarClassName }, statusBarMessage)
      );

      const results = find('.results');
      results.appendChild(summary);

      summaryList(topResults, summary);

      function summaryList(resultsTree, domParent) {
        let specListNode;
        for (let i = 0; i < resultsTree.children.length; i++) {
          const resultNode = resultsTree.children[i];
          if (resultNode.type == 'suite') {
            const suiteListNode = createDom(
              'ul',
              { className: 'suite', id: 'suite-' + resultNode.result.id },
              createDom(
                'li',
                { className: 'suite-detail' },
                createDom(
                  'a',
                  { href: specHref(resultNode.result) },
                  resultNode.result.description
                )
              )
            );

            summaryList(resultNode, suiteListNode);
            domParent.appendChild(suiteListNode);
          }
          if (resultNode.type == 'spec') {
            if (domParent.getAttribute('class') != 'specs') {
              specListNode = createDom('ul', { className: 'specs' });
              domParent.appendChild(specListNode);
            }
            specListNode.appendChild(
              createDom(
                'li',
                {
                  className: resultNode.result.status,
                  id: 'spec-' + resultNode.result.id,
                },
                createDom(
                  'a',
                  { href: specHref(resultNode.result) },
                  resultNode.result.description
                )
              )
            );
          }
        }
      }

      if (failures.length) {
        alert.appendChild(
          createDom(
            'span',
            { className: 'menu bar spec-list' },
            createDom('span', {}, 'Spec List | '),
            createDom(
              'a',
              { className: 'failures-menu', href: '#' },
              'Failures'
            )
          )
        );
        alert.appendChild(
          createDom(
            'span',
            { className: 'menu bar failure-list' },
            createDom(
              'a',
              { className: 'spec-list-menu', href: '#' },
              'Spec List'
            ),
            createDom('span', {}, ' | Failures ')
          )
        );

        find('.failures-menu').onclick = function () {
          setMenuModeTo('failure-list');
        };
        find('.spec-list-menu').onclick = function () {
          setMenuModeTo('spec-list');
        };

        setMenuModeTo('failure-list');

        const failureNode = find('.failures');
        for (let i = 0; i < failures.length; i++) {
          failureNode.appendChild(failures[i]);
        }
      }
    };

    return this;

    function find(selector) {
      return getContainer().querySelector(selector);
    }

    function createDom(type, attrs, childrenVarArgs) {
      const el = createElement(type);

      for (let i = 2; i < arguments.length; i++) {
        const child = arguments[i];

        if (typeof child === 'string') {
          el.appendChild(createTextNode(child));
        } else if (child) {
          el.appendChild(child);
        }
      }

      for (const attr in attrs) {
        if (attr == 'className') {
          el[attr] = attrs[attr];
        } else {
          el.setAttribute(attr, attrs[attr]);
        }
      }

      return el;
    }

    function pluralize(singular, count) {
      const word = count == 1 ? singular : singular + 's';

      return '' + count + ' ' + word;
    }

    function specHref(result) {
      return '?spec=' + encodeURIComponent(result.fullName);
    }

    function setMenuModeTo(mode) {
      htmlReporterMain.setAttribute('class', 'html-reporter ' + mode);
    }
  }

  return HtmlReporter;
};

jasmineRequire.HtmlSpecFilter = function () {
  function HtmlSpecFilter(options) {
    const filterString =
      options &&
      options.filterString() &&
      options.filterString().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const filterPattern = new RegExp(filterString);

    this.matches = function (specName) {
      return filterPattern.test(specName);
    };
  }

  return HtmlSpecFilter;
};

jasmineRequire.ResultsNode = function () {
  function ResultsNode(result, type, parent) {
    this.result = result;
    this.type = type;
    this.parent = parent;

    this.children = [];

    this.addChild = function (result, type) {
      this.children.push(new ResultsNode(result, type, this));
    };

    this.last = function () {
      return this.children[this.children.length - 1];
    };
  }

  return ResultsNode;
};

jasmineRequire.QueryString = function () {
  function QueryString(options) {
    this.setParam = function (key, value) {
      const paramMap = queryStringToParamMap();
      paramMap[key] = value;
      options.getWindowLocation().search = toQueryString(paramMap);
    };

    this.getParam = function (key) {
      return queryStringToParamMap()[key];
    };

    return this;

    function toQueryString(paramMap) {
      const qStrPairs = [];
      for (const prop in paramMap) {
        qStrPairs.push(
          encodeURIComponent(prop) + '=' + encodeURIComponent(paramMap[prop])
        );
      }
      return '?' + qStrPairs.join('&');
    }

    function queryStringToParamMap() {
      const paramStr = options.getWindowLocation().search.substring(1);
      let params = [];
      const paramMap = {};

      if (paramStr.length > 0) {
        params = paramStr.split('&');
        for (let i = 0; i < params.length; i++) {
          const p = params[i].split('=');
          let value = decodeURIComponent(p[1]);
          if (value === 'true' || value === 'false') {
            value = JSON.parse(value);
          }
          paramMap[decodeURIComponent(p[0])] = value;
        }
      }

      return paramMap;
    }
  }

  return QueryString;
};
