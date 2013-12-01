// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);
var url = require('url');
var async = require('async');

// END WEIRD NKO CODE (?)

var consolidate = require('consolidate'),
    express = require('express'),
    swig = require('swig'),
    dynoSrc = require('dynosrc'),
    git = dynoSrc.git,
    _ = require('underscore'),
    marked = require('marked'),
    fs = require('fs'),
    app = express();

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
});

// BEGIN DYNOSOURCE CONFIG
dynoSrc.globals({
  assetsDir: __dirname + '/assets'
});
app.use(dynoSrc.middleware());

dynoSrc.assets({
  'ryanstevens/ModelFlow': {
    filename: 'package.json',
    source: 'git',
    head: '8050f1'
  },
  'jquery': {
    head: '1.9.1',
    source: 'asset'
  },
  'backbone-min': {
    head: '1.0.0',
    source: 'asset'
  },
  'home': {
    head: '0.0.1',
    source: 'asset'
  },
  // for dynoProxy tests - do not remove
  'proxy': {
    head: '0.0.1',
    source: 'asset'
  },
  'water': {
    head: '0.0.1',
    source: 'asset'
  },
  'leash': {
    head: '0.0.1',
    source: 'asset'
  }
});
// END DYNOSOURCE


app.use('/img', express.static(__dirname + '/src/img'));
app.use('/js', express.static(__dirname + '/src/js'));
app.use('/css', express.static(__dirname + '/build/css'));
app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/build/html');

// Wtf is wrong with swig? This works locally, but not when we deploy.
swig.setDefaults({ cache: false });

swig.setFilter('scriptsafe', function (input) {
  return input.replace(/\r?\n/gm, '\\n').replace(/(['"])/gm, '\\$1');
});

function serveAnimal(animal, res) {
  fs.createReadStream(__dirname + '/'+animal+'/index.html').pipe(res);
}

app.get('/', function (req, res) {
  var subdomain = req.get('host').split('.')[0].toLowerCase();
  if (subdomain === 'dogs') return serveAnimal('dogs', res);
  if (subdomain === 'cats') return serveAnimal('cats', res);

  dynoSrc.getPatches(req, {
    patches: ['jquery', 'home']
  }, function(err, patches) {
    // Notice that we're setting cache:false here, hack to work around server
    // issues. But this seems to have no effect locally, have to use the
    // setDefaults call above.
    res.render('home.html', {
      title: 'Home',
      patches: patches,
      cache: false
    });
  });
});

app.get('/testdrive', function (req, res) {
  res.render('testdrive.html', {
    title: 'Test Drive',
    cache: false
  });
});

app.get('/credits', function (req, res) {
  res.render('credits.html', {
    title: 'Credits',
    cache: false
  });
});

app.get('/proxy-demo', function (req, res) {
  res.render('proxy-demo.html', {
    title: 'dynoProxy Demo',
    cache: false
  });
});

app.get('/getting-started', function (req, res) {

  dynoSrc.readMe(function(err, contentst) {
    marked(contentst, function(err, md) {
      res.render('getting-started.html', {
        title: 'Getting Started',
        readme : md,
        cache: false
      });
    });
  });
});

app.get('/git-clone', function(req, res) {

  var repo = git.getRepo('ModelFlow', 'ryanstevens');
  repo.clone().done(function(branch) {
    res.send(branch);
  });

});

app.get('/github/file', function(req, res) {

  var query = url.parse(req.url, true).query;
  git.getGitHubRaw(query.repo, query.file, query.hash, function(err, file) {
    fs.createReadStream(file).pipe(res);
  });

});

app.get('/github/diff', function(req, res) {

  var query = url.parse(req.url, true).query;
  console.log("Creating patch file from github ", query);
  async.parallel([
    function(next) {
      git.getGitHubRaw(query.repo, query.file, query.from, next);
    },
    function(next) {
      git.getGitHubRaw(query.repo, query.file, query.to, next);
    }
  ], function(err, files) {
    git.fileDiff(files[0], files[1]).pipe(res);
  });

});

app.get('/bower/diff', function(req, res) {

  var query = url.parse(req.url, true).query;
  console.log("Creating patch file ", query);
  async.parallel([
    function(next) {
      git.getGitHubRaw(query.repo, query.file, query.from, next);
    },
    function(next) {
      git.getGitHubRaw(query.repo, query.file, query.to, next);
    }
  ], function(err, files) {
    git.fileDiff(files[0], files[1]).pipe(res);
  });

});

app.listen(port);

console.log('Running server on port %s.', port);
