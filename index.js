// Get our requirements, installed by npm
var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    layouts     = require('metalsmith-layouts');
    discoverPartials = require('metalsmith-discover-partials');
    // liquid = require('metalsmith-liquid');
    permalinks = require('metalsmith-permalinks');
    directoryMetadata = require('metalsmith-directory-metadata');
    assets = require('metalsmith-assets');
    beautify = require('metalsmith-beautify');
    //brokenLinkChecker = require('metalsmith-broken-link-checker');
    collections = require('metalsmith-collections');
    watch = require('metalsmith-watch');
    sitemap = require('metalsmith-sitemap');
    helpers = require('metalsmith-register-helpers');
  //  serve = require('metalsmith-serve');


// Run Metalsmith in the current directory.
// When the .build() method runs, this reads
// and strips the frontmatter from each of our
// source files and passes it on to the plugins.
Metalsmith(__dirname)
    .use(directoryMetadata()) // metadata.yaml files spread defaults
    // .use(assets({
    //   source: './assets', // relative to the working directory
    //   destination: './assets' // relative to the build directory
    // }))
    // .use(watch())

    .use(collections({posts: {
        pattern: 'posts/*.md',
        sortBy: 'date',
        reverse: true
      }
    }

    )) // get all of the groups of posts - available by name now in templates
    .use(markdown())
    .use(discoverPartials()) // If you want partials (includes) to work
    .use(permalinks({
        unique: true,
        linksets: [
              {
                match: { collection: 'posts' },
                pattern: 'posts/:title',
              },
            ],
           unique: true
        }))
    .use(helpers({
      "directory": "./_helpers"
    }))
    // Put the HTML fragments from the step above
    // into our template, using the Frontmatter
    // properties as template variables.
    .use(layouts())
    // .use(brokenLinkChecker()) // checks for broken relative links
    .use(beautify()) // you know I like pretty posts - especially HTML
    // And tell Metalsmith to fire it all off.
    .use(sitemap({hostname: "https://theinformedcompany.com"}))
    // .use(serve())
    .build(function(err, files) {
        if (err) { throw err; }
    });
