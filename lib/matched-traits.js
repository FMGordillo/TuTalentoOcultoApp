'use strict';

/**
 * Returns the big 5
 * @return Array  The 5 main traits
 */
var big5 = function(origin) {
  // origin = typeof (origin) === 'string' ? JSON.parse(origin) : origin;
  origin = typeof (origin) === 'string' ? JSON.parse(origin) : origin;
  // var origin_big5 = origin.tree.children[0].children[0].children,
  var origin_big5 = origin.personality,

    ret = [];

    origin_big5.forEach(function(trait) {
      ret.push({ name: trait.name, percentile: trait.percentile });
    });
    console.log(ret);
    return ret;
};

module.exports = big5;
