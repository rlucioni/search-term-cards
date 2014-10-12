//https://github.com/georgealways/url.js/blob/master/url.source.js
(function(url) {
    
  var result = {},
      hashLoc = url.indexOf('#');

  url.substring(url.indexOf('?')).replace(
    /([^?=&]+)(=([^&]+))?/g,
    function($0, $1, $2, $3) {
      result[$1] = decodeURIComponent($3);
    }
  );

  result['boolean'] = function(name, defaultValue) {
    if (!result.hasOwnProperty(name))
      return result.defaults[name] || defaultValue || false;
    return result[name] !== 'false';
  };

  result['float'] = function(name, defaultValue) {
    var r = parseFloat(result[name]);
    if (r != r) 
      return result.defaults[name] || defaultValue || 0;
    return r;
  };

  result['int'] = function(name, defaultValue) {
    var r = parseInt(result[name], 10);
    if (r != r) 
      return result.defaults[name] || defaultValue || 0;
    return r;
  };

  result['hash'] = hashLoc == -1 ? undefined : url.substring(hashLoc+1);

  result['setUrl'] = arguments.callee; 

  result['defaults'] = {};

  window['url'] = result;

})(location.href);