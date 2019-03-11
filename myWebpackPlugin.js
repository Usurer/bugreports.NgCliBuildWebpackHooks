var MyWebpackPlugin = module.exports = function() {};

MyWebpackPlugin.prototype.compilationDone = function(stats) {
    console.log('Errors:');
    console.info(stats.compilation.errors);
};

MyWebpackPlugin.prototype.apply = function(compiler) {
  if (compiler.hooks) {
    var plugin = { name: 'My Plugin' };

    compiler.hooks.done.tap(plugin, this.compilationDone.bind(this));
  } else {
    compiler.plugin('done', this.compilationDone.bind(this));
  }
};