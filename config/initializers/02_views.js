

module.exports = function() {
  var env = this.env;
  //Dot engine loader
  var doT = require('express-dot');
  var dir = process.cwd() + '/app/views/';
  this.set('views', dir);
  this.set('view engine', 'dot');
  // Register Dot as a template engine.
  this.engine('dot', doT.__express);
  
  //file loader inside of views
  doT.setGlobals({
    loadfile:function(path){return require('fs').readFileSync(dir + path, 'utf8');}
  });
  
  //Less engine loader
  var fs      = require('fs');
  var less    = require('less');

  if(this.env == 'development' && false){
    fs.readFile(dir + '_styles/styles.less', function(err,styles) {
        console.log(__dirname);
        if(err) return console.error('Less MSG <> Could not open file: %s',err);
        less.render(styles.toString(), function(er,css) {
            if(er) return console.error(er);
            fs.writeFile(process.cwd() + '/public/css/default.css', css, function(e) {
                if(e) return console.error(e);
                console.log('Less MSG <> CSS Compiled');
            });
        });
    });
  }

  // Override default template extension.  By default, Locomotive finds
  // templates using the `name.format.engine` convention, for example
  // `index.html.ejs`  For some template engines, such as Jade, that find
  // layouts using a `layout.engine` notation, this results in mixed conventions
  // that can cause confusion.  If this occurs, you can map an explicit
  // extension to a format.
  /* this.format('html', { extension: '.jade' }) */

  // Register formats for content negotiation.  Using content negotiation,
  // different formats can be served as needed by different clients.  For
  // example, a browser is sent an HTML response, while an API client is sent a
  // JSON or XML response.
  /* this.format('xml', { engine: 'xmlb' }); */
}
