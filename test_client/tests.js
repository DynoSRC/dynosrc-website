module('DynoProxy');

var isPhantom = /phantom/.test(document.location.search);

asyncTest('Simple DynoProxy', isPhantom ? 3 : 5, function() {
  ok(typeof dynoProxy !== 'undefined', 'Got dynoProxy instance');
  ok(dynoProxy.init && dynoProxy.apply, 'dynoProxy has API');

  function restart() {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (! testOver) {
      start();
    }
  }

  function doScriptInjectTests() {
    dynoProxy.apply('proxy', '0.0.1', function() {
      equal(window.dynoProxy_test, '0.0.1', 'Script executed');
      
      dynoProxy.apply('proxy', '0.0.2', function() {
        equal(window.dynoProxy_test, '0.0.2', 'Script executed');
        
        restart();
      });
    });
  }

  var testOver = false,
    timeout = setTimeout(function() {
      ok(false, 'Timed out');
      start();
      testOver = true;
    }, 5000);

  dynoProxy.init({
    origin: 'http://localhost:8000',
    onStart: function() {
      ok(true, 'Established communication with proxy');
      
      if (isPhantom) {
        console.log('Skipping script injection tests. Phantom doesn\'t like');
        restart();
      } else {
        doScriptInjectTests();
      }
    }
  });
});