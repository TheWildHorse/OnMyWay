(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

if (!L.mapbox) throw new Error('include mapbox.js before mapbox.directions.js');

L.mapbox.directions = require('./src/directions');
L.mapbox.directions.format = require('./src/format');
L.mapbox.directions.layer = require('./src/layer');
L.mapbox.directions.inputControl = require('./src/input_control');
L.mapbox.directions.errorsControl = require('./src/errors_control');
L.mapbox.directions.routesControl = require('./src/routes_control');
L.mapbox.directions.instructionsControl = require('./src/instructions_control');

},{"./src/directions":7,"./src/errors_control":8,"./src/format":9,"./src/input_control":10,"./src/instructions_control":11,"./src/layer":12,"./src/routes_control":14}],2:[function(require,module,exports){
!function(){
  var d3 = {version: "3.4.1"}; // semver
var d3_arraySlice = [].slice,
    d3_array = function(list) { return d3_arraySlice.call(list); }; // conversion for NodeLists

var d3_document = document,
    d3_documentElement = d3_document.documentElement,
    d3_window = window;

// Redefine d3_array if the browser doesn’t support slice-based conversion.
try {
  d3_array(d3_documentElement.childNodes)[0].nodeType;
} catch(e) {
  d3_array = function(list) {
    var i = list.length, array = new Array(i);
    while (i--) array[i] = list[i];
    return array;
  };
}
var d3_subclass = {}.__proto__?

// Until ECMAScript supports array subclassing, prototype injection works well.
function(object, prototype) {
  object.__proto__ = prototype;
}:

// And if your browser doesn't support __proto__, we'll use direct extension.
function(object, prototype) {
  for (var property in prototype) object[property] = prototype[property];
};

function d3_vendorSymbol(object, name) {
  if (name in object) return name;
  name = name.charAt(0).toUpperCase() + name.substring(1);
  for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
    var prefixName = d3_vendorPrefixes[i] + name;
    if (prefixName in object) return prefixName;
  }
}

var d3_vendorPrefixes = ["webkit", "ms", "moz", "Moz", "o", "O"];

function d3_selection(groups) {
  d3_subclass(groups, d3_selectionPrototype);
  return groups;
}

var d3_select = function(s, n) { return n.querySelector(s); },
    d3_selectAll = function(s, n) { return n.querySelectorAll(s); },
    d3_selectMatcher = d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")],
    d3_selectMatches = function(n, s) { return d3_selectMatcher.call(n, s); };

// Prefer Sizzle, if available.
if (typeof Sizzle === "function") {
  d3_select = function(s, n) { return Sizzle(s, n)[0] || null; };
  d3_selectAll = function(s, n) { return Sizzle.uniqueSort(Sizzle(s, n)); };
  d3_selectMatches = Sizzle.matchesSelector;
}

d3.selection = function() {
  return d3_selectionRoot;
};

var d3_selectionPrototype = d3.selection.prototype = [];


d3_selectionPrototype.select = function(selector) {
  var subgroups = [],
      subgroup,
      subnode,
      group,
      node;

  selector = d3_selection_selector(selector);

  for (var j = -1, m = this.length; ++j < m;) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroup.push(subnode = selector.call(node, node.__data__, i, j));
        if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_selector(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_select(selector, this);
  };
}

d3_selectionPrototype.selectAll = function(selector) {
  var subgroups = [],
      subgroup,
      node;

  selector = d3_selection_selectorAll(selector);

  for (var j = -1, m = this.length; ++j < m;) {
    for (var group = this[j], i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
        subgroup.parentNode = node;
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_selectorAll(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_selectAll(selector, this);
  };
}
var d3_nsPrefix = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

d3.ns = {
  prefix: d3_nsPrefix,
  qualify: function(name) {
    var i = name.indexOf(":"),
        prefix = name;
    if (i >= 0) {
      prefix = name.substring(0, i);
      name = name.substring(i + 1);
    }
    return d3_nsPrefix.hasOwnProperty(prefix)
        ? {space: d3_nsPrefix[prefix], local: name}
        : name;
  }
};

d3_selectionPrototype.attr = function(name, value) {
  if (arguments.length < 2) {

    // For attr(string), return the attribute value for the first node.
    if (typeof name === "string") {
      var node = this.node();
      name = d3.ns.qualify(name);
      return name.local
          ? node.getAttributeNS(name.space, name.local)
          : node.getAttribute(name);
    }

    // For attr(object), the object specifies the names and values of the
    // attributes to set or remove. The values may be functions that are
    // evaluated for each element.
    for (value in name) this.each(d3_selection_attr(value, name[value]));
    return this;
  }

  return this.each(d3_selection_attr(name, value));
};

function d3_selection_attr(name, value) {
  name = d3.ns.qualify(name);

  // For attr(string, null), remove the attribute with the specified name.
  function attrNull() {
    this.removeAttribute(name);
  }
  function attrNullNS() {
    this.removeAttributeNS(name.space, name.local);
  }

  // For attr(string, string), set the attribute with the specified name.
  function attrConstant() {
    this.setAttribute(name, value);
  }
  function attrConstantNS() {
    this.setAttributeNS(name.space, name.local, value);
  }

  // For attr(string, function), evaluate the function for each element, and set
  // or remove the attribute as appropriate.
  function attrFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttribute(name);
    else this.setAttribute(name, x);
  }
  function attrFunctionNS() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttributeNS(name.space, name.local);
    else this.setAttributeNS(name.space, name.local, x);
  }

  return value == null
      ? (name.local ? attrNullNS : attrNull) : (typeof value === "function"
      ? (name.local ? attrFunctionNS : attrFunction)
      : (name.local ? attrConstantNS : attrConstant));
}
function d3_collapse(s) {
  return s.trim().replace(/\s+/g, " ");
}
d3.requote = function(s) {
  return s.replace(d3_requote_re, "\\$&");
};

var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

d3_selectionPrototype.classed = function(name, value) {
  if (arguments.length < 2) {

    // For classed(string), return true only if the first node has the specified
    // class or classes. Note that even if the browser supports DOMTokenList, it
    // probably doesn't support it on SVG elements (which can be animated).
    if (typeof name === "string") {
      var node = this.node(),
          n = (name = d3_selection_classes(name)).length,
          i = -1;
      if (value = node.classList) {
        while (++i < n) if (!value.contains(name[i])) return false;
      } else {
        value = node.getAttribute("class");
        while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
      }
      return true;
    }

    // For classed(object), the object specifies the names of classes to add or
    // remove. The values may be functions that are evaluated for each element.
    for (value in name) this.each(d3_selection_classed(value, name[value]));
    return this;
  }

  // Otherwise, both a name and a value are specified, and are handled as below.
  return this.each(d3_selection_classed(name, value));
};

function d3_selection_classedRe(name) {
  return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
}

function d3_selection_classes(name) {
  return name.trim().split(/^|\s+/);
}

// Multiple class names are allowed (e.g., "foo bar").
function d3_selection_classed(name, value) {
  name = d3_selection_classes(name).map(d3_selection_classedName);
  var n = name.length;

  function classedConstant() {
    var i = -1;
    while (++i < n) name[i](this, value);
  }

  // When the value is a function, the function is still evaluated only once per
  // element even if there are multiple class names.
  function classedFunction() {
    var i = -1, x = value.apply(this, arguments);
    while (++i < n) name[i](this, x);
  }

  return typeof value === "function"
      ? classedFunction
      : classedConstant;
}

function d3_selection_classedName(name) {
  var re = d3_selection_classedRe(name);
  return function(node, value) {
    if (c = node.classList) return value ? c.add(name) : c.remove(name);
    var c = node.getAttribute("class") || "";
    if (value) {
      re.lastIndex = 0;
      if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
    } else {
      node.setAttribute("class", d3_collapse(c.replace(re, " ")));
    }
  };
}

d3_selectionPrototype.style = function(name, value, priority) {
  var n = arguments.length;
  if (n < 3) {

    // For style(object) or style(object, string), the object specifies the
    // names and values of the attributes to set or remove. The values may be
    // functions that are evaluated for each element. The optional string
    // specifies the priority.
    if (typeof name !== "string") {
      if (n < 2) value = "";
      for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
      return this;
    }

    // For style(string), return the computed style value for the first node.
    if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);

    // For style(string, string) or style(string, function), use the default
    // priority. The priority is ignored for style(string, null).
    priority = "";
  }

  // Otherwise, a name, value and priority are specified, and handled as below.
  return this.each(d3_selection_style(name, value, priority));
};

function d3_selection_style(name, value, priority) {

  // For style(name, null) or style(name, null, priority), remove the style
  // property with the specified name. The priority is ignored.
  function styleNull() {
    this.style.removeProperty(name);
  }

  // For style(name, string) or style(name, string, priority), set the style
  // property with the specified name, using the specified priority.
  function styleConstant() {
    this.style.setProperty(name, value, priority);
  }

  // For style(name, function) or style(name, function, priority), evaluate the
  // function for each element, and set or remove the style property as
  // appropriate. When setting, use the specified priority.
  function styleFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.style.removeProperty(name);
    else this.style.setProperty(name, x, priority);
  }

  return value == null
      ? styleNull : (typeof value === "function"
      ? styleFunction : styleConstant);
}

d3_selectionPrototype.property = function(name, value) {
  if (arguments.length < 2) {

    // For property(string), return the property value for the first node.
    if (typeof name === "string") return this.node()[name];

    // For property(object), the object specifies the names and values of the
    // properties to set or remove. The values may be functions that are
    // evaluated for each element.
    for (value in name) this.each(d3_selection_property(value, name[value]));
    return this;
  }

  // Otherwise, both a name and a value are specified, and are handled as below.
  return this.each(d3_selection_property(name, value));
};

function d3_selection_property(name, value) {

  // For property(name, null), remove the property with the specified name.
  function propertyNull() {
    delete this[name];
  }

  // For property(name, string), set the property with the specified name.
  function propertyConstant() {
    this[name] = value;
  }

  // For property(name, function), evaluate the function for each element, and
  // set or remove the property as appropriate.
  function propertyFunction() {
    var x = value.apply(this, arguments);
    if (x == null) delete this[name];
    else this[name] = x;
  }

  return value == null
      ? propertyNull : (typeof value === "function"
      ? propertyFunction : propertyConstant);
}

d3_selectionPrototype.text = function(value) {
  return arguments.length
      ? this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.textContent = v == null ? "" : v; } : value == null
      ? function() { this.textContent = ""; }
      : function() { this.textContent = value; })
      : this.node().textContent;
};

d3_selectionPrototype.html = function(value) {
  return arguments.length
      ? this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.innerHTML = v == null ? "" : v; } : value == null
      ? function() { this.innerHTML = ""; }
      : function() { this.innerHTML = value; })
      : this.node().innerHTML;
};

d3_selectionPrototype.append = function(name) {
  name = d3_selection_creator(name);
  return this.select(function() {
    return this.appendChild(name.apply(this, arguments));
  });
};

function d3_selection_creator(name) {
  return typeof name === "function" ? name
      : (name = d3.ns.qualify(name)).local ? function() { return this.ownerDocument.createElementNS(name.space, name.local); }
      : function() { return this.ownerDocument.createElementNS(this.namespaceURI, name); };
}

d3_selectionPrototype.insert = function(name, before) {
  name = d3_selection_creator(name);
  before = d3_selection_selector(before);
  return this.select(function() {
    return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
  });
};

// TODO remove(selector)?
// TODO remove(node)?
// TODO remove(function)?
d3_selectionPrototype.remove = function() {
  return this.each(function() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  });
};
function d3_class(ctor, properties) {
  try {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  } catch (e) {
    ctor.prototype = properties;
  }
}

d3.map = function(object) {
  var map = new d3_Map;
  if (object instanceof d3_Map) object.forEach(function(key, value) { map.set(key, value); });
  else for (var key in object) map.set(key, object[key]);
  return map;
};

function d3_Map() {}

d3_class(d3_Map, {
  has: d3_map_has,
  get: function(key) {
    return this[d3_map_prefix + key];
  },
  set: function(key, value) {
    return this[d3_map_prefix + key] = value;
  },
  remove: d3_map_remove,
  keys: d3_map_keys,
  values: function() {
    var values = [];
    this.forEach(function(key, value) { values.push(value); });
    return values;
  },
  entries: function() {
    var entries = [];
    this.forEach(function(key, value) { entries.push({key: key, value: value}); });
    return entries;
  },
  size: d3_map_size,
  empty: d3_map_empty,
  forEach: function(f) {
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) f.call(this, key.substring(1), this[key]);
  }
});

var d3_map_prefix = "\0", // prevent collision with built-ins
    d3_map_prefixCode = d3_map_prefix.charCodeAt(0);

function d3_map_has(key) {
  return d3_map_prefix + key in this;
}

function d3_map_remove(key) {
  key = d3_map_prefix + key;
  return key in this && delete this[key];
}

function d3_map_keys() {
  var keys = [];
  this.forEach(function(key) { keys.push(key); });
  return keys;
}

function d3_map_size() {
  var size = 0;
  for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) ++size;
  return size;
}

function d3_map_empty() {
  for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) return false;
  return true;
}

d3_selectionPrototype.data = function(value, key) {
  var i = -1,
      n = this.length,
      group,
      node;

  // If no value is specified, return the first value.
  if (!arguments.length) {
    value = new Array(n = (group = this[0]).length);
    while (++i < n) {
      if (node = group[i]) {
        value[i] = node.__data__;
      }
    }
    return value;
  }

  function bind(group, groupData) {
    var i,
        n = group.length,
        m = groupData.length,
        n0 = Math.min(n, m),
        updateNodes = new Array(m),
        enterNodes = new Array(m),
        exitNodes = new Array(n),
        node,
        nodeData;

    if (key) {
      var nodeByKeyValue = new d3_Map,
          dataByKeyValue = new d3_Map,
          keyValues = [],
          keyValue;

      for (i = -1; ++i < n;) {
        keyValue = key.call(node = group[i], node.__data__, i);
        if (nodeByKeyValue.has(keyValue)) {
          exitNodes[i] = node; // duplicate selection key
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
        keyValues.push(keyValue);
      }

      for (i = -1; ++i < m;) {
        keyValue = key.call(groupData, nodeData = groupData[i], i);
        if (node = nodeByKeyValue.get(keyValue)) {
          updateNodes[i] = node;
          node.__data__ = nodeData;
        } else if (!dataByKeyValue.has(keyValue)) { // no duplicate data key
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
        dataByKeyValue.set(keyValue, nodeData);
        nodeByKeyValue.remove(keyValue);
      }

      for (i = -1; ++i < n;) {
        if (nodeByKeyValue.has(keyValues[i])) {
          exitNodes[i] = group[i];
        }
      }
    } else {
      for (i = -1; ++i < n0;) {
        node = group[i];
        nodeData = groupData[i];
        if (node) {
          node.__data__ = nodeData;
          updateNodes[i] = node;
        } else {
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
      }
      for (; i < m; ++i) {
        enterNodes[i] = d3_selection_dataNode(groupData[i]);
      }
      for (; i < n; ++i) {
        exitNodes[i] = group[i];
      }
    }

    enterNodes.update
        = updateNodes;

    enterNodes.parentNode
        = updateNodes.parentNode
        = exitNodes.parentNode
        = group.parentNode;

    enter.push(enterNodes);
    update.push(updateNodes);
    exit.push(exitNodes);
  }

  var enter = d3_selection_enter([]),
      update = d3_selection([]),
      exit = d3_selection([]);

  if (typeof value === "function") {
    while (++i < n) {
      bind(group = this[i], value.call(group, group.parentNode.__data__, i));
    }
  } else {
    while (++i < n) {
      bind(group = this[i], value);
    }
  }

  update.enter = function() { return enter; };
  update.exit = function() { return exit; };
  return update;
};

function d3_selection_dataNode(data) {
  return {__data__: data};
}

d3_selectionPrototype.datum = function(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.property("__data__");
};

d3_selectionPrototype.filter = function(filter) {
  var subgroups = [],
      subgroup,
      group,
      node;

  if (typeof filter !== "function") filter = d3_selection_filter(filter);

  for (var j = 0, m = this.length; j < m; j++) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = 0, n = group.length; i < n; i++) {
      if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
        subgroup.push(node);
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_filter(selector) {
  return function() {
    return d3_selectMatches(this, selector);
  };
}

d3_selectionPrototype.order = function() {
  for (var j = -1, m = this.length; ++j < m;) {
    for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
};
d3.ascending = function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

d3_selectionPrototype.sort = function(comparator) {
  comparator = d3_selection_sortComparator.apply(this, arguments);
  for (var j = -1, m = this.length; ++j < m;) this[j].sort(comparator);
  return this.order();
};

function d3_selection_sortComparator(comparator) {
  if (!arguments.length) comparator = d3.ascending;
  return function(a, b) {
    return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
  };
}
function d3_noop() {}

d3.dispatch = function() {
  var dispatch = new d3_dispatch,
      i = -1,
      n = arguments.length;
  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
  return dispatch;
};

function d3_dispatch() {}

d3_dispatch.prototype.on = function(type, listener) {
  var i = type.indexOf("."),
      name = "";

  // Extract optional namespace, e.g., "click.foo"
  if (i >= 0) {
    name = type.substring(i + 1);
    type = type.substring(0, i);
  }

  if (type) return arguments.length < 2
      ? this[type].on(name)
      : this[type].on(name, listener);

  if (arguments.length === 2) {
    if (listener == null) for (type in this) {
      if (this.hasOwnProperty(type)) this[type].on(name, null);
    }
    return this;
  }
};

function d3_dispatch_event(dispatch) {
  var listeners = [],
      listenerByName = new d3_Map;

  function event() {
    var z = listeners, // defensive reference
        i = -1,
        n = z.length,
        l;
    while (++i < n) if (l = z[i].on) l.apply(this, arguments);
    return dispatch;
  }

  event.on = function(name, listener) {
    var l = listenerByName.get(name),
        i;

    // return the current listener, if any
    if (arguments.length < 2) return l && l.on;

    // remove the old listener, if any (with copy-on-write)
    if (l) {
      l.on = null;
      listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
      listenerByName.remove(name);
    }

    // add the new listener, if any
    if (listener) listeners.push(listenerByName.set(name, {on: listener}));

    return dispatch;
  };

  return event;
}

d3.event = null;

function d3_eventPreventDefault() {
  d3.event.preventDefault();
}

function d3_eventSource() {
  var e = d3.event, s;
  while (s = e.sourceEvent) e = s;
  return e;
}

// Like d3.dispatch, but for custom events abstracting native UI events. These
// events have a target component (such as a brush), a target element (such as
// the svg:g element containing the brush) and the standard arguments `d` (the
// target element's data) and `i` (the selection index of the target element).
function d3_eventDispatch(target) {
  var dispatch = new d3_dispatch,
      i = 0,
      n = arguments.length;

  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);

  // Creates a dispatch context for the specified `thiz` (typically, the target
  // DOM element that received the source event) and `argumentz` (typically, the
  // data `d` and index `i` of the target element). The returned function can be
  // used to dispatch an event to any registered listeners; the function takes a
  // single argument as input, being the event to dispatch. The event must have
  // a "type" attribute which corresponds to a type registered in the
  // constructor. This context will automatically populate the "sourceEvent" and
  // "target" attributes of the event, as well as setting the `d3.event` global
  // for the duration of the notification.
  dispatch.of = function(thiz, argumentz) {
    return function(e1) {
      try {
        var e0 =
        e1.sourceEvent = d3.event;
        e1.target = target;
        d3.event = e1;
        dispatch[e1.type].apply(thiz, argumentz);
      } finally {
        d3.event = e0;
      }
    };
  };

  return dispatch;
}

d3_selectionPrototype.on = function(type, listener, capture) {
  var n = arguments.length;
  if (n < 3) {

    // For on(object) or on(object, boolean), the object specifies the event
    // types and listeners to add or remove. The optional boolean specifies
    // whether the listener captures events.
    if (typeof type !== "string") {
      if (n < 2) listener = false;
      for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
      return this;
    }

    // For on(string), return the listener for the first node.
    if (n < 2) return (n = this.node()["__on" + type]) && n._;

    // For on(string, function), use the default capture.
    capture = false;
  }

  // Otherwise, a type, listener and capture are specified, and handled as below.
  return this.each(d3_selection_on(type, listener, capture));
};

function d3_selection_on(type, listener, capture) {
  var name = "__on" + type,
      i = type.indexOf("."),
      wrap = d3_selection_onListener;

  if (i > 0) type = type.substring(0, i);
  var filter = d3_selection_onFilters.get(type);
  if (filter) type = filter, wrap = d3_selection_onFilter;

  function onRemove() {
    var l = this[name];
    if (l) {
      this.removeEventListener(type, l, l.$);
      delete this[name];
    }
  }

  function onAdd() {
    var l = wrap(listener, d3_array(arguments));
    onRemove.call(this);
    this.addEventListener(type, this[name] = l, l.$ = capture);
    l._ = listener;
  }

  function removeAll() {
    var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"),
        match;
    for (var name in this) {
      if (match = name.match(re)) {
        var l = this[name];
        this.removeEventListener(match[1], l, l.$);
        delete this[name];
      }
    }
  }

  return i
      ? listener ? onAdd : onRemove
      : listener ? d3_noop : removeAll;
}

var d3_selection_onFilters = d3.map({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
});

d3_selection_onFilters.forEach(function(k) {
  if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
});

function d3_selection_onListener(listener, argumentz) {
  return function(e) {
    var o = d3.event; // Events can be reentrant (e.g., focus).
    d3.event = e;
    argumentz[0] = this.__data__;
    try {
      listener.apply(this, argumentz);
    } finally {
      d3.event = o;
    }
  };
}

function d3_selection_onFilter(listener, argumentz) {
  var l = d3_selection_onListener(listener, argumentz);
  return function(e) {
    var target = this, related = e.relatedTarget;
    if (!related || (related !== target && !(related.compareDocumentPosition(target) & 8))) {
      l.call(target, e);
    }
  };
}

d3_selectionPrototype.each = function(callback) {
  return d3_selection_each(this, function(node, i, j) {
    callback.call(node, node.__data__, i, j);
  });
};

function d3_selection_each(groups, callback) {
  for (var j = 0, m = groups.length; j < m; j++) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
      if (node = group[i]) callback(node, i, j);
    }
  }
  return groups;
}

d3_selectionPrototype.call = function(callback) {
  var args = d3_array(arguments);
  callback.apply(args[0] = this, args);
  return this;
};

d3_selectionPrototype.empty = function() {
  return !this.node();
};

d3_selectionPrototype.node = function() {
  for (var j = 0, m = this.length; j < m; j++) {
    for (var group = this[j], i = 0, n = group.length; i < n; i++) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
};

d3_selectionPrototype.size = function() {
  var n = 0;
  this.each(function() { ++n; });
  return n;
};

function d3_selection_enter(selection) {
  d3_subclass(selection, d3_selection_enterPrototype);
  return selection;
}

var d3_selection_enterPrototype = [];

d3.selection.enter = d3_selection_enter;
d3.selection.enter.prototype = d3_selection_enterPrototype;

d3_selection_enterPrototype.append = d3_selectionPrototype.append;
d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
d3_selection_enterPrototype.node = d3_selectionPrototype.node;
d3_selection_enterPrototype.call = d3_selectionPrototype.call;
d3_selection_enterPrototype.size = d3_selectionPrototype.size;


d3_selection_enterPrototype.select = function(selector) {
  var subgroups = [],
      subgroup,
      subnode,
      upgroup,
      group,
      node;

  for (var j = -1, m = this.length; ++j < m;) {
    upgroup = (group = this[j]).update;
    subgroups.push(subgroup = []);
    subgroup.parentNode = group.parentNode;
    for (var i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
        subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }

  return d3_selection(subgroups);
};

d3_selection_enterPrototype.insert = function(name, before) {
  if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
  return d3_selectionPrototype.insert.call(this, name, before);
};

function d3_selection_enterInsertBefore(enter) {
  var i0, j0;
  return function(d, i, j) {
    var group = enter[j].update,
        n = group.length,
        node;
    if (j != j0) j0 = j, i0 = 0;
    if (i >= i0) i0 = i + 1;
    while (!(node = group[i0]) && ++i0 < n);
    return node;
  };
}

// import "../transition/transition";

d3_selectionPrototype.transition = function() {
  var id = d3_transitionInheritId || ++d3_transitionId,
      subgroups = [],
      subgroup,
      node,
      transition = d3_transitionInherit || {time: Date.now(), ease: d3_ease_cubicInOut, delay: 0, duration: 250};

  for (var j = -1, m = this.length; ++j < m;) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) d3_transitionNode(node, i, id, transition);
      subgroup.push(node);
    }
  }

  return d3_transition(subgroups, id);
};
// import "../transition/transition";

d3_selectionPrototype.interrupt = function() {
  return this.each(d3_selection_interrupt);
};

function d3_selection_interrupt() {
  var lock = this.__transition__;
  if (lock) ++lock.active;
}

// TODO fast singleton implementation?
d3.select = function(node) {
  var group = [typeof node === "string" ? d3_select(node, d3_document) : node];
  group.parentNode = d3_documentElement;
  return d3_selection([group]);
};

d3.selectAll = function(nodes) {
  var group = d3_array(typeof nodes === "string" ? d3_selectAll(nodes, d3_document) : nodes);
  group.parentNode = d3_documentElement;
  return d3_selection([group]);
};

var d3_selectionRoot = d3.select(d3_documentElement);
  if (typeof define === "function" && define.amd) {
    define(d3);
  } else if (typeof module === "object" && module.exports) {
    module.exports = d3;
  } else {
    this.d3 = d3;
  }
}();

},{}],3:[function(require,module,exports){
function xhr(url, callback, cors) {
    var sent = false;

    if (typeof window.XMLHttpRequest === 'undefined') {
        return callback(Error('Browser not supported'));
    }

    if (typeof cors === 'undefined') {
        var m = url.match(/^\s*https?:\/\/[^\/]*/);
        cors = m && (m[0] !== location.protocol + '//' + location.domain +
                (location.port ? ':' + location.port : ''));
    }

    var x;

    function isSuccessful(status) {
        return status >= 200 && status < 300 || status === 304;
    }

    if (cors && (
        // IE7-9 Quirks & Compatibility
        typeof window.XDomainRequest === 'object' ||
        // IE9 Standards mode
        typeof window.XDomainRequest === 'function'
    )) {
        // IE8-10
        x = new window.XDomainRequest();

        // Ensure callback is never called synchronously, i.e., before
        // x.send() returns (this has been observed in the wild).
        // See https://github.com/mapbox/mapbox.js/issues/472
        var original = callback;
        callback = function() {
            if (sent) {
                original.apply(this, arguments);
            } else {
                var that = this, args = arguments;
                setTimeout(function() {
                    original.apply(that, args);
                }, 0);
            }
        }
    } else {
        x = new window.XMLHttpRequest();
    }

    function loaded() {
        if (
            // XDomainRequest
            x.status === undefined ||
            // modern browsers
            isSuccessful(x.status)) callback.call(x, null, x);
        else callback.call(x, x, null);
    }

    // Both `onreadystatechange` and `onload` can fire. `onreadystatechange`
    // has [been supported for longer](http://stackoverflow.com/a/9181508/229001).
    if ('onload' in x) {
        x.onload = loaded;
    } else {
        x.onreadystatechange = function readystate() {
            if (x.readyState === 4) {
                loaded();
            }
        };
    }

    // Call the callback with the XMLHttpRequest object as an error and prevent
    // it from ever being called again by reassigning it to `noop`
    x.onerror = function error(evt) {
        // XDomainRequest provides no evt parameter
        callback.call(this, evt || true, null);
        callback = function() { };
    };

    // IE9 must have onprogress be set to a unique function.
    x.onprogress = function() { };

    x.ontimeout = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    x.onabort = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    // GET is the only supported HTTP Verb by XDomainRequest and is the
    // only one supported here.
    x.open('GET', url, true);

    // Send the request. Sending data is not supported.
    x.send(null);
    sent = true;

    return x;
}

if (typeof module !== 'undefined') module.exports = xhr;

},{}],4:[function(require,module,exports){
/**
 * Debounces a function by the given threshold.
 *
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, threshold, execAsap){
  var timeout;

  return function debounced(){
    var obj = this, args = arguments;

    function delayed () {
      if (!execAsap) {
        func.apply(obj, args);
      }
      timeout = null;
    }

    if (timeout) {
      clearTimeout(timeout);
    } else if (execAsap) {
      func.apply(obj, args);
    }

    timeout = setTimeout(delayed, threshold || 100);
  };
};

},{}],5:[function(require,module,exports){
var polyline = {};

// Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
//
// Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
// by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)

function encode(coordinate, factor) {
    coordinate = Math.round(coordinate * factor);
    coordinate <<= 1;
    if (coordinate < 0) {
        coordinate = ~coordinate;
    }
    var output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
}

// This is adapted from the implementation in Project-OSRM
// https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
polyline.decode = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

polyline.encode = function(coordinates, precision) {
    if (!coordinates.length) return '';

    var factor = Math.pow(10, precision || 5),
        output = encode(coordinates[0][0], factor) + encode(coordinates[0][1], factor);

    for (var i = 1; i < coordinates.length; i++) {
        var a = coordinates[i], b = coordinates[i - 1];
        output += encode(a[0] - b[0], factor);
        output += encode(a[1] - b[1], factor);
    }

    return output;
};

if (typeof module !== undefined) module.exports = polyline;

},{}],6:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('queue', factory) :
  (global.queue = factory());
}(this, function () { 'use strict';

  var slice = [].slice;

  function noop() {}

  var noabort = {};
  var success = [null];
  function newQueue(concurrency) {
    if (!(concurrency >= 1)) throw new Error;

    var q,
        tasks = [],
        results = [],
        waiting = 0,
        active = 0,
        ended = 0,
        starting, // inside a synchronous task callback?
        error,
        callback = noop,
        callbackAll = true;

    function start() {
      if (starting) return; // let the current task complete
      while (starting = waiting && active < concurrency) {
        var i = ended + active,
            t = tasks[i],
            j = t.length - 1,
            c = t[j];
        t[j] = end(i);
        --waiting, ++active, tasks[i] = c.apply(null, t) || noabort;
      }
    }

    function end(i) {
      return function(e, r) {
        if (!tasks[i]) throw new Error; // detect multiple callbacks
        --active, ++ended, tasks[i] = null;
        if (error != null) return; // only report the first error
        if (e != null) {
          abort(e);
        } else {
          results[i] = r;
          if (waiting) start();
          else if (!active) notify();
        }
      };
    }

    function abort(e) {
      error = e; // ignore new tasks and squelch active callbacks
      waiting = NaN; // stop queued tasks from starting
      notify();
    }

    function notify() {
      if (error != null) callback(error);
      else if (callbackAll) callback(null, results);
      else callback.apply(null, success.concat(results));
    }

    return q = {
      defer: function(f) {
        if (callback !== noop) throw new Error;
        var t = slice.call(arguments, 1);
        t.push(f);
        ++waiting, tasks.push(t);
        start();
        return q;
      },
      abort: function() {
        if (error == null) {
          var i = ended + active, t;
          while (--i >= 0) (t = tasks[i]) && t.abort && t.abort();
          abort(new Error("abort"));
        }
        return q;
      },
      await: function(f) {
        if (callback !== noop) throw new Error;
        callback = f, callbackAll = false;
        if (!waiting && !active) notify();
        return q;
      },
      awaitAll: function(f) {
        if (callback !== noop) throw new Error;
        callback = f, callbackAll = true;
        if (!waiting && !active) notify();
        return q;
      }
    };
  }

  function queue(concurrency) {
    return newQueue(arguments.length ? +concurrency : Infinity);
  }

  queue.version = "1.2.1";

  return queue;

}));
},{}],7:[function(require,module,exports){
'use strict';

var request = require('./request'),
    polyline = require('polyline'),
    queue = require('queue-async');

var Directions = L.Class.extend({
    includes: [L.Mixin.Events],

    options: {
        units: 'imperial'
    },

    statics: {
        URL_TEMPLATE: 'https://api.tiles.mapbox.com/v4/directions/{profile}/{waypoints}.json?instructions=html&geometry=polyline&access_token={token}',
        GEOCODER_TEMPLATE: 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/{query}.json?proximity={proximity}&access_token={token}'
    },

    initialize: function(options) {
        L.setOptions(this, options);
        this._waypoints = [];
    },

    getOrigin: function () {
        return this.origin;
    },

    getDestination: function () {
        return this.destination;
    },

    setOrigin: function (origin) {
        origin = this._normalizeWaypoint(origin);

        this.origin = origin;
        this.fire('origin', {origin: origin});

        if (!origin) {
            this._unload();
        }

        return this;
    },

    setDestination: function (destination) {
        destination = this._normalizeWaypoint(destination);

        this.destination = destination;
        this.fire('destination', {destination: destination});

        if (!destination) {
            this._unload();
        }

        return this;
    },

    getProfile: function() {
        return this.profile || this.options.profile || 'mapbox.driving';
    },

    setProfile: function (profile) {
        this.profile = profile;
        this.fire('profile', {profile: profile});
        return this;
    },

    getWaypoints: function() {
        return this._waypoints;
    },

    setWaypoints: function (waypoints) {
        this._waypoints = waypoints.map(this._normalizeWaypoint);
        return this;
    },

    addWaypoint: function (index, waypoint) {
        this._waypoints.splice(index, 0, this._normalizeWaypoint(waypoint));
        return this;
    },

    removeWaypoint: function (index) {
        this._waypoints.splice(index, 1);
        return this;
    },

    setWaypoint: function (index, waypoint) {
        this._waypoints[index] = this._normalizeWaypoint(waypoint);
        return this;
    },

    reverse: function () {
        var o = this.origin,
            d = this.destination;

        this.origin = d;
        this.destination = o;
        this._waypoints.reverse();

        this.fire('origin', {origin: this.origin})
            .fire('destination', {destination: this.destination});

        return this;
    },

    selectRoute: function (route) {
        this.fire('selectRoute', {route: route});
    },

    highlightRoute: function (route) {
        this.fire('highlightRoute', {route: route});
    },

    highlightStep: function (step) {
        this.fire('highlightStep', {step: step});
    },

    queryURL: function () {
        var template = Directions.URL_TEMPLATE,
            token = this.options.accessToken || L.mapbox.accessToken,
            profile = this.getProfile(),
            points = [this.origin].concat(this._waypoints).concat([this.destination]).map(function (point) {
                return point.geometry.coordinates;
            }).join(';');

        if (L.mapbox.feedback) {
            L.mapbox.feedback.record({directions: profile + ';' + points});
        }

        return L.Util.template(template, {
            token: token,
            profile: profile,
            waypoints: points
        });
    },

    queryable: function () {
        return this.getOrigin() && this.getDestination();
    },

    query: function (opts, callback) {
        if (!opts) opts = {};
        if (!this.queryable()) return this;
        if (callback === undefined) callback = function() {};

        if (this._query) {
            this._query.abort();
        }

        if (this._requests && this._requests.length) this._requests.forEach(function(request) {
            request.abort();
        });
        this._requests = [];

        var q = queue();

        var pts = [this.origin, this.destination].concat(this._waypoints);
        for (var i in pts) {
            if (!pts[i].geometry.coordinates) {
                q.defer(L.bind(this._geocode, this), pts[i], opts.proximity);
            }
        }

        q.await(L.bind(function(err) {
            if (err) {
                return this.fire('error', {error: err.message});
            }

            this._query = request(this.queryURL(), L.bind(function (err, resp) {
                this._query = null;

                if (err) {
                    callback(err);
                    return this.fire('error', {error: err.message});
                }

                this.directions = resp;
                this.directions.routes.forEach(function (route) {
                    route.geometry = {
                        type: "LineString",
                        coordinates: polyline.decode(route.geometry, 6).map(function (c) { return c.reverse(); })
                    };
                });

                if (!this.origin.properties.name) {
                    this.origin = this.directions.origin;
                } else {
                    this.directions.origin = this.origin;
                }

                if (!this.destination.properties.name) {
                    this.destination = this.directions.destination;
                } else {
                    this.directions.destination = this.destination;
                }

                callback(null, this.directions);

                this.fire('load', this.directions);
            }, this), this);
        }, this));

        return this;
    },

    _geocode: function(waypoint, proximity, cb) {
        if (!this._requests) this._requests = [];
        this._requests.push(request(L.Util.template(Directions.GEOCODER_TEMPLATE, {
            query: waypoint.properties.query,
            token: this.options.accessToken || L.mapbox.accessToken,
            proximity: proximity ? [proximity.lng, proximity.lat].join(',') : ''
        }), L.bind(function (err, resp) {
            if (err) {
                return cb(err);
            }

            if (!resp.features || !resp.features.length) {
                return cb(new Error("No results found for query " + waypoint.properties.query));
            }

            waypoint.geometry.coordinates = resp.features[0].center;
            waypoint.properties.name = resp.features[0].place_name;

            return cb();
        }, this)));
    },

    _unload: function () {
        this._waypoints = [];
        delete this.directions;
        this.fire('unload');
    },

    _normalizeWaypoint: function (waypoint) {
        if (!waypoint || waypoint.type === 'Feature') {
            return waypoint;
        }

        var coordinates,
            properties = {};

        if (waypoint instanceof L.LatLng) {
            waypoint = waypoint.wrap();
            coordinates = properties.query = [waypoint.lng, waypoint.lat];
        } else if (typeof waypoint === 'string') {
            properties.query = waypoint;
        }

        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates
            },
            properties: properties
        };
    }
});

module.exports = function(options) {
    return new Directions(options);
};

},{"./request":13,"polyline":5,"queue-async":6}],8:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-errors', true);

    directions.on('load unload', function () {
        container
            .classed('mapbox-error-active', false)
            .html('');
    });

    directions.on('error', function (e) {
        container
            .classed('mapbox-error-active', true)
            .html('')
            .append('span')
            .attr('class', 'mapbox-directions-error')
            .text(e.error);

        container
            .insert('span', 'span')
            .attr('class', 'mapbox-directions-icon mapbox-error-icon');
    });

    return control;
};

},{"../lib/d3":2}],9:[function(require,module,exports){
'use strict';

module.exports = {
    duration: function (s) {
        var m = Math.floor(s / 60),
            h = Math.floor(m / 60);
        s %= 60;
        m %= 60;
        if (h === 0 && m === 0) return s + ' s';
        if (h === 0) return m + ' min';
        return h + ' h ' + m + ' min';
    },

    imperial: function (m) {
        var mi = m / 1609.344;
        if (mi >= 100) return mi.toFixed(0) + ' mi';
        if (mi >= 10) return mi.toFixed(1) + ' mi';
        if (mi >= 0.1) return mi.toFixed(2) + ' mi';
        return (mi * 5280).toFixed(0) + ' ft';
    },

    metric: function (m) {
        if (m >= 100000) return (m / 1000).toFixed(0) + ' km';
        if (m >= 10000) return (m / 1000).toFixed(1) + ' km';
        if (m >= 100) return (m / 1000).toFixed(2) + ' km';
        return m.toFixed(0) + ' m';
    }
};

},{}],10:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3');

module.exports = function (container, directions) {
    var control = {}, map;
    var origChange = false,
        destChange = false;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-inputs', true);

    var form = container.append('form')
        .on('keypress', function () {
            if (d3.event.keyCode === 13) {
                d3.event.preventDefault();

                if (origChange)
                    directions.setOrigin(originInput.property('value'));
                if (destChange)
                    directions.setDestination(destinationInput.property('value'));

                if (directions.queryable())
                    directions.query({ proximity: map.getCenter() });

                origChange = false;
                destChange = false;
            }
        });

    var origin = form.append('div')
        .attr('class', 'mapbox-directions-origin');

    origin.append('label')
        .attr('class', 'mapbox-form-label')
        .on('click', function () {
            if (directions.getOrigin() instanceof L.LatLng) {
                map.panTo(directions.getOrigin());
            }
        })
        .append('span')
        .attr('class', 'mapbox-directions-icon mapbox-depart-icon');

    var originInput = origin.append('input')
        .attr('type', 'text')
        .attr('required', 'required')
        .attr('id', 'mapbox-directions-origin-input')
        .attr('placeholder', 'Start')
        .on('input', function() {
            if (!origChange) origChange = true;
        });

    origin.append('div')
        .attr('class', 'mapbox-directions-icon mapbox-close-icon')
        .attr('title', 'Clear value')
        .on('click', function () {
            directions.setOrigin(undefined);
        });

    form.append('span')
        .attr('class', 'mapbox-directions-icon mapbox-reverse-icon mapbox-directions-reverse-input')
        .attr('title', 'Reverse origin & destination')
        .on('click', function () {
            directions.reverse().query();
        });

    var destination = form.append('div')
        .attr('class', 'mapbox-directions-destination');

    destination.append('label')
        .attr('class', 'mapbox-form-label')
        .on('click', function () {
            if (directions.getDestination() instanceof L.LatLng) {
                map.panTo(directions.getDestination());
            }
        })
        .append('span')
        .attr('class', 'mapbox-directions-icon mapbox-arrive-icon');

    var destinationInput = destination.append('input')
        .attr('type', 'text')
        .attr('required', 'required')
        .attr('id', 'mapbox-directions-destination-input')
        .attr('placeholder', 'End')
        .on('input', function() {
            if (!destChange) destChange = true;
        });

    destination.append('div')
        .attr('class', 'mapbox-directions-icon mapbox-close-icon')
        .attr('title', 'Clear value')
        .on('click', function () {
            directions.setDestination(undefined);
        });

    var profile = form.append('div')
        .attr('class', 'mapbox-directions-profile');

    var profiles = profile.selectAll('span')
        .data([
            ['mapbox.driving', 'driving', 'Driving'],
            ['mapbox.walking', 'walking', 'Walking'],
            ['mapbox.cycling', 'cycling', 'Cycling']])
        .enter()
        .append('span');

    profiles.append('input')
        .attr('type', 'radio')
        .attr('name', 'profile')
        .attr('id', function (d) { return 'mapbox-directions-profile-' + d[1]; })
        .property('checked', function (d, i) {
            if (directions.options.profile) return directions.options.profile === d[0];
            else return i === 0;
        })
        .on('change', function (d) {
            directions.setProfile(d[0]).query();
        });

    profiles.append('label')
        .attr('for', function (d) { return 'mapbox-directions-profile-' + d[1]; })
        .text(function (d) { return d[2]; });

    function format(waypoint) {
        if (!waypoint) {
            return '';
        } else if (waypoint.properties.name) {
            return waypoint.properties.name;
        } else if (waypoint.geometry.coordinates) {
            var precision = Math.max(0, Math.ceil(Math.log(map.getZoom()) / Math.LN2));
            return waypoint.geometry.coordinates[0].toFixed(precision) + ', ' +
                   waypoint.geometry.coordinates[1].toFixed(precision);
        } else {
            return waypoint.properties.query || '';
        }
    }

    directions
        .on('origin', function (e) {
            originInput.property('value', format(e.origin));
        })
        .on('destination', function (e) {
            destinationInput.property('value', format(e.destination));
        })
        .on('profile', function (e) {
            profiles.selectAll('input')
                .property('checked', function (d) { return d[0] === e.profile; });
        })
        .on('load', function (e) {
            originInput.property('value', format(e.origin));
            destinationInput.property('value', format(e.destination));
        });

    return control;
};

},{"../lib/d3":2}],11:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-instructions', true);

    directions.on('error', function () {
        container.html('');
    });

    directions.on('selectRoute', function (e) {
        var route = e.route;

        container.html('');

        var steps = container.append('ol')
            .attr('class', 'mapbox-directions-steps')
            .selectAll('li')
            .data(route.steps)
            .enter().append('li')
            .attr('class', 'mapbox-directions-step');

        steps.append('span')
            .attr('class', function (step) {
                return 'mapbox-directions-icon mapbox-' + step.maneuver.type.replace(/\s+/g, '-').toLowerCase() + '-icon';
            });

        steps.append('div')
            .attr('class', 'mapbox-directions-step-maneuver')
            .html(function (step) { return step.maneuver.instruction; });

        steps.append('div')
            .attr('class', 'mapbox-directions-step-distance')
            .text(function (step) {
                return step.distance ? format[directions.options.units](step.distance) : '';
            });

        steps.on('mouseover', function (step) {
            directions.highlightStep(step);
        });

        steps.on('mouseout', function () {
            directions.highlightStep(null);
        });

        steps.on('click', function (step) {
            map.panTo(L.GeoJSON.coordsToLatLng(step.maneuver.location.coordinates));
        });
    });

    return control;
};

},{"../lib/d3":2,"./format":9}],12:[function(require,module,exports){
'use strict';

var debounce = require('debounce');

var Layer = L.LayerGroup.extend({
    options: {
        readonly: false,
        routeStyle: {
            'color': '#3BB2D0',
            'weight': 4,
            'opacity': 0.75
        }
    },

    initialize: function(directions, options) {
        L.setOptions(this, options);
        this._directions = directions || new L.Directions();
        L.LayerGroup.prototype.initialize.apply(this);

        this._drag = debounce(L.bind(this._drag, this), 100);

        this.originMarker = L.marker([0, 0], {
            draggable: !this.options.readonly,
            icon: L.mapbox.marker.icon({
                'marker-size': 'medium',
                'marker-color': '#3BB2D0',
                'marker-symbol': 'a'
            })
        }).on('drag', this._drag, this);

        this.destinationMarker = L.marker([0, 0], {
            draggable: !this.options.readonly,
            icon: L.mapbox.marker.icon({
                'marker-size': 'medium',
                'marker-color': '#444',
                'marker-symbol': 'b'
            })
        }).on('drag', this._drag, this);

        this.stepMarker = L.marker([0, 0], {
            icon: L.divIcon({
                className: 'mapbox-marker-drag-icon mapbox-marker-drag-icon-step',
                iconSize: new L.Point(12, 12)
            })
        });

        this.dragMarker = L.marker([0, 0], {
            draggable: !this.options.readonly,
            icon: this._waypointIcon()
        });

        this.dragMarker
            .on('dragstart', this._dragStart, this)
            .on('drag', this._drag, this)
            .on('dragend', this._dragEnd, this);

        this.routeLayer = L.geoJson(null, {style: this.options.routeStyle});
        this.routeHighlightLayer = L.geoJson(null, {style: this.options.routeStyle});

        this.waypointMarkers = [];
    },

    onAdd: function() {
        L.LayerGroup.prototype.onAdd.apply(this, arguments);

        if (!this.options.readonly) {
          this._map
              .on('click', this._click, this)
              .on('mousemove', this._mousemove, this);
        }

        this._directions
            .on('origin', this._origin, this)
            .on('destination', this._destination, this)
            .on('load', this._load, this)
            .on('unload', this._unload, this)
            .on('selectRoute', this._selectRoute, this)
            .on('highlightRoute', this._highlightRoute, this)
            .on('highlightStep', this._highlightStep, this);
    },

    onRemove: function() {
        this._directions
            .off('origin', this._origin, this)
            .off('destination', this._destination, this)
            .off('load', this._load, this)
            .off('unload', this._unload, this)
            .off('selectRoute', this._selectRoute, this)
            .off('highlightRoute', this._highlightRoute, this)
            .off('highlightStep', this._highlightStep, this);

        this._map
            .off('click', this._click, this)
            .off('mousemove', this._mousemove, this);

        L.LayerGroup.prototype.onRemove.apply(this, arguments);
    },

    _click: function(e) {
        if (!this._directions.getOrigin()) {
            this._directions.setOrigin(e.latlng);
        } else if (!this._directions.getDestination()) {
            this._directions.setDestination(e.latlng);
        }

        if (this._directions.queryable()) {
            this._directions.query();
        }
    },

    _mousemove: function(e) {
        if (!this.routeLayer || !this.hasLayer(this.routeLayer) || this._currentWaypoint !== undefined) {
            return;
        }

        var p = this._routePolyline().closestLayerPoint(e.layerPoint);

        if (!p || p.distance > 15) {
            return this.removeLayer(this.dragMarker);
        }

        var m = this._map.project(e.latlng),
            o = this._map.project(this.originMarker.getLatLng()),
            d = this._map.project(this.destinationMarker.getLatLng());

        if (o.distanceTo(m) < 15 || d.distanceTo(m) < 15) {
            return this.removeLayer(this.dragMarker);
        }

        for (var i = 0; i < this.waypointMarkers.length; i++) {
            var w = this._map.project(this.waypointMarkers[i].getLatLng());
            if (i !== this._currentWaypoint && w.distanceTo(m) < 15) {
                return this.removeLayer(this.dragMarker);
            }
        }

        this.dragMarker.setLatLng(this._map.layerPointToLatLng(p));
        this.addLayer(this.dragMarker);
    },

    _origin: function(e) {
        if (e.origin && e.origin.geometry.coordinates) {
            this.originMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.origin.geometry.coordinates));
            this.addLayer(this.originMarker);
        } else {
            this.removeLayer(this.originMarker);
        }
    },

    _destination: function(e) {
        if (e.destination && e.destination.geometry.coordinates) {
            this.destinationMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.destination.geometry.coordinates));
            this.addLayer(this.destinationMarker);
        } else {
            this.removeLayer(this.destinationMarker);
        }
    },

    _dragStart: function(e) {
        if (e.target === this.dragMarker) {
            this._currentWaypoint = this._findWaypointIndex(e.target.getLatLng());
            this._directions.addWaypoint(this._currentWaypoint, e.target.getLatLng());
        } else {
            this._currentWaypoint = this.waypointMarkers.indexOf(e.target);
        }
    },

    _drag: function(e) {
        var latLng = e.target.getLatLng();

        if (e.target === this.originMarker) {
            this._directions.setOrigin(latLng);
        } else if (e.target === this.destinationMarker) {
            this._directions.setDestination(latLng);
        } else {
            this._directions.setWaypoint(this._currentWaypoint, latLng);
        }

        if (this._directions.queryable()) {
            this._directions.query();
        }
    },

    _dragEnd: function() {
        this._currentWaypoint = undefined;
    },

    _removeWaypoint: function(e) {
        this._directions.removeWaypoint(this.waypointMarkers.indexOf(e.target)).query();
    },

    _load: function(e) {
        this._origin(e);
        this._destination(e);

        function waypointLatLng(i) {
            return L.GeoJSON.coordsToLatLng(e.waypoints[i].geometry.coordinates);
        }

        var l = Math.min(this.waypointMarkers.length, e.waypoints.length),
            i = 0;

        // Update existing
        for (; i < l; i++) {
            this.waypointMarkers[i].setLatLng(waypointLatLng(i));
        }

        // Add new
        for (; i < e.waypoints.length; i++) {
            var waypointMarker = L.marker(waypointLatLng(i), {
                draggable: !this.options.readonly,
                icon: this._waypointIcon()
            });

            waypointMarker
                .on('click', this._removeWaypoint, this)
                .on('dragstart', this._dragStart, this)
                .on('drag', this._drag, this)
                .on('dragend', this._dragEnd, this);

            this.waypointMarkers.push(waypointMarker);
            this.addLayer(waypointMarker);
        }

        // Remove old
        for (; i < this.waypointMarkers.length; i++) {
            this.removeLayer(this.waypointMarkers[i]);
        }

        this.waypointMarkers.length = e.waypoints.length;
    },

    _unload: function() {
        this.removeLayer(this.routeLayer);
        for (var i = 0; i < this.waypointMarkers.length; i++) {
            this.removeLayer(this.waypointMarkers[i]);
        }
    },

    _selectRoute: function(e) {
        this.routeLayer
            .clearLayers()
            .addData(e.route.geometry);
        this.addLayer(this.routeLayer);
    },

    _highlightRoute: function(e) {
        if (e.route) {
            this.routeHighlightLayer
                .clearLayers()
                .addData(e.route.geometry);
            this.addLayer(this.routeHighlightLayer);
        } else {
            this.removeLayer(this.routeHighlightLayer);
        }
    },

    _highlightStep: function(e) {
        if (e.step) {
            this.stepMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.step.maneuver.location.coordinates));
            this.addLayer(this.stepMarker);
        } else {
            this.removeLayer(this.stepMarker);
        }
    },

    _routePolyline: function() {
        return this.routeLayer.getLayers()[0];
    },

    _findWaypointIndex: function(latLng) {
        var segment = this._findNearestRouteSegment(latLng);

        for (var i = 0; i < this.waypointMarkers.length; i++) {
            var s = this._findNearestRouteSegment(this.waypointMarkers[i].getLatLng());
            if (s > segment) {
                return i;
            }
        }

        return this.waypointMarkers.length;
    },

    _findNearestRouteSegment: function(latLng) {
        var min = Infinity,
            index,
            p = this._map.latLngToLayerPoint(latLng),
            positions = this._routePolyline()._originalPoints;

        for (var i = 1; i < positions.length; i++) {
            var d = L.LineUtil._sqClosestPointOnSegment(p, positions[i - 1], positions[i], true);
            if (d < min) {
                min = d;
                index = i;
            }
        }

        return index;
    },

    _waypointIcon: function() {
        return L.divIcon({
            className: 'mapbox-marker-drag-icon',
            iconSize: new L.Point(12, 12)
        });
    }
});

module.exports = function(directions, options) {
    return new Layer(directions, options);
};

},{"debounce":4}],13:[function(require,module,exports){
'use strict';

var corslite = require('corslite');

module.exports = function(url, callback) {
    return corslite(url, function (err, resp) {
        if (err && err.type === 'abort') {
            return;
        }

        if (err && !err.responseText) {
            return callback(err);
        }

        resp = resp || err;

        try {
            resp = JSON.parse(resp.responseText);
        } catch (e) {
            return callback(new Error(resp.responseText));
        }

        if (resp.error) {
            return callback(new Error(resp.error));
        }

        return callback(null, resp);
    });
};

},{"corslite":3}],14:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map, selection = 0;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-routes', true);

    directions.on('error', function () {
        container.html('');
    });

    directions.on('load', function (e) {
        container.html('');

        var routes = container.append('ul')
            .selectAll('li')
            .data(e.routes)
            .enter().append('li')
            .attr('class', 'mapbox-directions-route');

        routes.append('div')
            .attr('class','mapbox-directions-route-heading')
            .text(function (route) { return 'Route ' + (e.routes.indexOf(route) + 1); });

        routes.append('div')
            .attr('class', 'mapbox-directions-route-summary')
            .text(function (route) { return route.summary; });

        routes.append('div')
            .attr('class', 'mapbox-directions-route-details')
            .text(function (route) {
                return format[directions.options.units](route.distance) + ', ' + format.duration(route.duration);
            });

        routes.on('mouseover', function (route) {
            directions.highlightRoute(route);
        });

        routes.on('mouseout', function () {
            directions.highlightRoute(null);
        });

        routes.on('click', function (route) {
            directions.selectRoute(route);
        });

        directions.selectRoute(e.routes[0]);
    });

    directions.on('selectRoute', function (e) {
        container.selectAll('.mapbox-directions-route')
            .classed('mapbox-directions-route-active', function (route) { return route === e.route; });
    });

    return control;
};

},{"../lib/d3":2,"./format":9}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9kMy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JzbGl0ZS9jb3JzbGl0ZS5qcyIsIm5vZGVfbW9kdWxlcy9kZWJvdW5jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wb2x5bGluZS9zcmMvcG9seWxpbmUuanMiLCJub2RlX21vZHVsZXMvcXVldWUtYXN5bmMvYnVpbGQvcXVldWUuanMiLCJzcmMvZGlyZWN0aW9ucy5qcyIsInNyYy9lcnJvcnNfY29udHJvbC5qcyIsInNyYy9mb3JtYXQuanMiLCJzcmMvaW5wdXRfY29udHJvbC5qcyIsInNyYy9pbnN0cnVjdGlvbnNfY29udHJvbC5qcyIsInNyYy9sYXllci5qcyIsInNyYy9yZXF1ZXN0LmpzIiwic3JjL3JvdXRlc19jb250cm9sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1aENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIUwubWFwYm94KSB0aHJvdyBuZXcgRXJyb3IoJ2luY2x1ZGUgbWFwYm94LmpzIGJlZm9yZSBtYXBib3guZGlyZWN0aW9ucy5qcycpO1xuXG5MLm1hcGJveC5kaXJlY3Rpb25zID0gcmVxdWlyZSgnLi9zcmMvZGlyZWN0aW9ucycpO1xuTC5tYXBib3guZGlyZWN0aW9ucy5mb3JtYXQgPSByZXF1aXJlKCcuL3NyYy9mb3JtYXQnKTtcbkwubWFwYm94LmRpcmVjdGlvbnMubGF5ZXIgPSByZXF1aXJlKCcuL3NyYy9sYXllcicpO1xuTC5tYXBib3guZGlyZWN0aW9ucy5pbnB1dENvbnRyb2wgPSByZXF1aXJlKCcuL3NyYy9pbnB1dF9jb250cm9sJyk7XG5MLm1hcGJveC5kaXJlY3Rpb25zLmVycm9yc0NvbnRyb2wgPSByZXF1aXJlKCcuL3NyYy9lcnJvcnNfY29udHJvbCcpO1xuTC5tYXBib3guZGlyZWN0aW9ucy5yb3V0ZXNDb250cm9sID0gcmVxdWlyZSgnLi9zcmMvcm91dGVzX2NvbnRyb2wnKTtcbkwubWFwYm94LmRpcmVjdGlvbnMuaW5zdHJ1Y3Rpb25zQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL2luc3RydWN0aW9uc19jb250cm9sJyk7XG4iLCIhZnVuY3Rpb24oKXtcbiAgdmFyIGQzID0ge3ZlcnNpb246IFwiMy40LjFcIn07IC8vIHNlbXZlclxudmFyIGQzX2FycmF5U2xpY2UgPSBbXS5zbGljZSxcbiAgICBkM19hcnJheSA9IGZ1bmN0aW9uKGxpc3QpIHsgcmV0dXJuIGQzX2FycmF5U2xpY2UuY2FsbChsaXN0KTsgfTsgLy8gY29udmVyc2lvbiBmb3IgTm9kZUxpc3RzXG5cbnZhciBkM19kb2N1bWVudCA9IGRvY3VtZW50LFxuICAgIGQzX2RvY3VtZW50RWxlbWVudCA9IGQzX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICBkM193aW5kb3cgPSB3aW5kb3c7XG5cbi8vIFJlZGVmaW5lIGQzX2FycmF5IGlmIHRoZSBicm93c2VyIGRvZXNu4oCZdCBzdXBwb3J0IHNsaWNlLWJhc2VkIGNvbnZlcnNpb24uXG50cnkge1xuICBkM19hcnJheShkM19kb2N1bWVudEVsZW1lbnQuY2hpbGROb2RlcylbMF0ubm9kZVR5cGU7XG59IGNhdGNoKGUpIHtcbiAgZDNfYXJyYXkgPSBmdW5jdGlvbihsaXN0KSB7XG4gICAgdmFyIGkgPSBsaXN0Lmxlbmd0aCwgYXJyYXkgPSBuZXcgQXJyYXkoaSk7XG4gICAgd2hpbGUgKGktLSkgYXJyYXlbaV0gPSBsaXN0W2ldO1xuICAgIHJldHVybiBhcnJheTtcbiAgfTtcbn1cbnZhciBkM19zdWJjbGFzcyA9IHt9Ll9fcHJvdG9fXz9cblxuLy8gVW50aWwgRUNNQVNjcmlwdCBzdXBwb3J0cyBhcnJheSBzdWJjbGFzc2luZywgcHJvdG90eXBlIGluamVjdGlvbiB3b3JrcyB3ZWxsLlxuZnVuY3Rpb24ob2JqZWN0LCBwcm90b3R5cGUpIHtcbiAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcbn06XG5cbi8vIEFuZCBpZiB5b3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IF9fcHJvdG9fXywgd2UnbGwgdXNlIGRpcmVjdCBleHRlbnNpb24uXG5mdW5jdGlvbihvYmplY3QsIHByb3RvdHlwZSkge1xuICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm90b3R5cGUpIG9iamVjdFtwcm9wZXJ0eV0gPSBwcm90b3R5cGVbcHJvcGVydHldO1xufTtcblxuZnVuY3Rpb24gZDNfdmVuZG9yU3ltYm9sKG9iamVjdCwgbmFtZSkge1xuICBpZiAobmFtZSBpbiBvYmplY3QpIHJldHVybiBuYW1lO1xuICBuYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyaW5nKDEpO1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGQzX3ZlbmRvclByZWZpeGVzLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIHZhciBwcmVmaXhOYW1lID0gZDNfdmVuZG9yUHJlZml4ZXNbaV0gKyBuYW1lO1xuICAgIGlmIChwcmVmaXhOYW1lIGluIG9iamVjdCkgcmV0dXJuIHByZWZpeE5hbWU7XG4gIH1cbn1cblxudmFyIGQzX3ZlbmRvclByZWZpeGVzID0gW1wid2Via2l0XCIsIFwibXNcIiwgXCJtb3pcIiwgXCJNb3pcIiwgXCJvXCIsIFwiT1wiXTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uKGdyb3Vwcykge1xuICBkM19zdWJjbGFzcyhncm91cHMsIGQzX3NlbGVjdGlvblByb3RvdHlwZSk7XG4gIHJldHVybiBncm91cHM7XG59XG5cbnZhciBkM19zZWxlY3QgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBuLnF1ZXJ5U2VsZWN0b3Iocyk7IH0sXG4gICAgZDNfc2VsZWN0QWxsID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gbi5xdWVyeVNlbGVjdG9yQWxsKHMpOyB9LFxuICAgIGQzX3NlbGVjdE1hdGNoZXIgPSBkM19kb2N1bWVudEVsZW1lbnRbZDNfdmVuZG9yU3ltYm9sKGQzX2RvY3VtZW50RWxlbWVudCwgXCJtYXRjaGVzU2VsZWN0b3JcIildLFxuICAgIGQzX3NlbGVjdE1hdGNoZXMgPSBmdW5jdGlvbihuLCBzKSB7IHJldHVybiBkM19zZWxlY3RNYXRjaGVyLmNhbGwobiwgcyk7IH07XG5cbi8vIFByZWZlciBTaXp6bGUsIGlmIGF2YWlsYWJsZS5cbmlmICh0eXBlb2YgU2l6emxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgZDNfc2VsZWN0ID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gU2l6emxlKHMsIG4pWzBdIHx8IG51bGw7IH07XG4gIGQzX3NlbGVjdEFsbCA9IGZ1bmN0aW9uKHMsIG4pIHsgcmV0dXJuIFNpenpsZS51bmlxdWVTb3J0KFNpenpsZShzLCBuKSk7IH07XG4gIGQzX3NlbGVjdE1hdGNoZXMgPSBTaXp6bGUubWF0Y2hlc1NlbGVjdG9yO1xufVxuXG5kMy5zZWxlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvblJvb3Q7XG59O1xuXG52YXIgZDNfc2VsZWN0aW9uUHJvdG90eXBlID0gZDMuc2VsZWN0aW9uLnByb3RvdHlwZSA9IFtdO1xuXG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIHN1Ym5vZGUsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgc2VsZWN0b3IgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgIHN1Ymdyb3VwLnBhcmVudE5vZGUgPSAoZ3JvdXAgPSB0aGlzW2pdKS5wYXJlbnROb2RlO1xuICAgIGZvciAodmFyIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChzdWJub2RlID0gc2VsZWN0b3IuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSk7XG4gICAgICAgIGlmIChzdWJub2RlICYmIFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3NlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiA/IHNlbGVjdG9yIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdChzZWxlY3RvciwgdGhpcyk7XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zZWxlY3RBbGwgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgc2VsZWN0b3IgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IGQzX2FycmF5KHNlbGVjdG9yLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpKTtcbiAgICAgICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3NlbGVjdG9yQWxsKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiA/IHNlbGVjdG9yIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdEFsbChzZWxlY3RvciwgdGhpcyk7XG4gIH07XG59XG52YXIgZDNfbnNQcmVmaXggPSB7XG4gIHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICB4aHRtbDogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIsXG4gIHhsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgeG1sOiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLFxuICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG59O1xuXG5kMy5ucyA9IHtcbiAgcHJlZml4OiBkM19uc1ByZWZpeCxcbiAgcXVhbGlmeTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gbmFtZS5pbmRleE9mKFwiOlwiKSxcbiAgICAgICAgcHJlZml4ID0gbmFtZTtcbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBpKTtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZyhpICsgMSk7XG4gICAgfVxuICAgIHJldHVybiBkM19uc1ByZWZpeC5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpXG4gICAgICAgID8ge3NwYWNlOiBkM19uc1ByZWZpeFtwcmVmaXhdLCBsb2NhbDogbmFtZX1cbiAgICAgICAgOiBuYW1lO1xuICB9XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuYXR0ciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuXG4gICAgLy8gRm9yIGF0dHIoc3RyaW5nKSwgcmV0dXJuIHRoZSBhdHRyaWJ1dGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBub2RlLlxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIG5hbWUgPSBkMy5ucy5xdWFsaWZ5KG5hbWUpO1xuICAgICAgcmV0dXJuIG5hbWUubG9jYWxcbiAgICAgICAgICA/IG5vZGUuZ2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbClcbiAgICAgICAgICA6IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgIH1cblxuICAgIC8vIEZvciBhdHRyKG9iamVjdCksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBuYW1lcyBhbmQgdmFsdWVzIG9mIHRoZVxuICAgIC8vIGF0dHJpYnV0ZXMgdG8gc2V0IG9yIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmUgZnVuY3Rpb25zIHRoYXQgYXJlXG4gICAgLy8gZXZhbHVhdGVkIGZvciBlYWNoIGVsZW1lbnQuXG4gICAgZm9yICh2YWx1ZSBpbiBuYW1lKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2F0dHIodmFsdWUsIG5hbWVbdmFsdWVdKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9hdHRyKG5hbWUsIHZhbHVlKSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fYXR0cihuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gZDMubnMucXVhbGlmeShuYW1lKTtcblxuICAvLyBGb3IgYXR0cihzdHJpbmcsIG51bGwpLCByZW1vdmUgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gYXR0ck51bGwoKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH1cbiAgZnVuY3Rpb24gYXR0ck51bGxOUygpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICB9XG5cbiAgLy8gRm9yIGF0dHIoc3RyaW5nLCBzdHJpbmcpLCBzZXQgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gYXR0ckNvbnN0YW50KCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfVxuICBmdW5jdGlvbiBhdHRyQ29uc3RhbnROUygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIEZvciBhdHRyKHN0cmluZywgZnVuY3Rpb24pLCBldmFsdWF0ZSB0aGUgZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudCwgYW5kIHNldFxuICAvLyBvciByZW1vdmUgdGhlIGF0dHJpYnV0ZSBhcyBhcHByb3ByaWF0ZS5cbiAgZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHgpO1xuICB9XG4gIGZ1bmN0aW9uIGF0dHJGdW5jdGlvbk5TKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsLCB4KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IChuYW1lLmxvY2FsID8gYXR0ck51bGxOUyA6IGF0dHJOdWxsKSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyAobmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKVxuICAgICAgOiAobmFtZS5sb2NhbCA/IGF0dHJDb25zdGFudE5TIDogYXR0ckNvbnN0YW50KSk7XG59XG5mdW5jdGlvbiBkM19jb2xsYXBzZShzKSB7XG4gIHJldHVybiBzLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbn1cbmQzLnJlcXVvdGUgPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzLnJlcGxhY2UoZDNfcmVxdW90ZV9yZSwgXCJcXFxcJCZcIik7XG59O1xuXG52YXIgZDNfcmVxdW90ZV9yZSA9IC9bXFxcXFxcXlxcJFxcKlxcK1xcP1xcfFxcW1xcXVxcKFxcKVxcLlxce1xcfV0vZztcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNsYXNzZWQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcblxuICAgIC8vIEZvciBjbGFzc2VkKHN0cmluZyksIHJldHVybiB0cnVlIG9ubHkgaWYgdGhlIGZpcnN0IG5vZGUgaGFzIHRoZSBzcGVjaWZpZWRcbiAgICAvLyBjbGFzcyBvciBjbGFzc2VzLiBOb3RlIHRoYXQgZXZlbiBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBET01Ub2tlbkxpc3QsIGl0XG4gICAgLy8gcHJvYmFibHkgZG9lc24ndCBzdXBwb3J0IGl0IG9uIFNWRyBlbGVtZW50cyAod2hpY2ggY2FuIGJlIGFuaW1hdGVkKS5cbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCksXG4gICAgICAgICAgbiA9IChuYW1lID0gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkpLmxlbmd0aCxcbiAgICAgICAgICBpID0gLTE7XG4gICAgICBpZiAodmFsdWUgPSBub2RlLmNsYXNzTGlzdCkge1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCF2YWx1ZS5jb250YWlucyhuYW1lW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFkM19zZWxlY3Rpb25fY2xhc3NlZFJlKG5hbWVbaV0pLnRlc3QodmFsdWUpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGb3IgY2xhc3NlZChvYmplY3QpLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgbmFtZXMgb2YgY2xhc3NlcyB0byBhZGQgb3JcbiAgICAvLyByZW1vdmUuIFRoZSB2YWx1ZXMgbWF5IGJlIGZ1bmN0aW9ucyB0aGF0IGFyZSBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fY2xhc3NlZCh2YWx1ZSwgbmFtZVt2YWx1ZV0pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYm90aCBhIG5hbWUgYW5kIGEgdmFsdWUgYXJlIHNwZWNpZmllZCwgYW5kIGFyZSBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9jbGFzc2VkKG5hbWUsIHZhbHVlKSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY2xhc3NlZFJlKG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoXCIoPzpefFxcXFxzKylcIiArIGQzLnJlcXVvdGUobmFtZSkgKyBcIig/OlxcXFxzK3wkKVwiLCBcImdcIik7XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VzKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWUudHJpbSgpLnNwbGl0KC9efFxccysvKTtcbn1cblxuLy8gTXVsdGlwbGUgY2xhc3MgbmFtZXMgYXJlIGFsbG93ZWQgKGUuZy4sIFwiZm9vIGJhclwiKS5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBkM19zZWxlY3Rpb25fY2xhc3NlcyhuYW1lKS5tYXAoZDNfc2VsZWN0aW9uX2NsYXNzZWROYW1lKTtcbiAgdmFyIG4gPSBuYW1lLmxlbmd0aDtcblxuICBmdW5jdGlvbiBjbGFzc2VkQ29uc3RhbnQoKSB7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB3aGlsZSAoKytpIDwgbikgbmFtZVtpXSh0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICAvLyBXaGVuIHRoZSB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCB0aGUgZnVuY3Rpb24gaXMgc3RpbGwgZXZhbHVhdGVkIG9ubHkgb25jZSBwZXJcbiAgLy8gZWxlbWVudCBldmVuIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjbGFzcyBuYW1lcy5cbiAgZnVuY3Rpb24gY2xhc3NlZEZ1bmN0aW9uKCkge1xuICAgIHZhciBpID0gLTEsIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHdoaWxlICgrK2kgPCBuKSBuYW1lW2ldKHRoaXMsIHgpO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGNsYXNzZWRGdW5jdGlvblxuICAgICAgOiBjbGFzc2VkQ29uc3RhbnQ7XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkTmFtZShuYW1lKSB7XG4gIHZhciByZSA9IGQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZSk7XG4gIHJldHVybiBmdW5jdGlvbihub2RlLCB2YWx1ZSkge1xuICAgIGlmIChjID0gbm9kZS5jbGFzc0xpc3QpIHJldHVybiB2YWx1ZSA/IGMuYWRkKG5hbWUpIDogYy5yZW1vdmUobmFtZSk7XG4gICAgdmFyIGMgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCI7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgICAgaWYgKCFyZS50ZXN0KGMpKSBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGQzX2NvbGxhcHNlKGMgKyBcIiBcIiArIG5hbWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBkM19jb2xsYXBzZShjLnJlcGxhY2UocmUsIFwiIFwiKSkpO1xuICAgIH1cbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnN0eWxlID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgaWYgKG4gPCAzKSB7XG5cbiAgICAvLyBGb3Igc3R5bGUob2JqZWN0KSBvciBzdHlsZShvYmplY3QsIHN0cmluZyksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZVxuICAgIC8vIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlIGF0dHJpYnV0ZXMgdG8gc2V0IG9yIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmVcbiAgICAvLyBmdW5jdGlvbnMgdGhhdCBhcmUgZXZhbHVhdGVkIGZvciBlYWNoIGVsZW1lbnQuIFRoZSBvcHRpb25hbCBzdHJpbmdcbiAgICAvLyBzcGVjaWZpZXMgdGhlIHByaW9yaXR5LlxuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKG4gPCAyKSB2YWx1ZSA9IFwiXCI7XG4gICAgICBmb3IgKHByaW9yaXR5IGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fc3R5bGUocHJpb3JpdHksIG5hbWVbcHJpb3JpdHldLCB2YWx1ZSkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gRm9yIHN0eWxlKHN0cmluZyksIHJldHVybiB0aGUgY29tcHV0ZWQgc3R5bGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBub2RlLlxuICAgIGlmIChuIDwgMikgcmV0dXJuIGQzX3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMubm9kZSgpLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xuXG4gICAgLy8gRm9yIHN0eWxlKHN0cmluZywgc3RyaW5nKSBvciBzdHlsZShzdHJpbmcsIGZ1bmN0aW9uKSwgdXNlIHRoZSBkZWZhdWx0XG4gICAgLy8gcHJpb3JpdHkuIFRoZSBwcmlvcml0eSBpcyBpZ25vcmVkIGZvciBzdHlsZShzdHJpbmcsIG51bGwpLlxuICAgIHByaW9yaXR5ID0gXCJcIjtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYSBuYW1lLCB2YWx1ZSBhbmQgcHJpb3JpdHkgYXJlIHNwZWNpZmllZCwgYW5kIGhhbmRsZWQgYXMgYmVsb3cuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX3N0eWxlKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3N0eWxlKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBudWxsKSBvciBzdHlsZShuYW1lLCBudWxsLCBwcmlvcml0eSksIHJlbW92ZSB0aGUgc3R5bGVcbiAgLy8gcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuIFRoZSBwcmlvcml0eSBpcyBpZ25vcmVkLlxuICBmdW5jdGlvbiBzdHlsZU51bGwoKSB7XG4gICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgfVxuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBzdHJpbmcpIG9yIHN0eWxlKG5hbWUsIHN0cmluZywgcHJpb3JpdHkpLCBzZXQgdGhlIHN0eWxlXG4gIC8vIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLCB1c2luZyB0aGUgc3BlY2lmaWVkIHByaW9yaXR5LlxuICBmdW5jdGlvbiBzdHlsZUNvbnN0YW50KCkge1xuICAgIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdmFsdWUsIHByaW9yaXR5KTtcbiAgfVxuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBmdW5jdGlvbikgb3Igc3R5bGUobmFtZSwgZnVuY3Rpb24sIHByaW9yaXR5KSwgZXZhbHVhdGUgdGhlXG4gIC8vIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQsIGFuZCBzZXQgb3IgcmVtb3ZlIHRoZSBzdHlsZSBwcm9wZXJ0eSBhc1xuICAvLyBhcHByb3ByaWF0ZS4gV2hlbiBzZXR0aW5nLCB1c2UgdGhlIHNwZWNpZmllZCBwcmlvcml0eS5cbiAgZnVuY3Rpb24gc3R5bGVGdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHggPT0gbnVsbCkgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgeCwgcHJpb3JpdHkpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gc3R5bGVOdWxsIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHN0eWxlRnVuY3Rpb24gOiBzdHlsZUNvbnN0YW50KTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnByb3BlcnR5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG5cbiAgICAvLyBGb3IgcHJvcGVydHkoc3RyaW5nKSwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiKSByZXR1cm4gdGhpcy5ub2RlKClbbmFtZV07XG5cbiAgICAvLyBGb3IgcHJvcGVydHkob2JqZWN0KSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlXG4gICAgLy8gcHJvcGVydGllcyB0byBzZXQgb3IgcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZSBmdW5jdGlvbnMgdGhhdCBhcmVcbiAgICAvLyBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fcHJvcGVydHkodmFsdWUsIG5hbWVbdmFsdWVdKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBPdGhlcndpc2UsIGJvdGggYSBuYW1lIGFuZCBhIHZhbHVlIGFyZSBzcGVjaWZpZWQsIGFuZCBhcmUgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fcHJvcGVydHkobmFtZSwgdmFsdWUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9wcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xuXG4gIC8vIEZvciBwcm9wZXJ0eShuYW1lLCBudWxsKSwgcmVtb3ZlIHRoZSBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlOdWxsKCkge1xuICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICB9XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIHN0cmluZyksIHNldCB0aGUgcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuXG4gIGZ1bmN0aW9uIHByb3BlcnR5Q29uc3RhbnQoKSB7XG4gICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIGZ1bmN0aW9uKSwgZXZhbHVhdGUgdGhlIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQsIGFuZFxuICAvLyBzZXQgb3IgcmVtb3ZlIHRoZSBwcm9wZXJ0eSBhcyBhcHByb3ByaWF0ZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlGdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHggPT0gbnVsbCkgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgZWxzZSB0aGlzW25hbWVdID0geDtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IHByb3BlcnR5TnVsbCA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBwcm9wZXJ0eUZ1bmN0aW9uIDogcHJvcGVydHlDb25zdGFudCk7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS50ZXh0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGZ1bmN0aW9uKCkgeyB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjsgfSA6IHZhbHVlID09IG51bGxcbiAgICAgID8gZnVuY3Rpb24oKSB7IHRoaXMudGV4dENvbnRlbnQgPSBcIlwiOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7IH0pXG4gICAgICA6IHRoaXMubm9kZSgpLnRleHRDb250ZW50O1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmh0bWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZnVuY3Rpb24oKSB7IHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjsgfSA6IHZhbHVlID09IG51bGxcbiAgICAgID8gZnVuY3Rpb24oKSB7IHRoaXMuaW5uZXJIVE1MID0gXCJcIjsgfVxuICAgICAgOiBmdW5jdGlvbigpIHsgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTsgfSlcbiAgICAgIDogdGhpcy5ub2RlKCkuaW5uZXJIVE1MO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kQ2hpbGQobmFtZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY3JlYXRvcihuYW1lKSB7XG4gIHJldHVybiB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZVxuICAgICAgOiAobmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZSkpLmxvY2FsID8gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5hbWVzcGFjZVVSSSwgbmFtZSk7IH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpO1xuICBiZWZvcmUgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3IoYmVmb3JlKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluc2VydEJlZm9yZShuYW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIGJlZm9yZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG51bGwpO1xuICB9KTtcbn07XG5cbi8vIFRPRE8gcmVtb3ZlKHNlbGVjdG9yKT9cbi8vIFRPRE8gcmVtb3ZlKG5vZGUpP1xuLy8gVE9ETyByZW1vdmUoZnVuY3Rpb24pP1xuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICB9KTtcbn07XG5mdW5jdGlvbiBkM19jbGFzcyhjdG9yLCBwcm9wZXJ0aWVzKSB7XG4gIHRyeSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdG9yLnByb3RvdHlwZSwga2V5LCB7XG4gICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzW2tleV0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjdG9yLnByb3RvdHlwZSA9IHByb3BlcnRpZXM7XG4gIH1cbn1cblxuZDMubWFwID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBtYXAgPSBuZXcgZDNfTWFwO1xuICBpZiAob2JqZWN0IGluc3RhbmNlb2YgZDNfTWFwKSBvYmplY3QuZm9yRWFjaChmdW5jdGlvbihrZXksIHZhbHVlKSB7IG1hcC5zZXQoa2V5LCB2YWx1ZSk7IH0pO1xuICBlbHNlIGZvciAodmFyIGtleSBpbiBvYmplY3QpIG1hcC5zZXQoa2V5LCBvYmplY3Rba2V5XSk7XG4gIHJldHVybiBtYXA7XG59O1xuXG5mdW5jdGlvbiBkM19NYXAoKSB7fVxuXG5kM19jbGFzcyhkM19NYXAsIHtcbiAgaGFzOiBkM19tYXBfaGFzLFxuICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiB0aGlzW2QzX21hcF9wcmVmaXggKyBrZXldO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpc1tkM19tYXBfcHJlZml4ICsga2V5XSA9IHZhbHVlO1xuICB9LFxuICByZW1vdmU6IGQzX21hcF9yZW1vdmUsXG4gIGtleXM6IGQzX21hcF9rZXlzLFxuICB2YWx1ZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyB2YWx1ZXMucHVzaCh2YWx1ZSk7IH0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0sXG4gIGVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbnRyaWVzID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgZW50cmllcy5wdXNoKHtrZXk6IGtleSwgdmFsdWU6IHZhbHVlfSk7IH0pO1xuICAgIHJldHVybiBlbnRyaWVzO1xuICB9LFxuICBzaXplOiBkM19tYXBfc2l6ZSxcbiAgZW1wdHk6IGQzX21hcF9lbXB0eSxcbiAgZm9yRWFjaDogZnVuY3Rpb24oZikge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSBmLmNhbGwodGhpcywga2V5LnN1YnN0cmluZygxKSwgdGhpc1trZXldKTtcbiAgfVxufSk7XG5cbnZhciBkM19tYXBfcHJlZml4ID0gXCJcXDBcIiwgLy8gcHJldmVudCBjb2xsaXNpb24gd2l0aCBidWlsdC1pbnNcbiAgICBkM19tYXBfcHJlZml4Q29kZSA9IGQzX21hcF9wcmVmaXguY2hhckNvZGVBdCgwKTtcblxuZnVuY3Rpb24gZDNfbWFwX2hhcyhrZXkpIHtcbiAgcmV0dXJuIGQzX21hcF9wcmVmaXggKyBrZXkgaW4gdGhpcztcbn1cblxuZnVuY3Rpb24gZDNfbWFwX3JlbW92ZShrZXkpIHtcbiAga2V5ID0gZDNfbWFwX3ByZWZpeCArIGtleTtcbiAgcmV0dXJuIGtleSBpbiB0aGlzICYmIGRlbGV0ZSB0aGlzW2tleV07XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9rZXlzKCkge1xuICB2YXIga2V5cyA9IFtdO1xuICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7IGtleXMucHVzaChrZXkpOyB9KTtcbiAgcmV0dXJuIGtleXM7XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9zaXplKCkge1xuICB2YXIgc2l6ZSA9IDA7XG4gIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSArK3NpemU7XG4gIHJldHVybiBzaXplO1xufVxuXG5mdW5jdGlvbiBkM19tYXBfZW1wdHkoKSB7XG4gIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgdmFyIGkgPSAtMSxcbiAgICAgIG4gPSB0aGlzLmxlbmd0aCxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICAvLyBJZiBubyB2YWx1ZSBpcyBzcGVjaWZpZWQsIHJldHVybiB0aGUgZmlyc3QgdmFsdWUuXG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHZhbHVlID0gbmV3IEFycmF5KG4gPSAoZ3JvdXAgPSB0aGlzWzBdKS5sZW5ndGgpO1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHZhbHVlW2ldID0gbm9kZS5fX2RhdGFfXztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gYmluZChncm91cCwgZ3JvdXBEYXRhKSB7XG4gICAgdmFyIGksXG4gICAgICAgIG4gPSBncm91cC5sZW5ndGgsXG4gICAgICAgIG0gPSBncm91cERhdGEubGVuZ3RoLFxuICAgICAgICBuMCA9IE1hdGgubWluKG4sIG0pLFxuICAgICAgICB1cGRhdGVOb2RlcyA9IG5ldyBBcnJheShtKSxcbiAgICAgICAgZW50ZXJOb2RlcyA9IG5ldyBBcnJheShtKSxcbiAgICAgICAgZXhpdE5vZGVzID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBub2RlLFxuICAgICAgICBub2RlRGF0YTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciBub2RlQnlLZXlWYWx1ZSA9IG5ldyBkM19NYXAsXG4gICAgICAgICAgZGF0YUJ5S2V5VmFsdWUgPSBuZXcgZDNfTWFwLFxuICAgICAgICAgIGtleVZhbHVlcyA9IFtdLFxuICAgICAgICAgIGtleVZhbHVlO1xuXG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIHtcbiAgICAgICAga2V5VmFsdWUgPSBrZXkuY2FsbChub2RlID0gZ3JvdXBbaV0sIG5vZGUuX19kYXRhX18sIGkpO1xuICAgICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlKSkge1xuICAgICAgICAgIGV4aXROb2Rlc1tpXSA9IG5vZGU7IC8vIGR1cGxpY2F0ZSBzZWxlY3Rpb24ga2V5XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBrZXlWYWx1ZXMucHVzaChrZXlWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBtOykge1xuICAgICAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKGdyb3VwRGF0YSwgbm9kZURhdGEgPSBncm91cERhdGFbaV0sIGkpO1xuICAgICAgICBpZiAobm9kZSA9IG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZSkpIHtcbiAgICAgICAgICB1cGRhdGVOb2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgICAgbm9kZS5fX2RhdGFfXyA9IG5vZGVEYXRhO1xuICAgICAgICB9IGVsc2UgaWYgKCFkYXRhQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7IC8vIG5vIGR1cGxpY2F0ZSBkYXRhIGtleVxuICAgICAgICAgIGVudGVyTm9kZXNbaV0gPSBkM19zZWxlY3Rpb25fZGF0YU5vZGUobm9kZURhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGRhdGFCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgbm9kZURhdGEpO1xuICAgICAgICBub2RlQnlLZXlWYWx1ZS5yZW1vdmUoa2V5VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIHtcbiAgICAgICAgaWYgKG5vZGVCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZXNbaV0pKSB7XG4gICAgICAgICAgZXhpdE5vZGVzW2ldID0gZ3JvdXBbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gLTE7ICsraSA8IG4wOykge1xuICAgICAgICBub2RlID0gZ3JvdXBbaV07XG4gICAgICAgIG5vZGVEYXRhID0gZ3JvdXBEYXRhW2ldO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIG5vZGUuX19kYXRhX18gPSBub2RlRGF0YTtcbiAgICAgICAgICB1cGRhdGVOb2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShub2RlRGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoOyBpIDwgbTsgKytpKSB7XG4gICAgICAgIGVudGVyTm9kZXNbaV0gPSBkM19zZWxlY3Rpb25fZGF0YU5vZGUoZ3JvdXBEYXRhW2ldKTtcbiAgICAgIH1cbiAgICAgIGZvciAoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGV4aXROb2Rlc1tpXSA9IGdyb3VwW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVudGVyTm9kZXMudXBkYXRlXG4gICAgICAgID0gdXBkYXRlTm9kZXM7XG5cbiAgICBlbnRlck5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSB1cGRhdGVOb2Rlcy5wYXJlbnROb2RlXG4gICAgICAgID0gZXhpdE5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSBncm91cC5wYXJlbnROb2RlO1xuXG4gICAgZW50ZXIucHVzaChlbnRlck5vZGVzKTtcbiAgICB1cGRhdGUucHVzaCh1cGRhdGVOb2Rlcyk7XG4gICAgZXhpdC5wdXNoKGV4aXROb2Rlcyk7XG4gIH1cblxuICB2YXIgZW50ZXIgPSBkM19zZWxlY3Rpb25fZW50ZXIoW10pLFxuICAgICAgdXBkYXRlID0gZDNfc2VsZWN0aW9uKFtdKSxcbiAgICAgIGV4aXQgPSBkM19zZWxlY3Rpb24oW10pO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBiaW5kKGdyb3VwID0gdGhpc1tpXSwgdmFsdWUuY2FsbChncm91cCwgZ3JvdXAucGFyZW50Tm9kZS5fX2RhdGFfXywgaSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgYmluZChncm91cCA9IHRoaXNbaV0sIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUuZW50ZXIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGVudGVyOyB9O1xuICB1cGRhdGUuZXhpdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZXhpdDsgfTtcbiAgcmV0dXJuIHVwZGF0ZTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9kYXRhTm9kZShkYXRhKSB7XG4gIHJldHVybiB7X19kYXRhX186IGRhdGF9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZGF0dW0gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpXG4gICAgICA6IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiKTtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgdmFyIHN1Ymdyb3VwcyA9IFtdLFxuICAgICAgc3ViZ3JvdXAsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgaWYgKHR5cGVvZiBmaWx0ZXIgIT09IFwiZnVuY3Rpb25cIikgZmlsdGVyID0gZDNfc2VsZWN0aW9uX2ZpbHRlcihmaWx0ZXIpO1xuXG4gIGZvciAodmFyIGogPSAwLCBtID0gdGhpcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBzdWJncm91cC5wYXJlbnROb2RlID0gKGdyb3VwID0gdGhpc1tqXSkucGFyZW50Tm9kZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIGZpbHRlci5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2ZpbHRlcihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdE1hdGNoZXModGhpcywgc2VsZWN0b3IpO1xuICB9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUub3JkZXIgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gZ3JvdXAubGVuZ3RoIC0gMSwgbmV4dCA9IGdyb3VwW2ldLCBub2RlOyAtLWkgPj0gMDspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgaWYgKG5leHQgJiYgbmV4dCAhPT0gbm9kZS5uZXh0U2libGluZykgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcbmQzLmFzY2VuZGluZyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gIGNvbXBhcmF0b3IgPSBkM19zZWxlY3Rpb25fc29ydENvbXBhcmF0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB0aGlzW2pdLnNvcnQoY29tcGFyYXRvcik7XG4gIHJldHVybiB0aGlzLm9yZGVyKCk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc29ydENvbXBhcmF0b3IoY29tcGFyYXRvcikge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIGNvbXBhcmF0b3IgPSBkMy5hc2NlbmRpbmc7XG4gIHJldHVybiBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmF0b3IoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICB9O1xufVxuZnVuY3Rpb24gZDNfbm9vcCgpIHt9XG5cbmQzLmRpc3BhdGNoID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkaXNwYXRjaCA9IG5ldyBkM19kaXNwYXRjaCxcbiAgICAgIGkgPSAtMSxcbiAgICAgIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgZGlzcGF0Y2hbYXJndW1lbnRzW2ldXSA9IGQzX2Rpc3BhdGNoX2V2ZW50KGRpc3BhdGNoKTtcbiAgcmV0dXJuIGRpc3BhdGNoO1xufTtcblxuZnVuY3Rpb24gZDNfZGlzcGF0Y2goKSB7fVxuXG5kM19kaXNwYXRjaC5wcm90b3R5cGUub24gPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgaSA9IHR5cGUuaW5kZXhPZihcIi5cIiksXG4gICAgICBuYW1lID0gXCJcIjtcblxuICAvLyBFeHRyYWN0IG9wdGlvbmFsIG5hbWVzcGFjZSwgZS5nLiwgXCJjbGljay5mb29cIlxuICBpZiAoaSA+PSAwKSB7XG4gICAgbmFtZSA9IHR5cGUuc3Vic3RyaW5nKGkgKyAxKTtcbiAgICB0eXBlID0gdHlwZS5zdWJzdHJpbmcoMCwgaSk7XG4gIH1cblxuICBpZiAodHlwZSkgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgICA/IHRoaXNbdHlwZV0ub24obmFtZSlcbiAgICAgIDogdGhpc1t0eXBlXS5vbihuYW1lLCBsaXN0ZW5lcik7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkgZm9yICh0eXBlIGluIHRoaXMpIHtcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHR5cGUpKSB0aGlzW3R5cGVdLm9uKG5hbWUsIG51bGwpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxuZnVuY3Rpb24gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpIHtcbiAgdmFyIGxpc3RlbmVycyA9IFtdLFxuICAgICAgbGlzdGVuZXJCeU5hbWUgPSBuZXcgZDNfTWFwO1xuXG4gIGZ1bmN0aW9uIGV2ZW50KCkge1xuICAgIHZhciB6ID0gbGlzdGVuZXJzLCAvLyBkZWZlbnNpdmUgcmVmZXJlbmNlXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgbiA9IHoubGVuZ3RoLFxuICAgICAgICBsO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAobCA9IHpbaV0ub24pIGwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gZGlzcGF0Y2g7XG4gIH1cblxuICBldmVudC5vbiA9IGZ1bmN0aW9uKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIGwgPSBsaXN0ZW5lckJ5TmFtZS5nZXQobmFtZSksXG4gICAgICAgIGk7XG5cbiAgICAvLyByZXR1cm4gdGhlIGN1cnJlbnQgbGlzdGVuZXIsIGlmIGFueVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIGwgJiYgbC5vbjtcblxuICAgIC8vIHJlbW92ZSB0aGUgb2xkIGxpc3RlbmVyLCBpZiBhbnkgKHdpdGggY29weS1vbi13cml0ZSlcbiAgICBpZiAobCkge1xuICAgICAgbC5vbiA9IG51bGw7XG4gICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuc2xpY2UoMCwgaSA9IGxpc3RlbmVycy5pbmRleE9mKGwpKS5jb25jYXQobGlzdGVuZXJzLnNsaWNlKGkgKyAxKSk7XG4gICAgICBsaXN0ZW5lckJ5TmFtZS5yZW1vdmUobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoZSBuZXcgbGlzdGVuZXIsIGlmIGFueVxuICAgIGlmIChsaXN0ZW5lcikgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXJCeU5hbWUuc2V0KG5hbWUsIHtvbjogbGlzdGVuZXJ9KSk7XG5cbiAgICByZXR1cm4gZGlzcGF0Y2g7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5kMy5ldmVudCA9IG51bGw7XG5cbmZ1bmN0aW9uIGQzX2V2ZW50UHJldmVudERlZmF1bHQoKSB7XG4gIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59XG5cbmZ1bmN0aW9uIGQzX2V2ZW50U291cmNlKCkge1xuICB2YXIgZSA9IGQzLmV2ZW50LCBzO1xuICB3aGlsZSAocyA9IGUuc291cmNlRXZlbnQpIGUgPSBzO1xuICByZXR1cm4gZTtcbn1cblxuLy8gTGlrZSBkMy5kaXNwYXRjaCwgYnV0IGZvciBjdXN0b20gZXZlbnRzIGFic3RyYWN0aW5nIG5hdGl2ZSBVSSBldmVudHMuIFRoZXNlXG4vLyBldmVudHMgaGF2ZSBhIHRhcmdldCBjb21wb25lbnQgKHN1Y2ggYXMgYSBicnVzaCksIGEgdGFyZ2V0IGVsZW1lbnQgKHN1Y2ggYXNcbi8vIHRoZSBzdmc6ZyBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIGJydXNoKSBhbmQgdGhlIHN0YW5kYXJkIGFyZ3VtZW50cyBgZGAgKHRoZVxuLy8gdGFyZ2V0IGVsZW1lbnQncyBkYXRhKSBhbmQgYGlgICh0aGUgc2VsZWN0aW9uIGluZGV4IG9mIHRoZSB0YXJnZXQgZWxlbWVudCkuXG5mdW5jdGlvbiBkM19ldmVudERpc3BhdGNoKHRhcmdldCkge1xuICB2YXIgZGlzcGF0Y2ggPSBuZXcgZDNfZGlzcGF0Y2gsXG4gICAgICBpID0gMCxcbiAgICAgIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2kgPCBuKSBkaXNwYXRjaFthcmd1bWVudHNbaV1dID0gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpO1xuXG4gIC8vIENyZWF0ZXMgYSBkaXNwYXRjaCBjb250ZXh0IGZvciB0aGUgc3BlY2lmaWVkIGB0aGl6YCAodHlwaWNhbGx5LCB0aGUgdGFyZ2V0XG4gIC8vIERPTSBlbGVtZW50IHRoYXQgcmVjZWl2ZWQgdGhlIHNvdXJjZSBldmVudCkgYW5kIGBhcmd1bWVudHpgICh0eXBpY2FsbHksIHRoZVxuICAvLyBkYXRhIGBkYCBhbmQgaW5kZXggYGlgIG9mIHRoZSB0YXJnZXQgZWxlbWVudCkuIFRoZSByZXR1cm5lZCBmdW5jdGlvbiBjYW4gYmVcbiAgLy8gdXNlZCB0byBkaXNwYXRjaCBhbiBldmVudCB0byBhbnkgcmVnaXN0ZXJlZCBsaXN0ZW5lcnM7IHRoZSBmdW5jdGlvbiB0YWtlcyBhXG4gIC8vIHNpbmdsZSBhcmd1bWVudCBhcyBpbnB1dCwgYmVpbmcgdGhlIGV2ZW50IHRvIGRpc3BhdGNoLiBUaGUgZXZlbnQgbXVzdCBoYXZlXG4gIC8vIGEgXCJ0eXBlXCIgYXR0cmlidXRlIHdoaWNoIGNvcnJlc3BvbmRzIHRvIGEgdHlwZSByZWdpc3RlcmVkIGluIHRoZVxuICAvLyBjb25zdHJ1Y3Rvci4gVGhpcyBjb250ZXh0IHdpbGwgYXV0b21hdGljYWxseSBwb3B1bGF0ZSB0aGUgXCJzb3VyY2VFdmVudFwiIGFuZFxuICAvLyBcInRhcmdldFwiIGF0dHJpYnV0ZXMgb2YgdGhlIGV2ZW50LCBhcyB3ZWxsIGFzIHNldHRpbmcgdGhlIGBkMy5ldmVudGAgZ2xvYmFsXG4gIC8vIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIG5vdGlmaWNhdGlvbi5cbiAgZGlzcGF0Y2gub2YgPSBmdW5jdGlvbih0aGl6LCBhcmd1bWVudHopIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZTEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBlMCA9XG4gICAgICAgIGUxLnNvdXJjZUV2ZW50ID0gZDMuZXZlbnQ7XG4gICAgICAgIGUxLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgZDMuZXZlbnQgPSBlMTtcbiAgICAgICAgZGlzcGF0Y2hbZTEudHlwZV0uYXBwbHkodGhpeiwgYXJndW1lbnR6KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGQzLmV2ZW50ID0gZTA7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gZGlzcGF0Y2g7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG4gIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgaWYgKG4gPCAzKSB7XG5cbiAgICAvLyBGb3Igb24ob2JqZWN0KSBvciBvbihvYmplY3QsIGJvb2xlYW4pLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgZXZlbnRcbiAgICAvLyB0eXBlcyBhbmQgbGlzdGVuZXJzIHRvIGFkZCBvciByZW1vdmUuIFRoZSBvcHRpb25hbCBib29sZWFuIHNwZWNpZmllc1xuICAgIC8vIHdoZXRoZXIgdGhlIGxpc3RlbmVyIGNhcHR1cmVzIGV2ZW50cy5cbiAgICBpZiAodHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGlmIChuIDwgMikgbGlzdGVuZXIgPSBmYWxzZTtcbiAgICAgIGZvciAoY2FwdHVyZSBpbiB0eXBlKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX29uKGNhcHR1cmUsIHR5cGVbY2FwdHVyZV0sIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBGb3Igb24oc3RyaW5nKSwgcmV0dXJuIHRoZSBsaXN0ZW5lciBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKG4gPCAyKSByZXR1cm4gKG4gPSB0aGlzLm5vZGUoKVtcIl9fb25cIiArIHR5cGVdKSAmJiBuLl87XG5cbiAgICAvLyBGb3Igb24oc3RyaW5nLCBmdW5jdGlvbiksIHVzZSB0aGUgZGVmYXVsdCBjYXB0dXJlLlxuICAgIGNhcHR1cmUgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYSB0eXBlLCBsaXN0ZW5lciBhbmQgY2FwdHVyZSBhcmUgc3BlY2lmaWVkLCBhbmQgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbih0eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkge1xuICB2YXIgbmFtZSA9IFwiX19vblwiICsgdHlwZSxcbiAgICAgIGkgPSB0eXBlLmluZGV4T2YoXCIuXCIpLFxuICAgICAgd3JhcCA9IGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyO1xuXG4gIGlmIChpID4gMCkgdHlwZSA9IHR5cGUuc3Vic3RyaW5nKDAsIGkpO1xuICB2YXIgZmlsdGVyID0gZDNfc2VsZWN0aW9uX29uRmlsdGVycy5nZXQodHlwZSk7XG4gIGlmIChmaWx0ZXIpIHR5cGUgPSBmaWx0ZXIsIHdyYXAgPSBkM19zZWxlY3Rpb25fb25GaWx0ZXI7XG5cbiAgZnVuY3Rpb24gb25SZW1vdmUoKSB7XG4gICAgdmFyIGwgPSB0aGlzW25hbWVdO1xuICAgIGlmIChsKSB7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbCwgbC4kKTtcbiAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uQWRkKCkge1xuICAgIHZhciBsID0gd3JhcChsaXN0ZW5lciwgZDNfYXJyYXkoYXJndW1lbnRzKSk7XG4gICAgb25SZW1vdmUuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgdGhpc1tuYW1lXSA9IGwsIGwuJCA9IGNhcHR1cmUpO1xuICAgIGwuXyA9IGxpc3RlbmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQWxsKCkge1xuICAgIHZhciByZSA9IG5ldyBSZWdFeHAoXCJeX19vbihbXi5dKylcIiArIGQzLnJlcXVvdGUodHlwZSkgKyBcIiRcIiksXG4gICAgICAgIG1hdGNoO1xuICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgaWYgKG1hdGNoID0gbmFtZS5tYXRjaChyZSkpIHtcbiAgICAgICAgdmFyIGwgPSB0aGlzW25hbWVdO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIobWF0Y2hbMV0sIGwsIGwuJCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpXG4gICAgICA/IGxpc3RlbmVyID8gb25BZGQgOiBvblJlbW92ZVxuICAgICAgOiBsaXN0ZW5lciA/IGQzX25vb3AgOiByZW1vdmVBbGw7XG59XG5cbnZhciBkM19zZWxlY3Rpb25fb25GaWx0ZXJzID0gZDMubWFwKHtcbiAgbW91c2VlbnRlcjogXCJtb3VzZW92ZXJcIixcbiAgbW91c2VsZWF2ZTogXCJtb3VzZW91dFwiXG59KTtcblxuZDNfc2VsZWN0aW9uX29uRmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgaWYgKFwib25cIiArIGsgaW4gZDNfZG9jdW1lbnQpIGQzX3NlbGVjdGlvbl9vbkZpbHRlcnMucmVtb3ZlKGspO1xufSk7XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyKGxpc3RlbmVyLCBhcmd1bWVudHopIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgbyA9IGQzLmV2ZW50OyAvLyBFdmVudHMgY2FuIGJlIHJlZW50cmFudCAoZS5nLiwgZm9jdXMpLlxuICAgIGQzLmV2ZW50ID0gZTtcbiAgICBhcmd1bWVudHpbMF0gPSB0aGlzLl9fZGF0YV9fO1xuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHopO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBkMy5ldmVudCA9IG87XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fb25GaWx0ZXIobGlzdGVuZXIsIGFyZ3VtZW50eikge1xuICB2YXIgbCA9IGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyKGxpc3RlbmVyLCBhcmd1bWVudHopO1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLCByZWxhdGVkID0gZS5yZWxhdGVkVGFyZ2V0O1xuICAgIGlmICghcmVsYXRlZCB8fCAocmVsYXRlZCAhPT0gdGFyZ2V0ICYmICEocmVsYXRlZC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbih0YXJnZXQpICYgOCkpKSB7XG4gICAgICBsLmNhbGwodGFyZ2V0LCBlKTtcbiAgICB9XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbl9lYWNoKHRoaXMsIGZ1bmN0aW9uKG5vZGUsIGksIGopIHtcbiAgICBjYWxsYmFjay5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lYWNoKGdyb3VwcywgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBjYWxsYmFjayhub2RlLCBpLCBqKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGdyb3Vwcztcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgYXJncyA9IGQzX2FycmF5KGFyZ3VtZW50cyk7XG4gIGNhbGxiYWNrLmFwcGx5KGFyZ3NbMF0gPSB0aGlzLCBhcmdzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLm5vZGUoKTtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5ub2RlID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGogPSAwLCBtID0gdGhpcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IGdyb3VwW2ldO1xuICAgICAgaWYgKG5vZGUpIHJldHVybiBub2RlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuID0gMDtcbiAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkgeyArK247IH0pO1xuICByZXR1cm4gbjtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lbnRlcihzZWxlY3Rpb24pIHtcbiAgZDNfc3ViY2xhc3Moc2VsZWN0aW9uLCBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUpO1xuICByZXR1cm4gc2VsZWN0aW9uO1xufVxuXG52YXIgZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlID0gW107XG5cbmQzLnNlbGVjdGlvbi5lbnRlciA9IGQzX3NlbGVjdGlvbl9lbnRlcjtcbmQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUgPSBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGU7XG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5hcHBlbmQgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuYXBwZW5kO1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmVtcHR5ID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVtcHR5O1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLm5vZGUgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUubm9kZTtcbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5jYWxsID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNhbGw7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuc2l6ZSA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5zaXplO1xuXG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIHN1Ym5vZGUsXG4gICAgICB1cGdyb3VwLFxuICAgICAgZ3JvdXAsXG4gICAgICBub2RlO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIHVwZ3JvdXAgPSAoZ3JvdXAgPSB0aGlzW2pdKS51cGRhdGU7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IGdyb3VwLnBhcmVudE5vZGU7XG4gICAgZm9yICh2YXIgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKHVwZ3JvdXBbaV0gPSBzdWJub2RlID0gc2VsZWN0b3IuY2FsbChncm91cC5wYXJlbnROb2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSk7XG4gICAgICAgIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24obmFtZSwgYmVmb3JlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgYmVmb3JlID0gZDNfc2VsZWN0aW9uX2VudGVySW5zZXJ0QmVmb3JlKHRoaXMpO1xuICByZXR1cm4gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmluc2VydC5jYWxsKHRoaXMsIG5hbWUsIGJlZm9yZSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fZW50ZXJJbnNlcnRCZWZvcmUoZW50ZXIpIHtcbiAgdmFyIGkwLCBqMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKGQsIGksIGopIHtcbiAgICB2YXIgZ3JvdXAgPSBlbnRlcltqXS51cGRhdGUsXG4gICAgICAgIG4gPSBncm91cC5sZW5ndGgsXG4gICAgICAgIG5vZGU7XG4gICAgaWYgKGogIT0gajApIGowID0gaiwgaTAgPSAwO1xuICAgIGlmIChpID49IGkwKSBpMCA9IGkgKyAxO1xuICAgIHdoaWxlICghKG5vZGUgPSBncm91cFtpMF0pICYmICsraTAgPCBuKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcbn1cblxuLy8gaW1wb3J0IFwiLi4vdHJhbnNpdGlvbi90cmFuc2l0aW9uXCI7XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS50cmFuc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpZCA9IGQzX3RyYW5zaXRpb25Jbmhlcml0SWQgfHwgKytkM190cmFuc2l0aW9uSWQsXG4gICAgICBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgbm9kZSxcbiAgICAgIHRyYW5zaXRpb24gPSBkM190cmFuc2l0aW9uSW5oZXJpdCB8fCB7dGltZTogRGF0ZS5ub3coKSwgZWFzZTogZDNfZWFzZV9jdWJpY0luT3V0LCBkZWxheTogMCwgZHVyYXRpb246IDI1MH07XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBkM190cmFuc2l0aW9uTm9kZShub2RlLCBpLCBpZCwgdHJhbnNpdGlvbik7XG4gICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkM190cmFuc2l0aW9uKHN1Ymdyb3VwcywgaWQpO1xufTtcbi8vIGltcG9ydCBcIi4uL3RyYW5zaXRpb24vdHJhbnNpdGlvblwiO1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuaW50ZXJydXB0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2ludGVycnVwdCk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25faW50ZXJydXB0KCkge1xuICB2YXIgbG9jayA9IHRoaXMuX190cmFuc2l0aW9uX187XG4gIGlmIChsb2NrKSArK2xvY2suYWN0aXZlO1xufVxuXG4vLyBUT0RPIGZhc3Qgc2luZ2xldG9uIGltcGxlbWVudGF0aW9uP1xuZDMuc2VsZWN0ID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgZ3JvdXAgPSBbdHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIgPyBkM19zZWxlY3Qobm9kZSwgZDNfZG9jdW1lbnQpIDogbm9kZV07XG4gIGdyb3VwLnBhcmVudE5vZGUgPSBkM19kb2N1bWVudEVsZW1lbnQ7XG4gIHJldHVybiBkM19zZWxlY3Rpb24oW2dyb3VwXSk7XG59O1xuXG5kMy5zZWxlY3RBbGwgPSBmdW5jdGlvbihub2Rlcykge1xuICB2YXIgZ3JvdXAgPSBkM19hcnJheSh0eXBlb2Ygbm9kZXMgPT09IFwic3RyaW5nXCIgPyBkM19zZWxlY3RBbGwobm9kZXMsIGQzX2RvY3VtZW50KSA6IG5vZGVzKTtcbiAgZ3JvdXAucGFyZW50Tm9kZSA9IGQzX2RvY3VtZW50RWxlbWVudDtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihbZ3JvdXBdKTtcbn07XG5cbnZhciBkM19zZWxlY3Rpb25Sb290ID0gZDMuc2VsZWN0KGQzX2RvY3VtZW50RWxlbWVudCk7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShkMyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZDM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kMyA9IGQzO1xuICB9XG59KCk7XG4iLCJmdW5jdGlvbiB4aHIodXJsLCBjYWxsYmFjaywgY29ycykge1xuICAgIHZhciBzZW50ID0gZmFsc2U7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdy5YTUxIdHRwUmVxdWVzdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKEVycm9yKCdCcm93c2VyIG5vdCBzdXBwb3J0ZWQnKSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjb3JzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgbSA9IHVybC5tYXRjaCgvXlxccypodHRwcz86XFwvXFwvW15cXC9dKi8pO1xuICAgICAgICBjb3JzID0gbSAmJiAobVswXSAhPT0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uZG9tYWluICtcbiAgICAgICAgICAgICAgICAobG9jYXRpb24ucG9ydCA/ICc6JyArIGxvY2F0aW9uLnBvcnQgOiAnJykpO1xuICAgIH1cblxuICAgIHZhciB4O1xuXG4gICAgZnVuY3Rpb24gaXNTdWNjZXNzZnVsKHN0YXR1cykge1xuICAgICAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDAgfHwgc3RhdHVzID09PSAzMDQ7XG4gICAgfVxuXG4gICAgaWYgKGNvcnMgJiYgKFxuICAgICAgICAvLyBJRTctOSBRdWlya3MgJiBDb21wYXRpYmlsaXR5XG4gICAgICAgIHR5cGVvZiB3aW5kb3cuWERvbWFpblJlcXVlc3QgPT09ICdvYmplY3QnIHx8XG4gICAgICAgIC8vIElFOSBTdGFuZGFyZHMgbW9kZVxuICAgICAgICB0eXBlb2Ygd2luZG93LlhEb21haW5SZXF1ZXN0ID09PSAnZnVuY3Rpb24nXG4gICAgKSkge1xuICAgICAgICAvLyBJRTgtMTBcbiAgICAgICAgeCA9IG5ldyB3aW5kb3cuWERvbWFpblJlcXVlc3QoKTtcblxuICAgICAgICAvLyBFbnN1cmUgY2FsbGJhY2sgaXMgbmV2ZXIgY2FsbGVkIHN5bmNocm9ub3VzbHksIGkuZS4sIGJlZm9yZVxuICAgICAgICAvLyB4LnNlbmQoKSByZXR1cm5zICh0aGlzIGhhcyBiZWVuIG9ic2VydmVkIGluIHRoZSB3aWxkKS5cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXBib3gvbWFwYm94LmpzL2lzc3Vlcy80NzJcbiAgICAgICAgdmFyIG9yaWdpbmFsID0gY2FsbGJhY2s7XG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoc2VudCkge1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbC5hcHBseSh0aGF0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHggPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZGVkKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAvLyBYRG9tYWluUmVxdWVzdFxuICAgICAgICAgICAgeC5zdGF0dXMgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgLy8gbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgICAgICBpc1N1Y2Nlc3NmdWwoeC5zdGF0dXMpKSBjYWxsYmFjay5jYWxsKHgsIG51bGwsIHgpO1xuICAgICAgICBlbHNlIGNhbGxiYWNrLmNhbGwoeCwgeCwgbnVsbCk7XG4gICAgfVxuXG4gICAgLy8gQm90aCBgb25yZWFkeXN0YXRlY2hhbmdlYCBhbmQgYG9ubG9hZGAgY2FuIGZpcmUuIGBvbnJlYWR5c3RhdGVjaGFuZ2VgXG4gICAgLy8gaGFzIFtiZWVuIHN1cHBvcnRlZCBmb3IgbG9uZ2VyXShodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85MTgxNTA4LzIyOTAwMSkuXG4gICAgaWYgKCdvbmxvYWQnIGluIHgpIHtcbiAgICAgICAgeC5vbmxvYWQgPSBsb2FkZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiByZWFkeXN0YXRlKCkge1xuICAgICAgICAgICAgaWYgKHgucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIGxvYWRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIHdpdGggdGhlIFhNTEh0dHBSZXF1ZXN0IG9iamVjdCBhcyBhbiBlcnJvciBhbmQgcHJldmVudFxuICAgIC8vIGl0IGZyb20gZXZlciBiZWluZyBjYWxsZWQgYWdhaW4gYnkgcmVhc3NpZ25pbmcgaXQgdG8gYG5vb3BgXG4gICAgeC5vbmVycm9yID0gZnVuY3Rpb24gZXJyb3IoZXZ0KSB7XG4gICAgICAgIC8vIFhEb21haW5SZXF1ZXN0IHByb3ZpZGVzIG5vIGV2dCBwYXJhbWV0ZXJcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBldnQgfHwgdHJ1ZSwgbnVsbCk7XG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7IH07XG4gICAgfTtcblxuICAgIC8vIElFOSBtdXN0IGhhdmUgb25wcm9ncmVzcyBiZSBzZXQgdG8gYSB1bmlxdWUgZnVuY3Rpb24uXG4gICAgeC5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7IH07XG5cbiAgICB4Lm9udGltZW91dCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2dCwgbnVsbCk7XG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7IH07XG4gICAgfTtcblxuICAgIHgub25hYm9ydCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2dCwgbnVsbCk7XG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7IH07XG4gICAgfTtcblxuICAgIC8vIEdFVCBpcyB0aGUgb25seSBzdXBwb3J0ZWQgSFRUUCBWZXJiIGJ5IFhEb21haW5SZXF1ZXN0IGFuZCBpcyB0aGVcbiAgICAvLyBvbmx5IG9uZSBzdXBwb3J0ZWQgaGVyZS5cbiAgICB4Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0LiBTZW5kaW5nIGRhdGEgaXMgbm90IHN1cHBvcnRlZC5cbiAgICB4LnNlbmQobnVsbCk7XG4gICAgc2VudCA9IHRydWU7XG5cbiAgICByZXR1cm4geDtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IHhocjtcbiIsIi8qKlxuICogRGVib3VuY2VzIGEgZnVuY3Rpb24gYnkgdGhlIGdpdmVuIHRocmVzaG9sZC5cbiAqXG4gKiBAc2VlIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jdGlvbiB0byB3cmFwXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZW91dCBpbiBtcyAoYDEwMGApXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHdoZXRoZXIgdG8gZXhlY3V0ZSBhdCB0aGUgYmVnaW5uaW5nIChgZmFsc2VgKVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHRocmVzaG9sZCwgZXhlY0FzYXApe1xuICB2YXIgdGltZW91dDtcblxuICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkKCl7XG4gICAgdmFyIG9iaiA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICBmdW5jdGlvbiBkZWxheWVkICgpIHtcbiAgICAgIGlmICghZXhlY0FzYXApIHtcbiAgICAgICAgZnVuYy5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgfVxuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB9IGVsc2UgaWYgKGV4ZWNBc2FwKSB7XG4gICAgICBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgfVxuXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoZGVsYXllZCwgdGhyZXNob2xkIHx8IDEwMCk7XG4gIH07XG59O1xuIiwidmFyIHBvbHlsaW5lID0ge307XG5cbi8vIEJhc2VkIG9mZiBvZiBbdGhlIG9mZmljYWwgR29vZ2xlIGRvY3VtZW50XShodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vdXRpbGl0aWVzL3BvbHlsaW5lYWxnb3JpdGhtKVxuLy9cbi8vIFNvbWUgcGFydHMgZnJvbSBbdGhpcyBpbXBsZW1lbnRhdGlvbl0oaHR0cDovL2ZhY3N0YWZmLnVuY2EuZWR1L21jbWNjbHVyL0dvb2dsZU1hcHMvRW5jb2RlUG9seWxpbmUvUG9seWxpbmVFbmNvZGVyLmpzKVxuLy8gYnkgW01hcmsgTWNDbHVyZV0oaHR0cDovL2ZhY3N0YWZmLnVuY2EuZWR1L21jbWNjbHVyLylcblxuZnVuY3Rpb24gZW5jb2RlKGNvb3JkaW5hdGUsIGZhY3Rvcikge1xuICAgIGNvb3JkaW5hdGUgPSBNYXRoLnJvdW5kKGNvb3JkaW5hdGUgKiBmYWN0b3IpO1xuICAgIGNvb3JkaW5hdGUgPDw9IDE7XG4gICAgaWYgKGNvb3JkaW5hdGUgPCAwKSB7XG4gICAgICAgIGNvb3JkaW5hdGUgPSB+Y29vcmRpbmF0ZTtcbiAgICB9XG4gICAgdmFyIG91dHB1dCA9ICcnO1xuICAgIHdoaWxlIChjb29yZGluYXRlID49IDB4MjApIHtcbiAgICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKDB4MjAgfCAoY29vcmRpbmF0ZSAmIDB4MWYpKSArIDYzKTtcbiAgICAgICAgY29vcmRpbmF0ZSA+Pj0gNTtcbiAgICB9XG4gICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29vcmRpbmF0ZSArIDYzKTtcbiAgICByZXR1cm4gb3V0cHV0O1xufVxuXG4vLyBUaGlzIGlzIGFkYXB0ZWQgZnJvbSB0aGUgaW1wbGVtZW50YXRpb24gaW4gUHJvamVjdC1PU1JNXG4vLyBodHRwczovL2dpdGh1Yi5jb20vRGVubmlzT1NSTS9Qcm9qZWN0LU9TUk0tV2ViL2Jsb2IvbWFzdGVyL1dlYkNvbnRlbnQvcm91dGluZy9PU1JNLlJvdXRpbmdHZW9tZXRyeS5qc1xucG9seWxpbmUuZGVjb2RlID0gZnVuY3Rpb24oc3RyLCBwcmVjaXNpb24pIHtcbiAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICBsYXQgPSAwLFxuICAgICAgICBsbmcgPSAwLFxuICAgICAgICBjb29yZGluYXRlcyA9IFtdLFxuICAgICAgICBzaGlmdCA9IDAsXG4gICAgICAgIHJlc3VsdCA9IDAsXG4gICAgICAgIGJ5dGUgPSBudWxsLFxuICAgICAgICBsYXRpdHVkZV9jaGFuZ2UsXG4gICAgICAgIGxvbmdpdHVkZV9jaGFuZ2UsXG4gICAgICAgIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24gfHwgNSk7XG5cbiAgICAvLyBDb29yZGluYXRlcyBoYXZlIHZhcmlhYmxlIGxlbmd0aCB3aGVuIGVuY29kZWQsIHNvIGp1c3Qga2VlcFxuICAgIC8vIHRyYWNrIG9mIHdoZXRoZXIgd2UndmUgaGl0IHRoZSBlbmQgb2YgdGhlIHN0cmluZy4gSW4gZWFjaFxuICAgIC8vIGxvb3AgaXRlcmF0aW9uLCBhIHNpbmdsZSBjb29yZGluYXRlIGlzIGRlY29kZWQuXG4gICAgd2hpbGUgKGluZGV4IDwgc3RyLmxlbmd0aCkge1xuXG4gICAgICAgIC8vIFJlc2V0IHNoaWZ0LCByZXN1bHQsIGFuZCBieXRlXG4gICAgICAgIGJ5dGUgPSBudWxsO1xuICAgICAgICBzaGlmdCA9IDA7XG4gICAgICAgIHJlc3VsdCA9IDA7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgYnl0ZSA9IHN0ci5jaGFyQ29kZUF0KGluZGV4KyspIC0gNjM7XG4gICAgICAgICAgICByZXN1bHQgfD0gKGJ5dGUgJiAweDFmKSA8PCBzaGlmdDtcbiAgICAgICAgICAgIHNoaWZ0ICs9IDU7XG4gICAgICAgIH0gd2hpbGUgKGJ5dGUgPj0gMHgyMCk7XG5cbiAgICAgICAgbGF0aXR1ZGVfY2hhbmdlID0gKChyZXN1bHQgJiAxKSA/IH4ocmVzdWx0ID4+IDEpIDogKHJlc3VsdCA+PiAxKSk7XG5cbiAgICAgICAgc2hpZnQgPSByZXN1bHQgPSAwO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGJ5dGUgPSBzdHIuY2hhckNvZGVBdChpbmRleCsrKSAtIDYzO1xuICAgICAgICAgICAgcmVzdWx0IHw9IChieXRlICYgMHgxZikgPDwgc2hpZnQ7XG4gICAgICAgICAgICBzaGlmdCArPSA1O1xuICAgICAgICB9IHdoaWxlIChieXRlID49IDB4MjApO1xuXG4gICAgICAgIGxvbmdpdHVkZV9jaGFuZ2UgPSAoKHJlc3VsdCAmIDEpID8gfihyZXN1bHQgPj4gMSkgOiAocmVzdWx0ID4+IDEpKTtcblxuICAgICAgICBsYXQgKz0gbGF0aXR1ZGVfY2hhbmdlO1xuICAgICAgICBsbmcgKz0gbG9uZ2l0dWRlX2NoYW5nZTtcblxuICAgICAgICBjb29yZGluYXRlcy5wdXNoKFtsYXQgLyBmYWN0b3IsIGxuZyAvIGZhY3Rvcl0pO1xuICAgIH1cblxuICAgIHJldHVybiBjb29yZGluYXRlcztcbn07XG5cbnBvbHlsaW5lLmVuY29kZSA9IGZ1bmN0aW9uKGNvb3JkaW5hdGVzLCBwcmVjaXNpb24pIHtcbiAgICBpZiAoIWNvb3JkaW5hdGVzLmxlbmd0aCkgcmV0dXJuICcnO1xuXG4gICAgdmFyIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24gfHwgNSksXG4gICAgICAgIG91dHB1dCA9IGVuY29kZShjb29yZGluYXRlc1swXVswXSwgZmFjdG9yKSArIGVuY29kZShjb29yZGluYXRlc1swXVsxXSwgZmFjdG9yKTtcblxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGEgPSBjb29yZGluYXRlc1tpXSwgYiA9IGNvb3JkaW5hdGVzW2kgLSAxXTtcbiAgICAgICAgb3V0cHV0ICs9IGVuY29kZShhWzBdIC0gYlswXSwgZmFjdG9yKTtcbiAgICAgICAgb3V0cHV0ICs9IGVuY29kZShhWzFdIC0gYlsxXSwgZmFjdG9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IHVuZGVmaW5lZCkgbW9kdWxlLmV4cG9ydHMgPSBwb2x5bGluZTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKCdxdWV1ZScsIGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5xdWV1ZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBzbGljZSA9IFtdLnNsaWNlO1xuXG4gIGZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4gIHZhciBub2Fib3J0ID0ge307XG4gIHZhciBzdWNjZXNzID0gW251bGxdO1xuICBmdW5jdGlvbiBuZXdRdWV1ZShjb25jdXJyZW5jeSkge1xuICAgIGlmICghKGNvbmN1cnJlbmN5ID49IDEpKSB0aHJvdyBuZXcgRXJyb3I7XG5cbiAgICB2YXIgcSxcbiAgICAgICAgdGFza3MgPSBbXSxcbiAgICAgICAgcmVzdWx0cyA9IFtdLFxuICAgICAgICB3YWl0aW5nID0gMCxcbiAgICAgICAgYWN0aXZlID0gMCxcbiAgICAgICAgZW5kZWQgPSAwLFxuICAgICAgICBzdGFydGluZywgLy8gaW5zaWRlIGEgc3luY2hyb25vdXMgdGFzayBjYWxsYmFjaz9cbiAgICAgICAgZXJyb3IsXG4gICAgICAgIGNhbGxiYWNrID0gbm9vcCxcbiAgICAgICAgY2FsbGJhY2tBbGwgPSB0cnVlO1xuXG4gICAgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICBpZiAoc3RhcnRpbmcpIHJldHVybjsgLy8gbGV0IHRoZSBjdXJyZW50IHRhc2sgY29tcGxldGVcbiAgICAgIHdoaWxlIChzdGFydGluZyA9IHdhaXRpbmcgJiYgYWN0aXZlIDwgY29uY3VycmVuY3kpIHtcbiAgICAgICAgdmFyIGkgPSBlbmRlZCArIGFjdGl2ZSxcbiAgICAgICAgICAgIHQgPSB0YXNrc1tpXSxcbiAgICAgICAgICAgIGogPSB0Lmxlbmd0aCAtIDEsXG4gICAgICAgICAgICBjID0gdFtqXTtcbiAgICAgICAgdFtqXSA9IGVuZChpKTtcbiAgICAgICAgLS13YWl0aW5nLCArK2FjdGl2ZSwgdGFza3NbaV0gPSBjLmFwcGx5KG51bGwsIHQpIHx8IG5vYWJvcnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kKGkpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlLCByKSB7XG4gICAgICAgIGlmICghdGFza3NbaV0pIHRocm93IG5ldyBFcnJvcjsgLy8gZGV0ZWN0IG11bHRpcGxlIGNhbGxiYWNrc1xuICAgICAgICAtLWFjdGl2ZSwgKytlbmRlZCwgdGFza3NbaV0gPSBudWxsO1xuICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgcmV0dXJuOyAvLyBvbmx5IHJlcG9ydCB0aGUgZmlyc3QgZXJyb3JcbiAgICAgICAgaWYgKGUgIT0gbnVsbCkge1xuICAgICAgICAgIGFib3J0KGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHNbaV0gPSByO1xuICAgICAgICAgIGlmICh3YWl0aW5nKSBzdGFydCgpO1xuICAgICAgICAgIGVsc2UgaWYgKCFhY3RpdmUpIG5vdGlmeSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFib3J0KGUpIHtcbiAgICAgIGVycm9yID0gZTsgLy8gaWdub3JlIG5ldyB0YXNrcyBhbmQgc3F1ZWxjaCBhY3RpdmUgY2FsbGJhY2tzXG4gICAgICB3YWl0aW5nID0gTmFOOyAvLyBzdG9wIHF1ZXVlZCB0YXNrcyBmcm9tIHN0YXJ0aW5nXG4gICAgICBub3RpZnkoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3RpZnkoKSB7XG4gICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgZWxzZSBpZiAoY2FsbGJhY2tBbGwpIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuICAgICAgZWxzZSBjYWxsYmFjay5hcHBseShudWxsLCBzdWNjZXNzLmNvbmNhdChyZXN1bHRzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHEgPSB7XG4gICAgICBkZWZlcjogZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoY2FsbGJhY2sgIT09IG5vb3ApIHRocm93IG5ldyBFcnJvcjtcbiAgICAgICAgdmFyIHQgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHQucHVzaChmKTtcbiAgICAgICAgKyt3YWl0aW5nLCB0YXNrcy5wdXNoKHQpO1xuICAgICAgICBzdGFydCgpO1xuICAgICAgICByZXR1cm4gcTtcbiAgICAgIH0sXG4gICAgICBhYm9ydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChlcnJvciA9PSBudWxsKSB7XG4gICAgICAgICAgdmFyIGkgPSBlbmRlZCArIGFjdGl2ZSwgdDtcbiAgICAgICAgICB3aGlsZSAoLS1pID49IDApICh0ID0gdGFza3NbaV0pICYmIHQuYWJvcnQgJiYgdC5hYm9ydCgpO1xuICAgICAgICAgIGFib3J0KG5ldyBFcnJvcihcImFib3J0XCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcTtcbiAgICAgIH0sXG4gICAgICBhd2FpdDogZnVuY3Rpb24oZikge1xuICAgICAgICBpZiAoY2FsbGJhY2sgIT09IG5vb3ApIHRocm93IG5ldyBFcnJvcjtcbiAgICAgICAgY2FsbGJhY2sgPSBmLCBjYWxsYmFja0FsbCA9IGZhbHNlO1xuICAgICAgICBpZiAoIXdhaXRpbmcgJiYgIWFjdGl2ZSkgbm90aWZ5KCk7XG4gICAgICAgIHJldHVybiBxO1xuICAgICAgfSxcbiAgICAgIGF3YWl0QWxsOiBmdW5jdGlvbihmKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayAhPT0gbm9vcCkgdGhyb3cgbmV3IEVycm9yO1xuICAgICAgICBjYWxsYmFjayA9IGYsIGNhbGxiYWNrQWxsID0gdHJ1ZTtcbiAgICAgICAgaWYgKCF3YWl0aW5nICYmICFhY3RpdmUpIG5vdGlmeSgpO1xuICAgICAgICByZXR1cm4gcTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gcXVldWUoY29uY3VycmVuY3kpIHtcbiAgICByZXR1cm4gbmV3UXVldWUoYXJndW1lbnRzLmxlbmd0aCA/ICtjb25jdXJyZW5jeSA6IEluZmluaXR5KTtcbiAgfVxuXG4gIHF1ZXVlLnZlcnNpb24gPSBcIjEuMi4xXCI7XG5cbiAgcmV0dXJuIHF1ZXVlO1xuXG59KSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpLFxuICAgIHBvbHlsaW5lID0gcmVxdWlyZSgncG9seWxpbmUnKSxcbiAgICBxdWV1ZSA9IHJlcXVpcmUoJ3F1ZXVlLWFzeW5jJyk7XG5cbnZhciBEaXJlY3Rpb25zID0gTC5DbGFzcy5leHRlbmQoe1xuICAgIGluY2x1ZGVzOiBbTC5NaXhpbi5FdmVudHNdLFxuXG4gICAgb3B0aW9uczoge1xuICAgICAgICB1bml0czogJ2ltcGVyaWFsJ1xuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIFVSTF9URU1QTEFURTogJ2h0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQvZGlyZWN0aW9ucy97cHJvZmlsZX0ve3dheXBvaW50c30uanNvbj9pbnN0cnVjdGlvbnM9aHRtbCZnZW9tZXRyeT1wb2x5bGluZSZhY2Nlc3NfdG9rZW49e3Rva2VufScsXG4gICAgICAgIEdFT0NPREVSX1RFTVBMQVRFOiAnaHR0cHM6Ly9hcGkudGlsZXMubWFwYm94LmNvbS92NC9nZW9jb2RlL21hcGJveC5wbGFjZXMve3F1ZXJ5fS5qc29uP3Byb3hpbWl0eT17cHJveGltaXR5fSZhY2Nlc3NfdG9rZW49e3Rva2VufSdcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX3dheXBvaW50cyA9IFtdO1xuICAgIH0sXG5cbiAgICBnZXRPcmlnaW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luO1xuICAgIH0sXG5cbiAgICBnZXREZXN0aW5hdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICB9LFxuXG4gICAgc2V0T3JpZ2luOiBmdW5jdGlvbiAob3JpZ2luKSB7XG4gICAgICAgIG9yaWdpbiA9IHRoaXMuX25vcm1hbGl6ZVdheXBvaW50KG9yaWdpbik7XG5cbiAgICAgICAgdGhpcy5vcmlnaW4gPSBvcmlnaW47XG4gICAgICAgIHRoaXMuZmlyZSgnb3JpZ2luJywge29yaWdpbjogb3JpZ2lufSk7XG5cbiAgICAgICAgaWYgKCFvcmlnaW4pIHtcbiAgICAgICAgICAgIHRoaXMuX3VubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNldERlc3RpbmF0aW9uOiBmdW5jdGlvbiAoZGVzdGluYXRpb24pIHtcbiAgICAgICAgZGVzdGluYXRpb24gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludChkZXN0aW5hdGlvbik7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICAgICB0aGlzLmZpcmUoJ2Rlc3RpbmF0aW9uJywge2Rlc3RpbmF0aW9uOiBkZXN0aW5hdGlvbn0pO1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX3VubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGdldFByb2ZpbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9maWxlIHx8IHRoaXMub3B0aW9ucy5wcm9maWxlIHx8ICdtYXBib3guZHJpdmluZyc7XG4gICAgfSxcblxuICAgIHNldFByb2ZpbGU6IGZ1bmN0aW9uIChwcm9maWxlKSB7XG4gICAgICAgIHRoaXMucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgIHRoaXMuZmlyZSgncHJvZmlsZScsIHtwcm9maWxlOiBwcm9maWxlfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBnZXRXYXlwb2ludHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2F5cG9pbnRzO1xuICAgIH0sXG5cbiAgICBzZXRXYXlwb2ludHM6IGZ1bmN0aW9uICh3YXlwb2ludHMpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gd2F5cG9pbnRzLm1hcCh0aGlzLl9ub3JtYWxpemVXYXlwb2ludCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBhZGRXYXlwb2ludDogZnVuY3Rpb24gKGluZGV4LCB3YXlwb2ludCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMuc3BsaWNlKGluZGV4LCAwLCB0aGlzLl9ub3JtYWxpemVXYXlwb2ludCh3YXlwb2ludCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVtb3ZlV2F5cG9pbnQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNldFdheXBvaW50OiBmdW5jdGlvbiAoaW5kZXgsIHdheXBvaW50KSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50c1tpbmRleF0gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludCh3YXlwb2ludCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvID0gdGhpcy5vcmlnaW4sXG4gICAgICAgICAgICBkID0gdGhpcy5kZXN0aW5hdGlvbjtcblxuICAgICAgICB0aGlzLm9yaWdpbiA9IGQ7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBvO1xuICAgICAgICB0aGlzLl93YXlwb2ludHMucmV2ZXJzZSgpO1xuXG4gICAgICAgIHRoaXMuZmlyZSgnb3JpZ2luJywge29yaWdpbjogdGhpcy5vcmlnaW59KVxuICAgICAgICAgICAgLmZpcmUoJ2Rlc3RpbmF0aW9uJywge2Rlc3RpbmF0aW9uOiB0aGlzLmRlc3RpbmF0aW9ufSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNlbGVjdFJvdXRlOiBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgdGhpcy5maXJlKCdzZWxlY3RSb3V0ZScsIHtyb3V0ZTogcm91dGV9KTtcbiAgICB9LFxuXG4gICAgaGlnaGxpZ2h0Um91dGU6IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICB0aGlzLmZpcmUoJ2hpZ2hsaWdodFJvdXRlJywge3JvdXRlOiByb3V0ZX0pO1xuICAgIH0sXG5cbiAgICBoaWdobGlnaHRTdGVwOiBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICB0aGlzLmZpcmUoJ2hpZ2hsaWdodFN0ZXAnLCB7c3RlcDogc3RlcH0pO1xuICAgIH0sXG5cbiAgICBxdWVyeVVSTDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBEaXJlY3Rpb25zLlVSTF9URU1QTEFURSxcbiAgICAgICAgICAgIHRva2VuID0gdGhpcy5vcHRpb25zLmFjY2Vzc1Rva2VuIHx8IEwubWFwYm94LmFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgcHJvZmlsZSA9IHRoaXMuZ2V0UHJvZmlsZSgpLFxuICAgICAgICAgICAgcG9pbnRzID0gW3RoaXMub3JpZ2luXS5jb25jYXQodGhpcy5fd2F5cG9pbnRzKS5jb25jYXQoW3RoaXMuZGVzdGluYXRpb25dKS5tYXAoZnVuY3Rpb24gKHBvaW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgICAgICAgICAgfSkuam9pbignOycpO1xuXG4gICAgICAgIGlmIChMLm1hcGJveC5mZWVkYmFjaykge1xuICAgICAgICAgICAgTC5tYXBib3guZmVlZGJhY2sucmVjb3JkKHtkaXJlY3Rpb25zOiBwcm9maWxlICsgJzsnICsgcG9pbnRzfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gTC5VdGlsLnRlbXBsYXRlKHRlbXBsYXRlLCB7XG4gICAgICAgICAgICB0b2tlbjogdG9rZW4sXG4gICAgICAgICAgICBwcm9maWxlOiBwcm9maWxlLFxuICAgICAgICAgICAgd2F5cG9pbnRzOiBwb2ludHNcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHF1ZXJ5YWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRPcmlnaW4oKSAmJiB0aGlzLmdldERlc3RpbmF0aW9uKCk7XG4gICAgfSxcblxuICAgIHF1ZXJ5OiBmdW5jdGlvbiAob3B0cywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCFvcHRzKSBvcHRzID0ge307XG4gICAgICAgIGlmICghdGhpcy5xdWVyeWFibGUoKSkgcmV0dXJuIHRoaXM7XG4gICAgICAgIGlmIChjYWxsYmFjayA9PT0gdW5kZWZpbmVkKSBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XG5cbiAgICAgICAgaWYgKHRoaXMuX3F1ZXJ5KSB7XG4gICAgICAgICAgICB0aGlzLl9xdWVyeS5hYm9ydCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3JlcXVlc3RzICYmIHRoaXMuX3JlcXVlc3RzLmxlbmd0aCkgdGhpcy5fcmVxdWVzdHMuZm9yRWFjaChmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0cyA9IFtdO1xuXG4gICAgICAgIHZhciBxID0gcXVldWUoKTtcblxuICAgICAgICB2YXIgcHRzID0gW3RoaXMub3JpZ2luLCB0aGlzLmRlc3RpbmF0aW9uXS5jb25jYXQodGhpcy5fd2F5cG9pbnRzKTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBwdHMpIHtcbiAgICAgICAgICAgIGlmICghcHRzW2ldLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICAgICAgcS5kZWZlcihMLmJpbmQodGhpcy5fZ2VvY29kZSwgdGhpcyksIHB0c1tpXSwgb3B0cy5wcm94aW1pdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcS5hd2FpdChMLmJpbmQoZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlyZSgnZXJyb3InLCB7ZXJyb3I6IGVyci5tZXNzYWdlfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3F1ZXJ5ID0gcmVxdWVzdCh0aGlzLnF1ZXJ5VVJMKCksIEwuYmluZChmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcXVlcnkgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXJlKCdlcnJvcicsIHtlcnJvcjogZXJyLm1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbnMgPSByZXNwO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5yb3V0ZXMuZm9yRWFjaChmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcm91dGUuZ2VvbWV0cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkxpbmVTdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBwb2x5bGluZS5kZWNvZGUocm91dGUuZ2VvbWV0cnksIDYpLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gYy5yZXZlcnNlKCk7IH0pXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3JpZ2luLnByb3BlcnRpZXMubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMuZGlyZWN0aW9ucy5vcmlnaW47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLm9yaWdpbiA9IHRoaXMub3JpZ2luO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kZXN0aW5hdGlvbi5wcm9wZXJ0aWVzLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbnMuZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuZGlyZWN0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZpcmUoJ2xvYWQnLCB0aGlzLmRpcmVjdGlvbnMpO1xuICAgICAgICAgICAgfSwgdGhpcyksIHRoaXMpO1xuICAgICAgICB9LCB0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF9nZW9jb2RlOiBmdW5jdGlvbih3YXlwb2ludCwgcHJveGltaXR5LCBjYikge1xuICAgICAgICBpZiAoIXRoaXMuX3JlcXVlc3RzKSB0aGlzLl9yZXF1ZXN0cyA9IFtdO1xuICAgICAgICB0aGlzLl9yZXF1ZXN0cy5wdXNoKHJlcXVlc3QoTC5VdGlsLnRlbXBsYXRlKERpcmVjdGlvbnMuR0VPQ09ERVJfVEVNUExBVEUsIHtcbiAgICAgICAgICAgIHF1ZXJ5OiB3YXlwb2ludC5wcm9wZXJ0aWVzLnF1ZXJ5LFxuICAgICAgICAgICAgdG9rZW46IHRoaXMub3B0aW9ucy5hY2Nlc3NUb2tlbiB8fCBMLm1hcGJveC5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgIHByb3hpbWl0eTogcHJveGltaXR5ID8gW3Byb3hpbWl0eS5sbmcsIHByb3hpbWl0eS5sYXRdLmpvaW4oJywnKSA6ICcnXG4gICAgICAgIH0pLCBMLmJpbmQoZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXJlc3AuZmVhdHVyZXMgfHwgIXJlc3AuZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcihcIk5vIHJlc3VsdHMgZm91bmQgZm9yIHF1ZXJ5IFwiICsgd2F5cG9pbnQucHJvcGVydGllcy5xdWVyeSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3YXlwb2ludC5nZW9tZXRyeS5jb29yZGluYXRlcyA9IHJlc3AuZmVhdHVyZXNbMF0uY2VudGVyO1xuICAgICAgICAgICAgd2F5cG9pbnQucHJvcGVydGllcy5uYW1lID0gcmVzcC5mZWF0dXJlc1swXS5wbGFjZV9uYW1lO1xuXG4gICAgICAgICAgICByZXR1cm4gY2IoKTtcbiAgICAgICAgfSwgdGhpcykpKTtcbiAgICB9LFxuXG4gICAgX3VubG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMgPSBbXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZGlyZWN0aW9ucztcbiAgICAgICAgdGhpcy5maXJlKCd1bmxvYWQnKTtcbiAgICB9LFxuXG4gICAgX25vcm1hbGl6ZVdheXBvaW50OiBmdW5jdGlvbiAod2F5cG9pbnQpIHtcbiAgICAgICAgaWYgKCF3YXlwb2ludCB8fCB3YXlwb2ludC50eXBlID09PSAnRmVhdHVyZScpIHtcbiAgICAgICAgICAgIHJldHVybiB3YXlwb2ludDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb29yZGluYXRlcyxcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSB7fTtcblxuICAgICAgICBpZiAod2F5cG9pbnQgaW5zdGFuY2VvZiBMLkxhdExuZykge1xuICAgICAgICAgICAgd2F5cG9pbnQgPSB3YXlwb2ludC53cmFwKCk7XG4gICAgICAgICAgICBjb29yZGluYXRlcyA9IHByb3BlcnRpZXMucXVlcnkgPSBbd2F5cG9pbnQubG5nLCB3YXlwb2ludC5sYXRdO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB3YXlwb2ludCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucXVlcnkgPSB3YXlwb2ludDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc1xuICAgICAgICB9O1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IERpcmVjdGlvbnMob3B0aW9ucyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtZXJyb3JzJywgdHJ1ZSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdsb2FkIHVubG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWVycm9yLWFjdGl2ZScsIGZhbHNlKVxuICAgICAgICAgICAgLmh0bWwoJycpO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignZXJyb3InLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAgIC5jbGFzc2VkKCdtYXBib3gtZXJyb3ItYWN0aXZlJywgdHJ1ZSlcbiAgICAgICAgICAgIC5odG1sKCcnKVxuICAgICAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtZXJyb3InKVxuICAgICAgICAgICAgLnRleHQoZS5lcnJvcik7XG5cbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuaW5zZXJ0KCdzcGFuJywgJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWVycm9yLWljb24nKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZHVyYXRpb246IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHZhciBtID0gTWF0aC5mbG9vcihzIC8gNjApLFxuICAgICAgICAgICAgaCA9IE1hdGguZmxvb3IobSAvIDYwKTtcbiAgICAgICAgcyAlPSA2MDtcbiAgICAgICAgbSAlPSA2MDtcbiAgICAgICAgaWYgKGggPT09IDAgJiYgbSA9PT0gMCkgcmV0dXJuIHMgKyAnIHMnO1xuICAgICAgICBpZiAoaCA9PT0gMCkgcmV0dXJuIG0gKyAnIG1pbic7XG4gICAgICAgIHJldHVybiBoICsgJyBoICcgKyBtICsgJyBtaW4nO1xuICAgIH0sXG5cbiAgICBpbXBlcmlhbDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgdmFyIG1pID0gbSAvIDE2MDkuMzQ0O1xuICAgICAgICBpZiAobWkgPj0gMTAwKSByZXR1cm4gbWkudG9GaXhlZCgwKSArICcgbWknO1xuICAgICAgICBpZiAobWkgPj0gMTApIHJldHVybiBtaS50b0ZpeGVkKDEpICsgJyBtaSc7XG4gICAgICAgIGlmIChtaSA+PSAwLjEpIHJldHVybiBtaS50b0ZpeGVkKDIpICsgJyBtaSc7XG4gICAgICAgIHJldHVybiAobWkgKiA1MjgwKS50b0ZpeGVkKDApICsgJyBmdCc7XG4gICAgfSxcblxuICAgIG1ldHJpYzogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgaWYgKG0gPj0gMTAwMDAwKSByZXR1cm4gKG0gLyAxMDAwKS50b0ZpeGVkKDApICsgJyBrbSc7XG4gICAgICAgIGlmIChtID49IDEwMDAwKSByZXR1cm4gKG0gLyAxMDAwKS50b0ZpeGVkKDEpICsgJyBrbSc7XG4gICAgICAgIGlmIChtID49IDEwMCkgcmV0dXJuIChtIC8gMTAwMCkudG9GaXhlZCgyKSArICcga20nO1xuICAgICAgICByZXR1cm4gbS50b0ZpeGVkKDApICsgJyBtJztcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuICAgIHZhciBvcmlnQ2hhbmdlID0gZmFsc2UsXG4gICAgICAgIGRlc3RDaGFuZ2UgPSBmYWxzZTtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbiAoXykge1xuICAgICAgICBtYXAgPSBfO1xuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9O1xuXG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KEwuRG9tVXRpbC5nZXQoY29udGFpbmVyKSlcbiAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLWlucHV0cycsIHRydWUpO1xuXG4gICAgdmFyIGZvcm0gPSBjb250YWluZXIuYXBwZW5kKCdmb3JtJylcbiAgICAgICAgLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChkMy5ldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAob3JpZ0NoYW5nZSlcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXRPcmlnaW4ob3JpZ2luSW5wdXQucHJvcGVydHkoJ3ZhbHVlJykpO1xuICAgICAgICAgICAgICAgIGlmIChkZXN0Q2hhbmdlKVxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zLnNldERlc3RpbmF0aW9uKGRlc3RpbmF0aW9uSW5wdXQucHJvcGVydHkoJ3ZhbHVlJykpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMucXVlcnlhYmxlKCkpXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMucXVlcnkoeyBwcm94aW1pdHk6IG1hcC5nZXRDZW50ZXIoKSB9KTtcblxuICAgICAgICAgICAgICAgIG9yaWdDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBkZXN0Q2hhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgdmFyIG9yaWdpbiA9IGZvcm0uYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtb3JpZ2luJyk7XG5cbiAgICBvcmlnaW4uYXBwZW5kKCdsYWJlbCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZm9ybS1sYWJlbCcpXG4gICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9ucy5nZXRPcmlnaW4oKSBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKGRpcmVjdGlvbnMuZ2V0T3JpZ2luKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWRlcGFydC1pY29uJyk7XG5cbiAgICB2YXIgb3JpZ2luSW5wdXQgPSBvcmlnaW4uYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ3RleHQnKVxuICAgICAgICAuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKVxuICAgICAgICAuYXR0cignaWQnLCAnbWFwYm94LWRpcmVjdGlvbnMtb3JpZ2luLWlucHV0JylcbiAgICAgICAgLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1N0YXJ0JylcbiAgICAgICAgLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFvcmlnQ2hhbmdlKSBvcmlnQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICBvcmlnaW4uYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtY2xvc2UtaWNvbicpXG4gICAgICAgIC5hdHRyKCd0aXRsZScsICdDbGVhciB2YWx1ZScpXG4gICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldE9yaWdpbih1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgIGZvcm0uYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LXJldmVyc2UtaWNvbiBtYXBib3gtZGlyZWN0aW9ucy1yZXZlcnNlLWlucHV0JylcbiAgICAgICAgLmF0dHIoJ3RpdGxlJywgJ1JldmVyc2Ugb3JpZ2luICYgZGVzdGluYXRpb24nKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5yZXZlcnNlKCkucXVlcnkoKTtcbiAgICAgICAgfSk7XG5cbiAgICB2YXIgZGVzdGluYXRpb24gPSBmb3JtLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWRlc3RpbmF0aW9uJyk7XG5cbiAgICBkZXN0aW5hdGlvbi5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1mb3JtLWxhYmVsJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLmdldERlc3RpbmF0aW9uKCkgaW5zdGFuY2VvZiBMLkxhdExuZykge1xuICAgICAgICAgICAgICAgIG1hcC5wYW5UbyhkaXJlY3Rpb25zLmdldERlc3RpbmF0aW9uKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWFycml2ZS1pY29uJyk7XG5cbiAgICB2YXIgZGVzdGluYXRpb25JbnB1dCA9IGRlc3RpbmF0aW9uLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ21hcGJveC1kaXJlY3Rpb25zLWRlc3RpbmF0aW9uLWlucHV0JylcbiAgICAgICAgLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0VuZCcpXG4gICAgICAgIC5vbignaW5wdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghZGVzdENoYW5nZSkgZGVzdENoYW5nZSA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgZGVzdGluYXRpb24uYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtY2xvc2UtaWNvbicpXG4gICAgICAgIC5hdHRyKCd0aXRsZScsICdDbGVhciB2YWx1ZScpXG4gICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldERlc3RpbmF0aW9uKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgdmFyIHByb2ZpbGUgPSBmb3JtLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGUnKTtcblxuICAgIHZhciBwcm9maWxlcyA9IHByb2ZpbGUuc2VsZWN0QWxsKCdzcGFuJylcbiAgICAgICAgLmRhdGEoW1xuICAgICAgICAgICAgWydtYXBib3guZHJpdmluZycsICdkcml2aW5nJywgJ0RyaXZpbmcnXSxcbiAgICAgICAgICAgIFsnbWFwYm94LndhbGtpbmcnLCAnd2Fsa2luZycsICdXYWxraW5nJ10sXG4gICAgICAgICAgICBbJ21hcGJveC5jeWNsaW5nJywgJ2N5Y2xpbmcnLCAnQ3ljbGluZyddXSlcbiAgICAgICAgLmVudGVyKClcbiAgICAgICAgLmFwcGVuZCgnc3BhbicpO1xuXG4gICAgcHJvZmlsZXMuYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ3JhZGlvJylcbiAgICAgICAgLmF0dHIoJ25hbWUnLCAncHJvZmlsZScpXG4gICAgICAgIC5hdHRyKCdpZCcsIGZ1bmN0aW9uIChkKSB7IHJldHVybiAnbWFwYm94LWRpcmVjdGlvbnMtcHJvZmlsZS0nICsgZFsxXTsgfSlcbiAgICAgICAgLnByb3BlcnR5KCdjaGVja2VkJywgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLm9wdGlvbnMucHJvZmlsZSkgcmV0dXJuIGRpcmVjdGlvbnMub3B0aW9ucy5wcm9maWxlID09PSBkWzBdO1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gaSA9PT0gMDtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXRQcm9maWxlKGRbMF0pLnF1ZXJ5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgcHJvZmlsZXMuYXBwZW5kKCdsYWJlbCcpXG4gICAgICAgIC5hdHRyKCdmb3InLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gJ21hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGUtJyArIGRbMV07IH0pXG4gICAgICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7IHJldHVybiBkWzJdOyB9KTtcblxuICAgIGZ1bmN0aW9uIGZvcm1hdCh3YXlwb2ludCkge1xuICAgICAgICBpZiAoIXdheXBvaW50KSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH0gZWxzZSBpZiAod2F5cG9pbnQucHJvcGVydGllcy5uYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQucHJvcGVydGllcy5uYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICB2YXIgcHJlY2lzaW9uID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKE1hdGgubG9nKG1hcC5nZXRab29tKCkpIC8gTWF0aC5MTjIpKTtcbiAgICAgICAgICAgIHJldHVybiB3YXlwb2ludC5nZW9tZXRyeS5jb29yZGluYXRlc1swXS50b0ZpeGVkKHByZWNpc2lvbikgKyAnLCAnICtcbiAgICAgICAgICAgICAgICAgICB3YXlwb2ludC5nZW9tZXRyeS5jb29yZGluYXRlc1sxXS50b0ZpeGVkKHByZWNpc2lvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gd2F5cG9pbnQucHJvcGVydGllcy5xdWVyeSB8fCAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpcmVjdGlvbnNcbiAgICAgICAgLm9uKCdvcmlnaW4nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgb3JpZ2luSW5wdXQucHJvcGVydHkoJ3ZhbHVlJywgZm9ybWF0KGUub3JpZ2luKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignZGVzdGluYXRpb24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZGVzdGluYXRpb25JbnB1dC5wcm9wZXJ0eSgndmFsdWUnLCBmb3JtYXQoZS5kZXN0aW5hdGlvbikpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ3Byb2ZpbGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcHJvZmlsZXMuc2VsZWN0QWxsKCdpbnB1dCcpXG4gICAgICAgICAgICAgICAgLnByb3BlcnR5KCdjaGVja2VkJywgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGRbMF0gPT09IGUucHJvZmlsZTsgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbG9hZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBvcmlnaW5JbnB1dC5wcm9wZXJ0eSgndmFsdWUnLCBmb3JtYXQoZS5vcmlnaW4pKTtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uSW5wdXQucHJvcGVydHkoJ3ZhbHVlJywgZm9ybWF0KGUuZGVzdGluYXRpb24pKTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkMyA9IHJlcXVpcmUoJy4uL2xpYi9kMycpLFxuICAgIGZvcm1hdCA9IHJlcXVpcmUoJy4vZm9ybWF0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgZGlyZWN0aW9ucykge1xuICAgIHZhciBjb250cm9sID0ge30sIG1hcDtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbiAoXykge1xuICAgICAgICBtYXAgPSBfO1xuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9O1xuXG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KEwuRG9tVXRpbC5nZXQoY29udGFpbmVyKSlcbiAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLWluc3RydWN0aW9ucycsIHRydWUpO1xuXG4gICAgZGlyZWN0aW9ucy5vbignZXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnRhaW5lci5odG1sKCcnKTtcbiAgICB9KTtcblxuICAgIGRpcmVjdGlvbnMub24oJ3NlbGVjdFJvdXRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHJvdXRlID0gZS5yb3V0ZTtcblxuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG5cbiAgICAgICAgdmFyIHN0ZXBzID0gY29udGFpbmVyLmFwcGVuZCgnb2wnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXN0ZXBzJylcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAgIC5kYXRhKHJvdXRlLnN0ZXBzKVxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcCcpO1xuXG4gICAgICAgIHN0ZXBzLmFwcGVuZCgnc3BhbicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtJyArIHN0ZXAubWFuZXV2ZXIudHlwZS5yZXBsYWNlKC9cXHMrL2csICctJykudG9Mb3dlckNhc2UoKSArICctaWNvbic7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcC1tYW5ldXZlcicpXG4gICAgICAgICAgICAuaHRtbChmdW5jdGlvbiAoc3RlcCkgeyByZXR1cm4gc3RlcC5tYW5ldXZlci5pbnN0cnVjdGlvbjsgfSk7XG5cbiAgICAgICAgc3RlcHMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXN0ZXAtZGlzdGFuY2UnKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKHN0ZXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RlcC5kaXN0YW5jZSA/IGZvcm1hdFtkaXJlY3Rpb25zLm9wdGlvbnMudW5pdHNdKHN0ZXAuZGlzdGFuY2UpIDogJyc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignbW91c2VvdmVyJywgZnVuY3Rpb24gKHN0ZXApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuaGlnaGxpZ2h0U3RlcChzdGVwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3RlcHMub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRTdGVwKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignY2xpY2snLCBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgbWFwLnBhblRvKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhzdGVwLm1hbmV1dmVyLmxvY2F0aW9uLmNvb3JkaW5hdGVzKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRyb2w7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCdkZWJvdW5jZScpO1xuXG52YXIgTGF5ZXIgPSBMLkxheWVyR3JvdXAuZXh0ZW5kKHtcbiAgICBvcHRpb25zOiB7XG4gICAgICAgIHJlYWRvbmx5OiBmYWxzZSxcbiAgICAgICAgcm91dGVTdHlsZToge1xuICAgICAgICAgICAgJ2NvbG9yJzogJyMzQkIyRDAnLFxuICAgICAgICAgICAgJ3dlaWdodCc6IDQsXG4gICAgICAgICAgICAnb3BhY2l0eSc6IDAuNzVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihkaXJlY3Rpb25zLCBvcHRpb25zKSB7XG4gICAgICAgIEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9ucyA9IGRpcmVjdGlvbnMgfHwgbmV3IEwuRGlyZWN0aW9ucygpO1xuICAgICAgICBMLkxheWVyR3JvdXAucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcyk7XG5cbiAgICAgICAgdGhpcy5fZHJhZyA9IGRlYm91bmNlKEwuYmluZCh0aGlzLl9kcmFnLCB0aGlzKSwgMTAwKTtcblxuICAgICAgICB0aGlzLm9yaWdpbk1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgZHJhZ2dhYmxlOiAhdGhpcy5vcHRpb25zLnJlYWRvbmx5LFxuICAgICAgICAgICAgaWNvbjogTC5tYXBib3gubWFya2VyLmljb24oe1xuICAgICAgICAgICAgICAgICdtYXJrZXItc2l6ZSc6ICdtZWRpdW0nLFxuICAgICAgICAgICAgICAgICdtYXJrZXItY29sb3InOiAnIzNCQjJEMCcsXG4gICAgICAgICAgICAgICAgJ21hcmtlci1zeW1ib2wnOiAnYSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk1hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgZHJhZ2dhYmxlOiAhdGhpcy5vcHRpb25zLnJlYWRvbmx5LFxuICAgICAgICAgICAgaWNvbjogTC5tYXBib3gubWFya2VyLmljb24oe1xuICAgICAgICAgICAgICAgICdtYXJrZXItc2l6ZSc6ICdtZWRpdW0nLFxuICAgICAgICAgICAgICAgICdtYXJrZXItY29sb3InOiAnIzQ0NCcsXG4gICAgICAgICAgICAgICAgJ21hcmtlci1zeW1ib2wnOiAnYidcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5zdGVwTWFya2VyID0gTC5tYXJrZXIoWzAsIDBdLCB7XG4gICAgICAgICAgICBpY29uOiBMLmRpdkljb24oe1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ21hcGJveC1tYXJrZXItZHJhZy1pY29uIG1hcGJveC1tYXJrZXItZHJhZy1pY29uLXN0ZXAnLFxuICAgICAgICAgICAgICAgIGljb25TaXplOiBuZXcgTC5Qb2ludCgxMiwgMTIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRyYWdNYXJrZXIgPSBMLm1hcmtlcihbMCwgMF0sIHtcbiAgICAgICAgICAgIGRyYWdnYWJsZTogIXRoaXMub3B0aW9ucy5yZWFkb25seSxcbiAgICAgICAgICAgIGljb246IHRoaXMuX3dheXBvaW50SWNvbigpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZHJhZ01hcmtlclxuICAgICAgICAgICAgLm9uKCdkcmFnc3RhcnQnLCB0aGlzLl9kcmFnU3RhcnQsIHRoaXMpXG4gICAgICAgICAgICAub24oJ2RyYWcnLCB0aGlzLl9kcmFnLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdkcmFnZW5kJywgdGhpcy5fZHJhZ0VuZCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZUxheWVyID0gTC5nZW9Kc29uKG51bGwsIHtzdHlsZTogdGhpcy5vcHRpb25zLnJvdXRlU3R5bGV9KTtcbiAgICAgICAgdGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyID0gTC5nZW9Kc29uKG51bGwsIHtzdHlsZTogdGhpcy5vcHRpb25zLnJvdXRlU3R5bGV9KTtcblxuICAgICAgICB0aGlzLndheXBvaW50TWFya2VycyA9IFtdO1xuICAgIH0sXG5cbiAgICBvbkFkZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIEwuTGF5ZXJHcm91cC5wcm90b3R5cGUub25BZGQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZWFkb25seSkge1xuICAgICAgICAgIHRoaXMuX21hcFxuICAgICAgICAgICAgICAub24oJ2NsaWNrJywgdGhpcy5fY2xpY2ssIHRoaXMpXG4gICAgICAgICAgICAgIC5vbignbW91c2Vtb3ZlJywgdGhpcy5fbW91c2Vtb3ZlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnNcbiAgICAgICAgICAgIC5vbignb3JpZ2luJywgdGhpcy5fb3JpZ2luLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdkZXN0aW5hdGlvbicsIHRoaXMuX2Rlc3RpbmF0aW9uLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdsb2FkJywgdGhpcy5fbG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vbigndW5sb2FkJywgdGhpcy5fdW5sb2FkLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdzZWxlY3RSb3V0ZScsIHRoaXMuX3NlbGVjdFJvdXRlLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdoaWdobGlnaHRSb3V0ZScsIHRoaXMuX2hpZ2hsaWdodFJvdXRlLCB0aGlzKVxuICAgICAgICAgICAgLm9uKCdoaWdobGlnaHRTdGVwJywgdGhpcy5faGlnaGxpZ2h0U3RlcCwgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uUmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uc1xuICAgICAgICAgICAgLm9mZignb3JpZ2luJywgdGhpcy5fb3JpZ2luLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignZGVzdGluYXRpb24nLCB0aGlzLl9kZXN0aW5hdGlvbiwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2xvYWQnLCB0aGlzLl9sb2FkLCB0aGlzKVxuICAgICAgICAgICAgLm9mZigndW5sb2FkJywgdGhpcy5fdW5sb2FkLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignc2VsZWN0Um91dGUnLCB0aGlzLl9zZWxlY3RSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2hpZ2hsaWdodFJvdXRlJywgdGhpcy5faGlnaGxpZ2h0Um91dGUsIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdoaWdobGlnaHRTdGVwJywgdGhpcy5faGlnaGxpZ2h0U3RlcCwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fbWFwXG4gICAgICAgICAgICAub2ZmKCdjbGljaycsIHRoaXMuX2NsaWNrLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignbW91c2Vtb3ZlJywgdGhpcy5fbW91c2Vtb3ZlLCB0aGlzKTtcblxuICAgICAgICBMLkxheWVyR3JvdXAucHJvdG90eXBlLm9uUmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIF9jbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2RpcmVjdGlvbnMuZ2V0T3JpZ2luKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0T3JpZ2luKGUubGF0bG5nKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fZGlyZWN0aW9ucy5nZXREZXN0aW5hdGlvbigpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldERlc3RpbmF0aW9uKGUubGF0bG5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5YWJsZSgpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX21vdXNlbW92ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoIXRoaXMucm91dGVMYXllciB8fCAhdGhpcy5oYXNMYXllcih0aGlzLnJvdXRlTGF5ZXIpIHx8IHRoaXMuX2N1cnJlbnRXYXlwb2ludCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcCA9IHRoaXMuX3JvdXRlUG9seWxpbmUoKS5jbG9zZXN0TGF5ZXJQb2ludChlLmxheWVyUG9pbnQpO1xuXG4gICAgICAgIGlmICghcCB8fCBwLmRpc3RhbmNlID4gMTUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyKHRoaXMuZHJhZ01hcmtlcik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbSA9IHRoaXMuX21hcC5wcm9qZWN0KGUubGF0bG5nKSxcbiAgICAgICAgICAgIG8gPSB0aGlzLl9tYXAucHJvamVjdCh0aGlzLm9yaWdpbk1hcmtlci5nZXRMYXRMbmcoKSksXG4gICAgICAgICAgICBkID0gdGhpcy5fbWFwLnByb2plY3QodGhpcy5kZXN0aW5hdGlvbk1hcmtlci5nZXRMYXRMbmcoKSk7XG5cbiAgICAgICAgaWYgKG8uZGlzdGFuY2VUbyhtKSA8IDE1IHx8IGQuZGlzdGFuY2VUbyhtKSA8IDE1KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVMYXllcih0aGlzLmRyYWdNYXJrZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHcgPSB0aGlzLl9tYXAucHJvamVjdCh0aGlzLndheXBvaW50TWFya2Vyc1tpXS5nZXRMYXRMbmcoKSk7XG4gICAgICAgICAgICBpZiAoaSAhPT0gdGhpcy5fY3VycmVudFdheXBvaW50ICYmIHcuZGlzdGFuY2VUbyhtKSA8IDE1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhZ01hcmtlci5zZXRMYXRMbmcodGhpcy5fbWFwLmxheWVyUG9pbnRUb0xhdExuZyhwKSk7XG4gICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICB9LFxuXG4gICAgX29yaWdpbjogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5vcmlnaW4gJiYgZS5vcmlnaW4uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luTWFya2VyLnNldExhdExuZyhMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS5vcmlnaW4uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5vcmlnaW5NYXJrZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLm9yaWdpbk1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Rlc3RpbmF0aW9uOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmRlc3RpbmF0aW9uICYmIGUuZGVzdGluYXRpb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb25NYXJrZXIuc2V0TGF0TG5nKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhlLmRlc3RpbmF0aW9uLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMuZGVzdGluYXRpb25NYXJrZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLmRlc3RpbmF0aW9uTWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZHJhZ1N0YXJ0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5kcmFnTWFya2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50V2F5cG9pbnQgPSB0aGlzLl9maW5kV2F5cG9pbnRJbmRleChlLnRhcmdldC5nZXRMYXRMbmcoKSk7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLmFkZFdheXBvaW50KHRoaXMuX2N1cnJlbnRXYXlwb2ludCwgZS50YXJnZXQuZ2V0TGF0TG5nKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFdheXBvaW50ID0gdGhpcy53YXlwb2ludE1hcmtlcnMuaW5kZXhPZihlLnRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RyYWc6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGxhdExuZyA9IGUudGFyZ2V0LmdldExhdExuZygpO1xuXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5vcmlnaW5NYXJrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0T3JpZ2luKGxhdExuZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQgPT09IHRoaXMuZGVzdGluYXRpb25NYXJrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24obGF0TG5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMuc2V0V2F5cG9pbnQodGhpcy5fY3VycmVudFdheXBvaW50LCBsYXRMbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbnMucXVlcnlhYmxlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbnMucXVlcnkoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZHJhZ0VuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRXYXlwb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9LFxuXG4gICAgX3JlbW92ZVdheXBvaW50OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnMucmVtb3ZlV2F5cG9pbnQodGhpcy53YXlwb2ludE1hcmtlcnMuaW5kZXhPZihlLnRhcmdldCkpLnF1ZXJ5KCk7XG4gICAgfSxcblxuICAgIF9sb2FkOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMuX29yaWdpbihlKTtcbiAgICAgICAgdGhpcy5fZGVzdGluYXRpb24oZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gd2F5cG9pbnRMYXRMbmcoaSkge1xuICAgICAgICAgICAgcmV0dXJuIEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhlLndheXBvaW50c1tpXS5nZW9tZXRyeS5jb29yZGluYXRlcyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbCA9IE1hdGgubWluKHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aCwgZS53YXlwb2ludHMubGVuZ3RoKSxcbiAgICAgICAgICAgIGkgPSAwO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBleGlzdGluZ1xuICAgICAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnNbaV0uc2V0TGF0TG5nKHdheXBvaW50TGF0TG5nKGkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBuZXdcbiAgICAgICAgZm9yICg7IGkgPCBlLndheXBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHdheXBvaW50TWFya2VyID0gTC5tYXJrZXIod2F5cG9pbnRMYXRMbmcoaSksIHtcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6ICF0aGlzLm9wdGlvbnMucmVhZG9ubHksXG4gICAgICAgICAgICAgICAgaWNvbjogdGhpcy5fd2F5cG9pbnRJY29uKClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB3YXlwb2ludE1hcmtlclxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCB0aGlzLl9yZW1vdmVXYXlwb2ludCwgdGhpcylcbiAgICAgICAgICAgICAgICAub24oJ2RyYWdzdGFydCcsIHRoaXMuX2RyYWdTdGFydCwgdGhpcylcbiAgICAgICAgICAgICAgICAub24oJ2RyYWcnLCB0aGlzLl9kcmFnLCB0aGlzKVxuICAgICAgICAgICAgICAgIC5vbignZHJhZ2VuZCcsIHRoaXMuX2RyYWdFbmQsIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLndheXBvaW50TWFya2Vycy5wdXNoKHdheXBvaW50TWFya2VyKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIod2F5cG9pbnRNYXJrZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIG9sZFxuICAgICAgICBmb3IgKDsgaSA8IHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aCA9IGUud2F5cG9pbnRzLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgX3VubG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5yb3V0ZUxheWVyKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLndheXBvaW50TWFya2Vyc1tpXSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NlbGVjdFJvdXRlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMucm91dGVMYXllclxuICAgICAgICAgICAgLmNsZWFyTGF5ZXJzKClcbiAgICAgICAgICAgIC5hZGREYXRhKGUucm91dGUuZ2VvbWV0cnkpO1xuICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMucm91dGVMYXllcik7XG4gICAgfSxcblxuICAgIF9oaWdobGlnaHRSb3V0ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5yb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyXG4gICAgICAgICAgICAgICAgLmNsZWFyTGF5ZXJzKClcbiAgICAgICAgICAgICAgICAuYWRkRGF0YShlLnJvdXRlLmdlb21ldHJ5KTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGlnaGxpZ2h0U3RlcDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5zdGVwKSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBNYXJrZXIuc2V0TGF0TG5nKEwuR2VvSlNPTi5jb29yZHNUb0xhdExuZyhlLnN0ZXAubWFuZXV2ZXIubG9jYXRpb24uY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5zdGVwTWFya2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5zdGVwTWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcm91dGVQb2x5bGluZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvdXRlTGF5ZXIuZ2V0TGF5ZXJzKClbMF07XG4gICAgfSxcblxuICAgIF9maW5kV2F5cG9pbnRJbmRleDogZnVuY3Rpb24obGF0TG5nKSB7XG4gICAgICAgIHZhciBzZWdtZW50ID0gdGhpcy5fZmluZE5lYXJlc3RSb3V0ZVNlZ21lbnQobGF0TG5nKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMuX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50KHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldLmdldExhdExuZygpKTtcbiAgICAgICAgICAgIGlmIChzID4gc2VnbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMud2F5cG9pbnRNYXJrZXJzLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50OiBmdW5jdGlvbihsYXRMbmcpIHtcbiAgICAgICAgdmFyIG1pbiA9IEluZmluaXR5LFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBwID0gdGhpcy5fbWFwLmxhdExuZ1RvTGF5ZXJQb2ludChsYXRMbmcpLFxuICAgICAgICAgICAgcG9zaXRpb25zID0gdGhpcy5fcm91dGVQb2x5bGluZSgpLl9vcmlnaW5hbFBvaW50cztcblxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGQgPSBMLkxpbmVVdGlsLl9zcUNsb3Nlc3RQb2ludE9uU2VnbWVudChwLCBwb3NpdGlvbnNbaSAtIDFdLCBwb3NpdGlvbnNbaV0sIHRydWUpO1xuICAgICAgICAgICAgaWYgKGQgPCBtaW4pIHtcbiAgICAgICAgICAgICAgICBtaW4gPSBkO1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG4gICAgX3dheXBvaW50SWNvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBMLmRpdkljb24oe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbWFwYm94LW1hcmtlci1kcmFnLWljb24nLFxuICAgICAgICAgICAgaWNvblNpemU6IG5ldyBMLlBvaW50KDEyLCAxMilcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGlyZWN0aW9ucywgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgTGF5ZXIoZGlyZWN0aW9ucywgb3B0aW9ucyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29yc2xpdGUgPSByZXF1aXJlKCdjb3JzbGl0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gY29yc2xpdGUodXJsLCBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgIGlmIChlcnIgJiYgZXJyLnR5cGUgPT09ICdhYm9ydCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnIgJiYgIWVyci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzcCA9IHJlc3AgfHwgZXJyO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwID0gSlNPTi5wYXJzZShyZXNwLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IocmVzcC5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXNwLmVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHJlc3AuZXJyb3IpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCByZXNwKTtcbiAgICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkMyA9IHJlcXVpcmUoJy4uL2xpYi9kMycpLFxuICAgIGZvcm1hdCA9IHJlcXVpcmUoJy4vZm9ybWF0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgZGlyZWN0aW9ucykge1xuICAgIHZhciBjb250cm9sID0ge30sIG1hcCwgc2VsZWN0aW9uID0gMDtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbiAoXykge1xuICAgICAgICBtYXAgPSBfO1xuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9O1xuXG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KEwuRG9tVXRpbC5nZXQoY29udGFpbmVyKSlcbiAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlcycsIHRydWUpO1xuXG4gICAgZGlyZWN0aW9ucy5vbignZXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnRhaW5lci5odG1sKCcnKTtcbiAgICB9KTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2xvYWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG5cbiAgICAgICAgdmFyIHJvdXRlcyA9IGNvbnRhaW5lci5hcHBlbmQoJ3VsJylcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAgIC5kYXRhKGUucm91dGVzKVxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUnKTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUtaGVhZGluZycpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAocm91dGUpIHsgcmV0dXJuICdSb3V0ZSAnICsgKGUucm91dGVzLmluZGV4T2Yocm91dGUpICsgMSk7IH0pO1xuXG4gICAgICAgIHJvdXRlcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUtc3VtbWFyeScpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAocm91dGUpIHsgcmV0dXJuIHJvdXRlLnN1bW1hcnk7IH0pO1xuXG4gICAgICAgIHJvdXRlcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUtZGV0YWlscycpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0W2RpcmVjdGlvbnMub3B0aW9ucy51bml0c10ocm91dGUuZGlzdGFuY2UpICsgJywgJyArIGZvcm1hdC5kdXJhdGlvbihyb3V0ZS5kdXJhdGlvbik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByb3V0ZXMub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRSb3V0ZShyb3V0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvdXRlcy5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLmhpZ2hsaWdodFJvdXRlKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICByb3V0ZXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNlbGVjdFJvdXRlKHJvdXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlyZWN0aW9ucy5zZWxlY3RSb3V0ZShlLnJvdXRlc1swXSk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdzZWxlY3RSb3V0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXBib3gtZGlyZWN0aW9ucy1yb3V0ZScpXG4gICAgICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUtYWN0aXZlJywgZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZSA9PT0gZS5yb3V0ZTsgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn07XG4iXX0=
