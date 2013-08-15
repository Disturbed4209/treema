var AnyTreemaNode, ArrayTreemaNode, BooleanTreemaNode, NullTreemaNode, NumberTreemaNode, ObjectTreemaNode, StringTreemaNode, TreemaNode, TreemaNodeMap, makeTreema, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

TreemaNode = (function() {
  TreemaNode.prototype.schema = {};

  TreemaNode.prototype.data = null;

  TreemaNode.prototype.options = null;

  TreemaNode.prototype.isChild = false;

  TreemaNode.prototype.nodeTemplate = '<div class="treema-node treema-clearfix"><div class="treema-value"></div></div>';

  TreemaNode.prototype.backdropTemplate = '<div class="treema-backdrop"></div>';

  TreemaNode.prototype.childrenTemplate = '<div class="treema-children"></div>';

  TreemaNode.prototype.addChildTemplate = '<div class="treema-add-child">+</div>';

  TreemaNode.prototype.newPropertyTemplate = '<input class="treema-new-prop" />';

  TreemaNode.prototype.newPropertyErrorTemplate = '<span class="treema-new-prop-error"></span>';

  TreemaNode.prototype.toggleTemplate = '<span class="treema-toggle"></span>';

  TreemaNode.prototype.keyTemplate = '<span class="treema-key"></span>';

  TreemaNode.prototype.templateString = '<div class="treema-error"></div>';

  TreemaNode.prototype.collection = false;

  TreemaNode.prototype.ordered = false;

  TreemaNode.prototype.keyed = false;

  TreemaNode.prototype.editable = true;

  TreemaNode.prototype.skipTab = false;

  TreemaNode.prototype.isValid = function() {
    return tv4.validate(this.data, this.schema);
  };

  TreemaNode.prototype.getErrors = function() {
    return tv4.validateMultiple(this.data, this.schema)['errors'];
  };

  TreemaNode.prototype.getMissing = function() {
    return tv4.validateMultiple(this.data, this.schema)['missing'];
  };

  TreemaNode.prototype.setValueForReading = function(valEl) {
    return console.error('"setValueForReading" has not been overridden.');
  };

  TreemaNode.prototype.setValueForEditing = function(valEl) {
    if (!this.editable) {
      return;
    }
    return console.error('"setValueForEditing" has not been overridden.');
  };

  TreemaNode.prototype.saveChanges = function(valEl) {
    return console.error('"saveChanges" has not been overridden.');
  };

  TreemaNode.prototype.getDefaultValue = function() {
    return null;
  };

  TreemaNode.prototype.getChildren = function() {
    return console.error('"getChildren" has not been overridden.');
  };

  TreemaNode.prototype.getChildSchema = function() {
    return console.error('"getChildSchema" has not been overridden.');
  };

  TreemaNode.prototype.canAddChild = function() {
    return this.collection && this.editable;
  };

  TreemaNode.prototype.canAddProperty = function() {
    return true;
  };

  TreemaNode.prototype.setValueForReadingSimply = function(valEl, cssClass, text) {
    return valEl.append($("<pre class='" + cssClass + " treema-shortened'></pre>").text(text.slice(0, 200)));
  };

  TreemaNode.prototype.setValueForEditingSimply = function(valEl, value, inputType) {
    var input,
      _this = this;
    if (inputType == null) {
      inputType = null;
    }
    input = $('<input />');
    if (inputType) {
      input.attr('type', inputType);
    }
    if (value !== null) {
      input.val(value);
    }
    valEl.append(input);
    input.focus().select().blur(function() {
      var success;
      if ($('.treema-value', _this.$el).hasClass('treema-edit')) {
        success = _this.toggleEdit('treema-read');
      }
      if (!success) {
        return input.focus().select();
      }
    });
    input.keydown(function(e) {
      if (e.which === 8 && !$(input).val()) {
        _this.remove();
        return e.preventDefault();
      }
    });
    return input;
  };

  function TreemaNode(schema, data, options, isChild) {
    this.schema = schema;
    this.data = data;
    this.options = options;
    this.isChild = isChild;
    this.sortFromUI = __bind(this.sortFromUI, this);
    this.options = this.options || {};
    this.schema = this.schema || {};
  }

  TreemaNode.prototype.build = function() {
    var valEl;
    this.populateData();
    this.$el = $(this.nodeTemplate);
    valEl = $('.treema-value', this.$el);
    this.setValueForReading(valEl);
    if (!this.collection) {
      valEl.addClass('treema-read');
    }
    this.$el.data('instance', this);
    if (!this.isChild) {
      this.$el.addClass('treema-root');
    }
    if (!this.isChild) {
      this.$el.attr('tabindex', 9001);
    }
    if (this.collection) {
      this.$el.append($(this.childrenTemplate)).addClass('treema-closed');
    }
    if (this.collection && !this.isChild) {
      this.open();
    }
    if (!this.isChild) {
      this.setUpEvents();
    }
    if (this.collection) {
      this.updateMyAddButton();
    }
    this.$el.prepend($(this.backdropTemplate));
    return this.$el;
  };

  TreemaNode.prototype.populateData = function() {
    return this.data = this.data || this.schema["default"] || this.getDefaultValue();
  };

  TreemaNode.prototype.setUpEvents = function() {
    var _this = this;
    this.$el.dblclick(function(e) {
      var _ref;
      return (_ref = $(e.target).closest('.treema-node').data('instance')) != null ? _ref.onDoubleClick(e) : void 0;
    });
    this.$el.click(function(e) {
      var _ref;
      return (_ref = $(e.target).closest('.treema-node').data('instance')) != null ? _ref.onClick(e) : void 0;
    });
    return this.$el.keydown(function(e) {
      var _ref, _ref1;
      if (e.which === 8 && !((_ref = e.target.nodeName) === 'INPUT' || _ref === 'TEXTAREA')) {
        e.preventDefault();
        _this.removeSelectedNodes();
      }
      return (_ref1 = $(e.target).closest('.treema-node').data('instance')) != null ? _ref1.onKeyDown(e) : void 0;
    });
  };

  TreemaNode.prototype.onClick = function(e) {
    var clickedToggle, clickedValue, usedModKey, _ref;
    if ((_ref = e.target.nodeName) === 'INPUT' || _ref === 'TEXTAREA') {
      return;
    }
    clickedValue = $(e.target).closest('.treema-value').length;
    clickedToggle = $(e.target).hasClass('treema-toggle');
    usedModKey = e.shiftKey || e.ctrlKey || e.metaKey;
    if (!(clickedValue && !this.collection)) {
      this.$el.closest('.treema-root').focus();
    }
    if (clickedValue && !this.collection && !usedModKey) {
      return this.toggleEdit();
    }
    if (clickedToggle || (clickedValue && this.collection)) {
      return this.toggleOpen();
    }
    if ($(e.target).closest('.treema-add-child').length && this.collection) {
      return this.addNewChild();
    }
    if (!this.$el.hasClass('treema-root')) {
      if (e.shiftKey) {
        return this.shiftSelect();
      }
      if (e.ctrlKey || e.metaKey) {
        return this.toggleSelect();
      }
      return this.selectOne();
    }
  };

  TreemaNode.prototype.onDoubleClick = function(e) {
    var clickedKey;
    if (!this.collection) {
      return;
    }
    clickedKey = $(e.target).hasClass('treema-key');
    if (!clickedKey) {
      return;
    }
    if (this.$el.hasClass('treema-closed')) {
      this.open();
    }
    return this.addNewChild();
  };

  TreemaNode.prototype.onKeyDown = function(e) {
    if (e.which === 27) {
      this.onEscapePressed(e);
    }
    if (e.which === 9) {
      this.onTabPressed(e);
    }
    if (e.which === 37) {
      this.onLeftArrowPressed(e);
    }
    if (e.which === 38) {
      this.onUpArrowPressed(e);
    }
    if (e.which === 39) {
      this.onRightArrowPressed(e);
    }
    if (e.which === 40) {
      this.onDownArrowPressed(e);
    }
    if (e.which === 13) {
      this.onEnterPressed(e);
    }
    if (e.which === 78) {
      return this.onNPressed(e);
    }
  };

  TreemaNode.prototype.onLeftArrowPressed = function(e) {
    var parent, treema, treemas, _i, _len;
    treemas = this.getSelectedTreemas();
    for (_i = 0, _len = treemas.length; _i < _len; _i++) {
      treema = treemas[_i];
      if (treema.$el.hasClass('treema-open')) {
        return treema.close();
      }
    }
    if (treemas.length !== 1) {
      return;
    }
    parent = treemas[0].parent;
    if (parent.$el.hasClass('treema-root')) {
      return;
    }
    parent.close();
    return parent.selectOne();
  };

  TreemaNode.prototype.onRightArrowPressed = function(e) {
    var treema, _i, _len, _ref;
    _ref = this.getSelectedTreemas();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      treema = _ref[_i];
      if (!treema.collection) {
        return;
      }
      if (treema.$el.hasClass('treema-closed')) {
        treema.open();
      }
    }
  };

  TreemaNode.prototype.onUpArrowPressed = function(e) {
    return this.navigateSelection('prev');
  };

  TreemaNode.prototype.onDownArrowPressed = function(e) {
    return this.navigateSelection('next');
  };

  TreemaNode.prototype.navigateSelection = function(direction) {
    var next, selected;
    selected = this.getSelectedTreemas();
    if (selected.length !== 1) {
      return;
    }
    selected = selected[0];
    next = direction === 'next' ? selected.getNextTreema() : selected.getPreviousTreema();
    return next != null ? next.selectOne() : void 0;
  };

  TreemaNode.prototype.getSelectedTreemas = function() {
    var el, _i, _len, _ref, _results;
    _ref = this.$el.closest('.treema-root').find('.treema-selected');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      _results.push($(el).data('instance'));
    }
    return _results;
  };

  TreemaNode.prototype.getNextTreema = function() {
    var nextChild, nextParent, nextSibling, _ref;
    nextChild = this.$el.find('.treema-node:first').data('instance');
    if (nextChild) {
      return nextChild;
    }
    nextSibling = this.$el.next('.treema-node').data('instance');
    if (nextSibling) {
      return nextSibling;
    }
    nextParent = (_ref = this.parent) != null ? _ref.$el.next('.treema-node').data('instance') : void 0;
    return nextParent;
  };

  TreemaNode.prototype.getPreviousTreema = function() {
    var lastChild, prevSibling;
    prevSibling = this.$el.prev('.treema-node').data('instance');
    lastChild = prevSibling != null ? prevSibling.$el.find('.treema-node:last').data('instance') : void 0;
    return lastChild || prevSibling || this.parent;
  };

  TreemaNode.prototype.onEscapePressed = function(e) {
    if (this.justAdded) {
      return this.remove();
    }
    $(e.target).data('escaped', true).blur();
    if (!this.$el.hasClass('treema-root')) {
      this.$el.addClass('treema-selected');
    }
    return this.$el.closest('.treema-root').focus();
  };

  TreemaNode.prototype.onTabPressed = function(e) {
    var addingNewProperty, blurFailed, childIndex, direction, selection, target, _ref;
    direction = e.shiftKey ? 'prev' : 'next';
    target = $(e.target);
    addingNewProperty = target.hasClass('treema-new-prop');
    if (addingNewProperty) {
      e.preventDefault();
      childIndex = this.getTabbableChildrenTreemas().length;
      target.blur();
      blurFailed = this.$el.find('.treema-new-prop').length;
      if (blurFailed) {
        target.focus();
      }
      if (!$(document.activeElement).closest('.treema-root').length) {
        this.tabToNextTreema(childIndex, direction);
      }
    } else if ((_ref = this.parent) != null ? _ref.collection : void 0) {
      if (!this.endExistingEdits()) {
        target.focus();
      } else {
        childIndex = this.parent.getTabbableChildrenTreemas().indexOf(this);
        this.parent.tabToNextTreema(childIndex, direction);
      }
    }
    if ($(document.activeElement).hasClass('treema-root')) {
      selection = this.getSelectedTreemas();
      if (selection.length === 1 && !selection[0].collection) {
        selection[0].toggleEdit('treema-edit');
      }
    }
    return e.preventDefault();
  };

  TreemaNode.prototype.getTabbableChildrenTreemas = function() {
    var child, children, elem, _i, _len, _results;
    children = (function() {
      var _i, _len, _ref, _results;
      _ref = this.$el.find('> .treema-children > .treema-node');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        _results.push($(elem).data('instance'));
      }
      return _results;
    }).call(this);
    _results = [];
    for (_i = 0, _len = children.length; _i < _len; _i++) {
      child = children[_i];
      if (!(child.collection || child.skipTab)) {
        _results.push(child);
      }
    }
    return _results;
  };

  TreemaNode.prototype.tabToNextTreema = function(childIndex, direction) {
    var n, nextIndex, nextTreema, tabbableChildren;
    tabbableChildren = this.getTabbableChildrenTreemas();
    if (!tabbableChildren.length) {
      return null;
    }
    nextIndex = childIndex + (direction === "next" ? 1 : -1);
    n = tabbableChildren.length + 1;
    nextIndex = ((nextIndex % n) + n) % n;
    if (nextIndex === tabbableChildren.length) {
      nextTreema = this.addNewChild();
    } else {
      nextTreema = tabbableChildren[nextIndex];
      nextTreema.toggleEdit('treema-edit');
    }
    return nextTreema;
  };

  TreemaNode.prototype.onEnterPressed = function(e, selected) {
    if (selected == null) {
      selected = null;
    }
    if (!selected) {
      selected = this.getSelectedTreemas();
      if (selected.length !== 1) {
        return;
      }
      selected = selected[0];
      if (selected !== this) {
        return selected.onEnterPressed(e, selected);
      }
    }
    if (!selected.editable) {
      return;
    }
    if (selected.collection) {
      return selected.toggleOpen();
    }
    selected.selectOne();
    return selected.toggleEdit('treema-edit');
  };

  TreemaNode.prototype.onNPressed = function(e) {
    var selected, success, _ref;
    if (this.$el.closest('.treema-root').find('.treema-edit').length) {
      return;
    }
    selected = this.getSelectedTreemas();
    if (selected.length !== 1) {
      return;
    }
    success = (_ref = selected[0].parent) != null ? _ref.addNewChild() : void 0;
    if (success) {
      this.deselectAll();
    }
    return e.preventDefault();
  };

  TreemaNode.prototype.toggleEdit = function(toClass) {
    var valEl, wasEditing;
    if (!this.editable) {
      return false;
    }
    valEl = $('.treema-value', this.$el);
    wasEditing = valEl.hasClass('treema-edit');
    if (!(wasEditing || (toClass === 'treema-read' && !wasEditing) || this.endExistingEdits())) {
      return false;
    }
    if (!(toClass && valEl.hasClass(toClass))) {
      valEl.toggleClass('treema-read treema-edit');
    }
    if (valEl.hasClass('treema-read')) {
      if (wasEditing) {
        this.saveChanges(valEl);
        if (this.justAdded) {
          delete this.justAdded;
        }
        this.propagateData();
        this.refreshErrors();
        if (this.getErrors().length) {
          valEl.toggleClass('treema-read treema-edit');
          return false;
        }
      }
      this.propagateData();
      valEl.empty();
      this.setValueForReading(valEl);
    }
    if (valEl.hasClass('treema-edit')) {
      valEl.empty();
      this.setValueForEditing(valEl);
      this.deselectAll();
    }
    return true;
  };

  TreemaNode.prototype.endExistingEdits = function() {
    var editing, elem, _i, _len;
    editing = this.$el.closest('.treema-root').find('.treema-edit').closest('.treema-node');
    for (_i = 0, _len = editing.length; _i < _len; _i++) {
      elem = editing[_i];
      if (!$(elem).data('instance').toggleEdit('treema-read')) {
        return false;
      }
    }
    return true;
  };

  TreemaNode.prototype.propagateData = function() {
    if (!this.parent) {
      return;
    }
    this.parent.data[this.keyForParent] = this.data;
    return this.parent.refreshErrors();
  };

  TreemaNode.prototype.saveSnapshot = function() {
    var wrappedData;
    wrappedData = {
      'wrap': this.data
    };
    this.snapData = $.extend(true, {}, wrappedData)['wrap'];
    return this.snapErrors = this.getErrors();
  };

  TreemaNode.prototype.getErrorsSinceLastSnapshot = function() {
    if (this.snapErrors.length > 0) {
      return [];
    }
    return this.snapErrors = this.getErrors();
  };

  TreemaNode.prototype.revertSnapshot = function() {
    this.data = this.snapData;
    delete this.snapData;
    return delete this.snapErrors;
  };

  TreemaNode.prototype.addNewChild = function() {
    var childNode, keyInput, newTreema, new_index, properties, schema,
      _this = this;
    if (!this.canAddChild()) {
      return;
    }
    if (this.$el.hasClass('treema-closed')) {
      this.open();
    }
    if (this.ordered) {
      new_index = Object.keys(this.childrenTreemas).length;
      schema = this.getChildSchema();
      newTreema = this.addChildTreema(new_index, void 0, schema);
      newTreema.justAdded = true;
      childNode = this.createChildNode(newTreema);
      this.getMyAddButton().before(childNode);
      newTreema.toggleEdit('treema-edit');
      newTreema.removeErrors();
    }
    if (this.keyed) {
      properties = this.childPropertiesAvailable();
      keyInput = $(this.newPropertyTemplate);
      if (typeof keyInput.autocomplete === "function") {
        keyInput.autocomplete({
          source: properties
        });
      }
      this.getMyAddButton().before(keyInput);
      keyInput.focus();
      keyInput.keydown(function(e) {
        if (e.which === 8 && !keyInput.val()) {
          _this.$el.find('.treema-new-prop-error').remove();
          keyInput.remove();
          return e.preventDefault();
        }
      });
      keyInput.blur(function(e) {
        var child_key, child_schema, escaped, key, _ref;
        _this.$el.find('.treema-new-prop-error').remove();
        key = keyInput.val();
        if (_this.schema.properties) {
          _ref = _this.schema.properties;
          for (child_key in _ref) {
            child_schema = _ref[child_key];
            if (child_schema.title === key) {
              key = child_key;
            }
          }
        }
        if (key.length && !_this.canAddProperty(key)) {
          keyInput.focus();
          $(_this.newPropertyErrorTemplate).text('Invalid property name.').insertAfter(keyInput);
          return;
        }
        escaped = keyInput.data('escaped');
        keyInput.remove();
        if (escaped) {
          return;
        }
        if (!key.length) {
          return;
        }
        if (_this.childrenTreemas[key] != null) {
          return _this.childrenTreemas[key].toggleEdit();
        }
        schema = _this.getChildSchema(key);
        newTreema = _this.addChildTreema(key, null, schema);
        newTreema.justAdded = true;
        childNode = _this.createChildNode(newTreema);
        _this.findObjectInsertionPoint(key).before(childNode);
        if (newTreema.collection) {
          newTreema.addNewChild();
        } else {
          newTreema.toggleEdit('treema-edit');
        }
        return _this.updateMyAddButton();
      });
    }
    return true;
  };

  TreemaNode.prototype.findObjectInsertionPoint = function(key) {
    var afterKeys, allChildren, allProps, child, _i, _len, _ref, _ref1;
    if (!((_ref = this.schema.properties) != null ? _ref[key] : void 0)) {
      return this.getMyAddButton();
    }
    allProps = Object.keys(this.schema.properties);
    afterKeys = allProps.slice(allProps.indexOf(key) + 1);
    allChildren = this.$el.find('> .treema-children > .treema-node');
    for (_i = 0, _len = allChildren.length; _i < _len; _i++) {
      child = allChildren[_i];
      if (_ref1 = $(child).data('instance').keyForParent, __indexOf.call(afterKeys, _ref1) >= 0) {
        return $(child);
      }
    }
    return this.getMyAddButton();
  };

  TreemaNode.prototype.getMyAddButton = function() {
    return this.$el.find('> .treema-children > .treema-add-child');
  };

  TreemaNode.prototype.updateMyAddButton = function() {
    this.$el.removeClass('treema-full');
    if (!this.canAddChild()) {
      return this.$el.addClass('treema-full');
    }
  };

  TreemaNode.prototype.childPropertiesAvailable = function() {
    var childSchema, properties, property, _ref;
    if (!this.schema.properties) {
      return [];
    }
    properties = [];
    _ref = this.schema.properties;
    for (property in _ref) {
      childSchema = _ref[property];
      if (this.childrenTreemas[property] != null) {
        continue;
      }
      properties.push(childSchema.title || property);
    }
    return properties.sort();
  };

  TreemaNode.prototype.removeSelectedNodes = function() {
    var nextSibling, prevSibling, selected, toSelect, treema, _i, _len;
    selected = this.getSelectedTreemas();
    toSelect = null;
    if (selected.length === 1) {
      nextSibling = selected[0].$el.next('.treema-node').data('instance');
      prevSibling = selected[0].$el.prev('.treema-node').data('instance');
      toSelect = nextSibling || prevSibling || selected[0].parent;
    }
    for (_i = 0, _len = selected.length; _i < _len; _i++) {
      treema = selected[_i];
      treema.remove();
    }
    if (toSelect && !this.getSelectedTreemas().length) {
      return toSelect.selectOne();
    }
  };

  TreemaNode.prototype.remove = function() {
    var _ref;
    if (this.parent && (this.parent.schema.required != null) && (_ref = this.keyForParent, __indexOf.call(this.parent.schema.required, _ref) >= 0)) {
      return;
    }
    this.$el.remove();
    if (this.parent == null) {
      return;
    }
    delete this.parent.childrenTreemas[this.keyForParent];
    delete this.parent.data[this.keyForParent];
    if (this.parent.ordered) {
      this.parent.sortFromUI();
    }
    this.parent.refreshErrors();
    return this.parent.updateMyAddButton();
  };

  TreemaNode.prototype.toggleOpen = function() {
    if (this.$el.hasClass('treema-closed')) {
      return this.open();
    } else {
      return this.close();
    }
  };

  TreemaNode.prototype.open = function() {
    var childNode, childrenContainer, key, schema, treema, value, _base, _i, _len, _ref, _ref1;
    childrenContainer = this.$el.find('.treema-children').detach();
    childrenContainer.empty();
    this.childrenTreemas = {};
    _ref = this.getChildren();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _ref1 = _ref[_i], key = _ref1[0], value = _ref1[1], schema = _ref1[2];
      treema = this.addChildTreema(key, value, schema);
      childNode = this.createChildNode(treema);
      childrenContainer.append(childNode);
    }
    this.$el.append(childrenContainer).removeClass('treema-closed').addClass('treema-open');
    childrenContainer.append($(this.addChildTemplate));
    if (this.ordered && childrenContainer.sortable) {
      if (typeof childrenContainer.sortable === "function") {
        if (typeof (_base = childrenContainer.sortable({
          deactivate: this.sortFromUI
        })).disableSelection === "function") {
          _base.disableSelection();
        }
      }
    }
    return this.refreshErrors();
  };

  TreemaNode.prototype.sortFromUI = function() {
    var child, children, index, treema, _i, _len;
    children = this.$el.find('> .treema-children > .treema-node');
    index = 0;
    this.childrenTreemas = {};
    this.data = $.isArray(this.data) ? [] : {};
    for (_i = 0, _len = children.length; _i < _len; _i++) {
      child = children[_i];
      treema = $(child).data('instance');
      if (!treema) {
        continue;
      }
      treema.keyForParent = index;
      this.childrenTreemas[index] = treema;
      this.data[index] = treema.data;
      index += 1;
    }
    return this.propagateData();
  };

  TreemaNode.prototype.close = function() {
    var key, treema, _ref;
    _ref = this.childrenTreemas;
    for (key in _ref) {
      treema = _ref[key];
      this.data[key] = treema.data;
    }
    this.$el.find('.treema-children').empty();
    this.$el.addClass('treema-closed').removeClass('treema-open');
    this.childrenTreemas = null;
    this.refreshErrors();
    return this.setValueForReading($('.treema-value', this.$el).empty());
  };

  TreemaNode.prototype.selectOne = function() {
    this.deselectAll(true);
    return this.toggleSelect();
  };

  TreemaNode.prototype.toggleSelect = function() {
    if (!this.$el.hasClass('treema-root')) {
      this.$el.toggleClass('treema-selected');
    }
    if (this.$el.hasClass('treema-selected')) {
      this.$el.closest('.treema-root').find('.treema-last-selected').removeClass('treema-last-selected');
      return this.$el.addClass('treema-last-selected');
    }
  };

  TreemaNode.prototype.shiftSelect = function() {
    var allNodes, lastSelected, node, started, _i, _len;
    lastSelected = this.$el.closest('.treema-root').find('.treema-last-selected');
    if (!lastSelected.length) {
      this.selectOne();
    }
    this.deselectAll();
    allNodes = this.$el.closest('.treema-root').find('.treema-node');
    started = false;
    for (_i = 0, _len = allNodes.length; _i < _len; _i++) {
      node = allNodes[_i];
      node = $(node).data('instance');
      if (!started) {
        if (node === this || node.$el.hasClass('treema-last-selected')) {
          started = true;
        }
        if (started) {
          node.$el.addClass('treema-selected');
        }
        continue;
      }
      if (started && (node === this || node.$el.hasClass('treema-last-selected'))) {
        break;
      }
      node.$el.addClass('treema-selected');
    }
    this.$el.addClass('treema-selected');
    return lastSelected.addClass('treema-selected');
  };

  TreemaNode.prototype.addChildTreema = function(key, value, schema) {
    var treema;
    treema = makeTreema(schema, value, {}, true);
    treema.keyForParent = key;
    treema.parent = this;
    this.childrenTreemas[key] = treema;
    treema.populateData();
    this.data[key] = treema.data;
    return treema;
  };

  TreemaNode.prototype.deselectAll = function(excludeSelf) {
    var treema, _i, _len, _ref, _results;
    if (excludeSelf == null) {
      excludeSelf = false;
    }
    _ref = this.getSelectedTreemas();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      treema = _ref[_i];
      if (excludeSelf && treema === this) {
        continue;
      }
      _results.push(treema.$el.removeClass('treema-selected'));
    }
    return _results;
  };

  TreemaNode.prototype.createChildNode = function(treema) {
    var childNode, keyEl, name, required, _ref;
    childNode = treema.build();
    if (this.collection) {
      name = treema.schema.title || treema.keyForParent;
      keyEl = $(this.keyTemplate).text(name);
      if (treema.schema.description) {
        keyEl.attr('title', treema.schema.description);
      }
      childNode.prepend(' : ');
      required = this.schema.required || [];
      if (_ref = treema.keyForParent, __indexOf.call(required, _ref) >= 0) {
        childNode.prepend('*');
      }
      childNode.prepend(keyEl);
    }
    if (treema.collection) {
      childNode.prepend($(this.toggleTemplate));
    }
    return childNode;
  };

  TreemaNode.prototype.refreshErrors = function() {
    this.removeErrors();
    return this.showErrors();
  };

  TreemaNode.prototype.showErrors = function() {
    var childErrors, deepestTreema, e, error, erroredTreemas, errors, message, messages, ownErrors, path, subpath, treema, _i, _j, _k, _len, _len1, _len2, _ref, _results;
    if (this.justAdded) {
      return;
    }
    errors = this.getErrors();
    erroredTreemas = [];
    for (_i = 0, _len = errors.length; _i < _len; _i++) {
      error = errors[_i];
      path = error.dataPath.split('/').slice(1);
      deepestTreema = this;
      for (_j = 0, _len1 = path.length; _j < _len1; _j++) {
        subpath = path[_j];
        if (!deepestTreema.childrenTreemas) {
          error.forChild = true;
          break;
        }
        if (deepestTreema.ordered) {
          subpath = parseInt(subpath);
        }
        deepestTreema = deepestTreema.childrenTreemas[subpath];
      }
      if (!(deepestTreema._errors && __indexOf.call(erroredTreemas, deepestTreema) >= 0)) {
        deepestTreema._errors = [];
      }
      deepestTreema._errors.push(error);
      erroredTreemas.push(deepestTreema);
    }
    _ref = $.unique(erroredTreemas);
    _results = [];
    for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
      treema = _ref[_k];
      childErrors = (function() {
        var _l, _len3, _ref1, _results1;
        _ref1 = treema._errors;
        _results1 = [];
        for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
          e = _ref1[_l];
          if (e.forChild) {
            _results1.push(e);
          }
        }
        return _results1;
      })();
      ownErrors = (function() {
        var _l, _len3, _ref1, _results1;
        _ref1 = treema._errors;
        _results1 = [];
        for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
          e = _ref1[_l];
          if (!e.forChild) {
            _results1.push(e);
          }
        }
        return _results1;
      })();
      messages = (function() {
        var _l, _len3, _results1;
        _results1 = [];
        for (_l = 0, _len3 = ownErrors.length; _l < _len3; _l++) {
          e = ownErrors[_l];
          _results1.push(e.message);
        }
        return _results1;
      })();
      if (childErrors.length > 0) {
        message = "[" + childErrors.length + "] error";
        if (childErrors.length > 1) {
          message = message + 's';
        }
        messages.push(message);
      }
      _results.push(treema.showError(messages.join('<br />')));
    }
    return _results;
  };

  TreemaNode.prototype.showError = function(message) {
    this.$el.prepend($(this.templateString));
    this.$el.find('> .treema-error').html(message).show();
    return this.$el.addClass('treema-has-error');
  };

  TreemaNode.prototype.removeErrors = function() {
    this.$el.find('.treema-error').remove();
    return this.$el.removeClass('treema-has-error');
  };

  return TreemaNode;

})();

StringTreemaNode = (function(_super) {
  __extends(StringTreemaNode, _super);

  function StringTreemaNode() {
    _ref = StringTreemaNode.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  StringTreemaNode.prototype.getDefaultValue = function() {
    return '';
  };

  StringTreemaNode.inputTypes = ['color', 'date', 'datetime', 'datetime-local', 'email', 'month', 'range', 'search', 'tel', 'text', 'time', 'url', 'week'];

  StringTreemaNode.prototype.setValueForReading = function(valEl) {
    return this.setValueForReadingSimply(valEl, 'treema-string', "\"" + this.data + "\"");
  };

  StringTreemaNode.prototype.setValueForEditing = function(valEl) {
    var input, _ref1;
    input = this.setValueForEditingSimply(valEl, this.data);
    if (this.schema.maxLength) {
      input.attr('maxlength', this.schema.maxLength);
    }
    if (_ref1 = this.schema.format, __indexOf.call(StringTreemaNode.inputTypes, _ref1) >= 0) {
      return input.attr('type', this.schema.format);
    }
  };

  StringTreemaNode.prototype.saveChanges = function(valEl) {
    return this.data = $('input', valEl).val();
  };

  return StringTreemaNode;

})(TreemaNode);

NumberTreemaNode = (function(_super) {
  __extends(NumberTreemaNode, _super);

  function NumberTreemaNode() {
    _ref1 = NumberTreemaNode.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  NumberTreemaNode.prototype.getDefaultValue = function() {
    return 0;
  };

  NumberTreemaNode.prototype.setValueForReading = function(valEl) {
    return this.setValueForReadingSimply(valEl, 'treema-number', JSON.stringify(this.data));
  };

  NumberTreemaNode.prototype.setValueForEditing = function(valEl) {
    var input;
    input = this.setValueForEditingSimply(valEl, JSON.stringify(this.data), 'number');
    if (this.schema.maximum) {
      input.attr('max', this.schema.maximum);
    }
    if (this.schema.minimum) {
      return input.attr('min', this.schema.minimum);
    }
  };

  NumberTreemaNode.prototype.saveChanges = function(valEl) {
    return this.data = parseFloat($('input', valEl).val());
  };

  return NumberTreemaNode;

})(TreemaNode);

NullTreemaNode = (function(_super) {
  __extends(NullTreemaNode, _super);

  function NullTreemaNode() {
    _ref2 = NullTreemaNode.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  NullTreemaNode.prototype.editable = false;

  NullTreemaNode.prototype.setValueForReading = function(valEl) {
    return this.setValueForReadingSimply(valEl, 'treema-null', 'null');
  };

  return NullTreemaNode;

})(TreemaNode);

BooleanTreemaNode = (function(_super) {
  __extends(BooleanTreemaNode, _super);

  function BooleanTreemaNode() {
    _ref3 = BooleanTreemaNode.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  BooleanTreemaNode.prototype.getDefaultValue = function() {
    return false;
  };

  BooleanTreemaNode.prototype.skipTab = true;

  BooleanTreemaNode.prototype.setValueForReading = function(valEl) {
    return this.setValueForReadingSimply(valEl, 'treema-boolean', JSON.stringify(this.data));
  };

  BooleanTreemaNode.prototype.toggleValue = function() {
    this.data = !this.data;
    return this.setValueForReading($('.treema-value', this.$el).empty());
  };

  BooleanTreemaNode.prototype.onEnterPressed = function() {
    return this.toggleValue();
  };

  BooleanTreemaNode.prototype.onClick = function(e) {
    if ($(e.target).closest('.treema-value').length) {
      return this.toggleValue();
    }
    return BooleanTreemaNode.__super__.onClick.call(this, e);
  };

  BooleanTreemaNode.prototype.toggleEdit = function(toClass) {
    if (toClass !== 'treema-read') {
      return this.toggleValue();
    }
  };

  return BooleanTreemaNode;

})(TreemaNode);

ArrayTreemaNode = (function(_super) {
  __extends(ArrayTreemaNode, _super);

  function ArrayTreemaNode() {
    _ref4 = ArrayTreemaNode.__super__.constructor.apply(this, arguments);
    return _ref4;
  }

  ArrayTreemaNode.prototype.getDefaultValue = function() {
    return [];
  };

  ArrayTreemaNode.prototype.collection = true;

  ArrayTreemaNode.prototype.ordered = true;

  ArrayTreemaNode.prototype.getChildren = function() {
    var key, value, _i, _len, _ref5, _results;
    _ref5 = this.data;
    _results = [];
    for (key = _i = 0, _len = _ref5.length; _i < _len; key = ++_i) {
      value = _ref5[key];
      _results.push([key, value, this.getChildSchema()]);
    }
    return _results;
  };

  ArrayTreemaNode.prototype.getChildSchema = function() {
    return this.schema.items || {};
  };

  ArrayTreemaNode.prototype.setValueForReading = function(valEl) {
    return this.setValueForReadingSimply(valEl, 'treema-array', JSON.stringify(this.data));
  };

  ArrayTreemaNode.prototype.setValueForEditing = function(valEl) {
    return this.setValueForEditingSimply(valEl, JSON.stringify(this.data));
  };

  ArrayTreemaNode.prototype.canAddChild = function() {
    if (this.schema.additionalItems === false && this.data.length >= this.schema.items.length) {
      return false;
    }
    if ((this.schema.maxItems != null) && this.data.length >= this.schema.maxItems) {
      return false;
    }
    return true;
  };

  return ArrayTreemaNode;

})(TreemaNode);

ObjectTreemaNode = (function(_super) {
  __extends(ObjectTreemaNode, _super);

  function ObjectTreemaNode() {
    _ref5 = ObjectTreemaNode.__super__.constructor.apply(this, arguments);
    return _ref5;
  }

  ObjectTreemaNode.prototype.getDefaultValue = function() {
    return {};
  };

  ObjectTreemaNode.prototype.collection = true;

  ObjectTreemaNode.prototype.keyed = true;

  ObjectTreemaNode.prototype.getChildren = function() {
    var children, key, keysAccountedFor, value, _ref6;
    children = [];
    keysAccountedFor = [];
    if (this.schema.properties) {
      for (key in this.schema.properties) {
        if (typeof this.data[key] === 'undefined') {
          continue;
        }
        keysAccountedFor.push(key);
        children.push([key, this.data[key], this.getChildSchema(key)]);
      }
    }
    _ref6 = this.data;
    for (key in _ref6) {
      value = _ref6[key];
      if (__indexOf.call(keysAccountedFor, key) >= 0) {
        continue;
      }
      children.push([key, value, this.getChildSchema(key)]);
    }
    return children;
  };

  ObjectTreemaNode.prototype.getChildSchema = function(key_or_title) {
    var child_schema, key, _ref6;
    _ref6 = this.schema.properties;
    for (key in _ref6) {
      child_schema = _ref6[key];
      if (key === key_or_title || child_schema.title === key_or_title) {
        return child_schema;
      }
    }
    return {};
  };

  ObjectTreemaNode.prototype.setValueForEditing = function(valEl) {
    return this.setValueForEditingSimply(valEl, JSON.stringify(this.data));
  };

  ObjectTreemaNode.prototype.setValueForReading = function(valEl) {
    var size;
    size = Object.keys(this.data).length;
    return this.setValueForReadingSimply(valEl, 'treema-object', JSON.stringify(this.data));
  };

  ObjectTreemaNode.prototype.populateData = function() {
    var helperTreema, key, _i, _len, _ref6, _results;
    ObjectTreemaNode.__super__.populateData.call(this);
    if (!this.schema.required) {
      return;
    }
    _ref6 = this.schema.required;
    _results = [];
    for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
      key = _ref6[_i];
      if (this.data[key]) {
        continue;
      }
      helperTreema = makeTreema(this.getChildSchema(key), null, {}, true);
      helperTreema.populateData();
      _results.push(this.data[key] = helperTreema.data);
    }
    return _results;
  };

  ObjectTreemaNode.prototype.canAddChild = function() {
    if ((this.schema.maxProperties != null) && Object.keys(this.data).length >= this.schema.maxProperties) {
      return false;
    }
    if (this.schema.additionalProperties === false) {
      return true;
    }
    if (this.schema.patternProperties != null) {
      return true;
    }
    if (this.childPropertiesAvailable().length) {
      return true;
    }
    return false;
  };

  ObjectTreemaNode.prototype.canAddProperty = function(key) {
    var pattern;
    if (this.schema.additionalProperties !== false) {
      return true;
    }
    if (this.schema.properties[key] != null) {
      return true;
    }
    if (this.schema.patternProperties != null) {
      if ((function() {
        var _results;
        _results = [];
        for (pattern in this.schema.patternProperties) {
          _results.push(RegExp(pattern).test(key));
        }
        return _results;
      }).call(this)) {
        return true;
      }
    }
    return false;
  };

  return ObjectTreemaNode;

})(TreemaNode);

AnyTreemaNode = (function(_super) {
  __extends(AnyTreemaNode, _super);

  "Super flexible input, can handle inputs like:\n  true      -> true\n  'true     -> 'true'\n  'true'    -> 'true'\n  1.2       -> 1.2\n  [         -> []\n  {         -> {}\n  [1,2,3]   -> [1,2,3]\n  null      -> null";

  AnyTreemaNode.prototype.helper = null;

  function AnyTreemaNode() {
    var splat;
    splat = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    AnyTreemaNode.__super__.constructor.apply(this, splat);
    this.updateShadowMethods();
  }

  AnyTreemaNode.prototype.setValueForEditing = function(valEl) {
    return this.setValueForEditingSimply(valEl, JSON.stringify(this.data));
  };

  AnyTreemaNode.prototype.saveChanges = function(valEl) {
    var e;
    this.data = $('input', valEl).val();
    if (this.data[0] === "'" && this.data[this.data.length - 1] !== "'") {
      this.data = this.data.slice(1);
    } else if (this.data[0] === '"' && this.data[this.data.length - 1] !== '"') {
      this.data = this.data.slice(1);
    } else if (this.data.trim() === '[') {
      this.data = [];
    } else if (this.data.trim() === '{') {
      this.data = {};
    } else {
      try {
        this.data = JSON.parse(this.data);
      } catch (_error) {
        e = _error;
        console.log('could not parse data', this.data);
      }
    }
    this.updateShadowMethods();
    return this.rebuild();
  };

  AnyTreemaNode.prototype.updateShadowMethods = function() {
    var NodeClass, dataType, prop, _i, _len, _ref6, _results;
    dataType = $.type(this.data);
    NodeClass = TreemaNodeMap[dataType];
    this.helper = new NodeClass(this.schema, this.data, this.options, this.isChild);
    _ref6 = ['collection', 'ordered', 'keyed', 'getChildSchema', 'getChildren', 'getChildSchema', 'setValueForReading'];
    _results = [];
    for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
      prop = _ref6[_i];
      _results.push(this[prop] = this.helper[prop]);
    }
    return _results;
  };

  AnyTreemaNode.prototype.rebuild = function() {
    var newNode, oldEl;
    oldEl = this.$el;
    if (this.parent) {
      newNode = this.parent.createChildNode(this);
    } else {
      newNode = this.build();
    }
    return oldEl.replaceWith(newNode);
  };

  return AnyTreemaNode;

})(TreemaNode);

TreemaNodeMap = {
  'array': ArrayTreemaNode,
  'string': StringTreemaNode,
  'object': ObjectTreemaNode,
  'number': NumberTreemaNode,
  'null': NullTreemaNode,
  'boolean': BooleanTreemaNode,
  'any': AnyTreemaNode
};

makeTreema = function(schema, data, options, child) {
  var NodeClass;
  NodeClass = TreemaNodeMap[schema.format];
  if (!NodeClass) {
    NodeClass = TreemaNodeMap[schema.type];
  }
  if (!NodeClass) {
    NodeClass = TreemaNodeMap['any'];
  }
  return new NodeClass(schema, data, options, child);
};

//@ sourceMappingURL=treema.js.map