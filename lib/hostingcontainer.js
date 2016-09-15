// Load modules.
var path = require('canonical-path')
  , deprecate = require('depd')('electrolyte');

// TODO: Remove this file.

/**
 * Container wrapper used when initializing a source.
 *
 * When a source of objects is `use()`ed, it is given an opportunity to
 * initialize the hosting container.  This wrapper provides the interface to
 * perform initialization, and restricts inadvertent use of other functionality
 * in the wrapped container.
 *
 * @constructor
 * @api private
 */
function HostingContainer(c, source) {
  this._c = c;
  this._source = source;
}

/**
 * Add an object specification.
 *
 * This function is used by a source to add an object specification.
 *
 * By default, specifications are automatically loaded when an object is
 * created.  As such, there is typically no need to declare specifications
 * ahead of time.
 *
 * Higher-level frameworks implement support for auto-wiring objects and loading
 * plugins based on annotations.  In such cases, the specification is needed
 * prior to the object being created in order to introspect the annotations.
 * Sources can provide such specifications by calling this function.
 *
 * @constructor
 * @api public
 */
HostingContainer.prototype.add = function(id) {
  var aid = path.join(this._source.namespace, id)
    , mod = this._source.load(id);
  if (!mod) {
    throw new Error(id + ' not found in source');
  }
    
  this._c._registerSpec(aid, mod, this._source);
  return this;
}
HostingContainer.prototype.register = deprecate.function(HostingContainer.prototype.add, 'Container#register: Use Container#add instead');


// Expose constructor.
module.exports = HostingContainer;
