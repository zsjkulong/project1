/**
 * Created by haonan on 2016/6/15.
 */
/**
 *
 * @module ryui
 * @class core
 * @version 1.0.0
 *
 */
var ryui = (function(document, undefined) {
    var readyRE = /complete|loaded|interactive/;
    var idSelectorRE = /^#([\w-]+)$/;
    var classSelectorRE = /^\.([\w-]+)$/;
    var tagSelectorRE = /^[\w-]+$/;
    var translateRE = /translate(?:3d)?\((.+?)\)/;
    var translateMatrixRE = /matrix(3d)?\((.+?)\)/;
    var fragmentRE = /^\s*<(\w+|!)[^>]*>/;
    var elementTypes = [1, 3, 8, 9, 11];

    var $ = function(selector, context) {
        if (!selector)
            return wrap();
        else if ($.isWrap(selector))
            return selector;
        else if ($.isArray(selector))
            return wrap(compact(selector));
        else if ($.isPlainObject(selector))
            return wrap([$.extend({}, selector)],selector);
        else if ($.isFunction(selector))
            return $.ready(selector);
        else if (idSelectorRE.test(selector)) {
            var found = document.getElementById(RegExp.$1);
            return wrap(found ? [found] : [],selector);
        }
        else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window)
            return wrap([selector]);
        else if (fragmentRE.test(selector))
            return wrap(fragment(selector.trim(), RegExp.$1),selector);
        else if (context !== undefined)
            return $(context).find(selector);
        else
            return wrap($.qsa(selector, document), selector);
    };

    var wrap = function(dom, selector) {
        dom = dom || [];
        Object.setPrototypeOf(dom, $.fn);
        dom.selector = selector || '';
        return dom;
    };

    var compact=function(array) {
        return array.filter(
            function(item){
                return item !== undefined && item !== null;
            });
    };

    $.isWrap=function(obj){
        if($.isObject(obj) && obj.__proto__ && (obj.selector===''|| $.isExist(obj.selector)))return true;
        return false;
    }

    //是否打开开发者模式
    $.devMode=false;

    $.uuid = 0;

    $.data = {};
    /**
     * 将多个对象合并成一个对象
     * @method extend
     * @param  {object} target 必选  需合并的目标对象
     * @param  {object} object1 必选  需合并的对象
     * @param  {object} objectN 可选  需合并的对象
     */
    $.extend = function() { //from jquery2
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === 'boolean') {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== 'object' && !$.isFunction(target)) {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];

                        } else {
                            clone = src && $.isPlainObject(src) ? src : {};
                        }

                        target[name] = $.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };
    /**
     * ryui noop(function)
     */
    $.noop = function() {};
    /**
     * ryui slice(array)
     */
    $.slice = [].slice;
    /**
     * ryui filter(array)
     */
    $.filter = [].filter;
    /**
     * 获取对象类型
     * @method type
     * @param  {object} obj 必选  目标对象
     * @returns {string} null/object/boolean/number/string/function/array/date/regexp/error
     */
    $.type = function(obj) {
        return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || 'object';
    };
    /**
     * 验证是否是数组
     * @method isArray
     * @param  {object} obj 必选  验证对象
     * @returns {boolean} true/false
     */
    $.isArray =function(object) {
        return object instanceof Array;
    };
    /**
     * 验证是否是window对象
     * @method isWindow
     * @param  {object} obj 必选  验证对象
     * @returns {boolean} true/false
     */
    $.isWindow = function(obj) {
        return obj != null && obj === obj.window;
    };
    /**
     * 验证是否是对象
     * @method isObject
     * @param  {object} obj 必选  验证对象
     * @returns {boolean} true/false
     */
    $.isObject = function(obj) {
        return obj instanceof Object;
    };
    /**
     * 验证是否是纯对象
     * @method isObject
     * @param  {object} obj 必选  验证对象
     * @returns {boolean} true/false
     */
    $.isPlainObject = function(obj) {
        return $.isObject(obj) && !$.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
    };
    /**
     * 验证是否是空对象
     * @method isObject
     * @param  {object} obj 必选  验证对象
     * @returns {boolean} true/false
     */
    $.isEmptyObject = function(o) {
        for (var p in o) {
            if (p !== undefined) {
                return false;
            }
        }
        return true;
    };
    /**
     * 验证是否是function对象
     * @method isObject
     * @param  {object} obj 必选  验证对象
     * @returns {boolean} true/false
     */
    $.isFunction = function(value) {
        return $.type(value) === 'function';
    };
    /**
     * 判断js对象是否存在
     * @method isExist
     * @param  obj 必选 验证的对象
     * @returns {boolean} true/fasle
     */
    $.isExist=function(obj) {
        return (typeof obj !== 'undefined') && (obj !== null) && (obj !== '');
    };
    /**
     * ryui querySelectorAll
     */
    $.qsa = function(selector, context) {
        context = context || document;
        return $.slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
    };
    /**
     * domReady
     * @method ready
     * @param  {function} callback 必选  dom加载完成时执行的回调函数
     */
    $.ready = function(callback) {
        if (readyRE.test(document.readyState)) {
            callback($);
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                callback($);
            }, false);
        }
        return this;
    };

    /**
     * 遍历数组
     * @method map
     * @param  {object} elements 必选  目标数组对象
     *  @param  {function} callback 必选  回调函数，入参 key,value
     */
    $.map = function(elements, callback) {
        var value, values = [],
            i, key,len;
        if (likeArray(elements)) { //TODO 此处逻辑不严谨，可能会有Object:{a:'b',length:1}的情况未处理
            for (i = 0, len = elements.length; i < len; i++) {
                value = callback(elements[i], i);
                if (value != null) values.push(value);
            }
        } else {
            for (key in elements) {
                value = callback(elements[key], key);
                if (value != null) values.push(value);
            }
        }
        return values.length > 0 ? [].concat.apply([], values) : values;
    };

    var likeArray=function(obj) {
        return typeof obj.length == 'number';
    };

    /**
     * 遍历对象
     * @method each
     * @param  {object} elements 必选  需遍历的对象或数组；若为对象，仅遍历对象根节点下的key
     * @param  {function} callback 必选  回调函数  Function( Integer||String index,Anything element) 为每个元素执行的回调函数；其中，index表示当前元素的下标或key，element表示当前匹配元素
     *
     */
    $.each = function(elements, callback, hasOwnProperty) {
        if (!elements) {
            return this;
        }
        var i, key;
        if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false) return elements;
        }else {
            for (var key in elements) {
                if (hasOwnProperty) {
                    if (elements.hasOwnProperty(key)) {
                        if (callback.call(elements[key], key, elements[key]) === false) return elements;
                    }
                } else {
                    if (callback.call(elements[key], key, elements[key]) === false) return elements;
                }
            }
        }
        return elements;
    };

    /**
     * dom元素获取焦点
     * @method map
     * @param  {object} elements 必选  dom对象
     */
    $.focus = function(element) {
        if ($.os.ios) {
            setTimeout(function() {
                element.focus();
            }, 10);
        } else {
            element.focus();
        }
    };
    /**
     * trigger event
     */
    $.trigger = function(element, eventType, eventData) {
        element.dispatchEvent(new CustomEvent(eventType, {
            detail: eventData,
            bubbles: true,
            cancelable: true
        }));
        return this;
    };
    /**
     * 获取dom元素样式
     * @method getStyles
     * @param  {object} elements 必选  dom对象
     * @param  {string} property 可选  属性名称
     * @returns {string} 样式
     */
    $.getStyles = function(element, property) {
        var styles = element.ownerDocument.defaultView.getComputedStyle(element, null);
        if (property) {
            return styles.getPropertyValue(property) || styles[property];
        }
        return styles;
    };
    /**
     * parseTranslate
     * @param {type} translateString
     * @param {type} position
     * @returns {Object}
     */
    $.parseTranslate = function(translateString, position) {
        var result = translateString.match(translateRE || '');
        if (!result || !result[1]) {
            result = ['', '0,0,0'];
        }
        result = result[1].split(",");
        result = {
            x: parseFloat(result[0]),
            y: parseFloat(result[1]),
            z: parseFloat(result[2])
        };
        if (position && result.hasOwnProperty(position)) {
            return result[position];
        }
        return result;
    };
    /**
     * parseTranslateMatrix
     * @param {type} translateString
     * @param {type} position
     * @returns {Object}
     */
    $.parseTranslateMatrix = function(translateString, position) {
        var matrix = translateString.match(translateMatrixRE);
        var is3D = matrix && matrix[1];
        if (matrix) {
            matrix = matrix[2].split(",");
            if (is3D === "3d")
                matrix = matrix.slice(12, 15);
            else {
                matrix.push(0);
                matrix = matrix.slice(4, 7);
            }
        } else {
            matrix = [0, 0, 0];
        }
        var result = {
            x: parseFloat(matrix[0]),
            y: parseFloat(matrix[1]),
            z: parseFloat(matrix[2])
        };
        if (position && result.hasOwnProperty(position)) {
            return result[position];
        }
        return result;
    };
    $.hooks = {};
    $.addAction = function(type, hook) {
        var hooks = $.hooks[type];
        if (!hooks) {
            hooks = [];
        }
        hook.index = hook.index || 1000;
        hooks.push(hook);
        hooks.sort(function(a, b) {
            return a.index - b.index;
        });
        $.hooks[type] = hooks;
        return $.hooks[type];
    };
    $.doAction = function(type, callback) {
        if ($.isFunction(callback)) { //指定了callback
            $.each($.hooks[type], callback);
        } else { //未指定callback，直接执行
            $.each($.hooks[type], function(index, hook) {
                return !hook.handle();
            });
        }
    };
    /**
     * setTimeout封装
     * @param {Object} fn
     * @param {Object} when
     * @param {Object} context
     * @param {Object} data
     */
    $.later = function(fn, when, context, data) {
        when = when || 0;
        var m = fn;
        var d = data;
        var f;
        var r;

        if (typeof fn === 'string') {
            m = context[fn];
        }

        f = function() {
            m.apply(context, $.isArray(d) ? d : [d]);
        };

        r = setTimeout(f, when);

        return {
            id: r,
            cancel: function() {
                clearTimeout(r);
            }
        };
    };
    $.now = Date.now || function() {
            return +new Date();
        };

    if (window.JSON) {
        $.parseJSON = JSON.parse;
    }

    var class2type = {};
    $.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    //移植zepto核心代码
    var tempParent = document.createElement('div');
    $.matches = function(element, selector) {
        if (!element || element.nodeType !== 1) return false;
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
            element.oMatchesSelector || element.matchesSelector;
        if (matchesSelector) return matchesSelector.call(element, selector);
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent;
        if (temp) (parent = tempParent).appendChild(element);
        match = ~$.qsa(selector,parent).indexOf(element);
        temp && tempParent.removeChild(element);
        return match;
    };

    var filtered=function(nodes, selector) {
        return selector === undefined ? $(nodes) : $(nodes).filter(selector);
    };

    var uniq = function(array){
        return array.filter(function(item, idx){ return array.indexOf(item) == idx });
    };

    var dasherize=function(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
    };

    var camelize = function(str){
        return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' })
    };

    var elementDisplay={};
    var defaultDisplay=function(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName);
            document.body.appendChild(element);
            display = getComputedStyle(element, '').getPropertyValue("display");
            element.parentNode.removeChild(element);
            display == "none" && (display = "block");
            elementDisplay[nodeName] = display;
        }
        return elementDisplay[nodeName];
    };

    var cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 };
    var maybeAddPx=function(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value;
    };

    var  funcArg=function(context, arg, idx, payload) {
        return $.isFunction(arg) ? arg.call(context, idx, payload) : arg;
    };

    var classCache={};
    var classRE=function(name) {
        return name in classCache ?
            classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
    };

    var classList,key;

    /**
     * $.fn
     */
    $.fn = {
        forEach: [].forEach,
        reduce: [].reduce,
        push: [].push,
        indexOf: [].indexOf,
        concat: [].concat,
        map: function(fn){
            return $.map(this, function(el, i){ return fn.call(el, i, el) })
        },
        each: function(callback) {
            [].every.call(this, function(el, idx) {
                return callback.call(el, idx, el) !== false;
            });
            return this;
        },
        slice: function(){
            return $($.slice.apply(this, arguments));
        },
        get: function(idx){
            return idx === undefined ? $.slice.call(this) : this[idx];
        },
        toArray: function(){ return this.get() },
        remove: function(){
            return this.each(function(){
                if (this.parentNode != null)
                    this.parentNode.removeChild(this);
            });
        },
        size:function(){
            return this.length;
        },
        filter: function(selector){
            return $($.filter.call(this, function(element){
                return $.matches(element, selector);
            }));
        },
        is: function(selector){
            return this.length > 0 && $.matches(this[0], selector)
        },
        not: function(selector){
            var nodes=[];
            if ($.isFunction(selector) && selector.call !== undefined)
                this.each(function(idx){
                    if (!selector.call(this,idx)) nodes.push(this);
                });
            else {
                var excludes = typeof selector == 'string' ? this.filter(selector) :
                    (likeArray(selector) && $.isFunction(selector.item)) ? $.slice.call(selector) : $(selector);
                this.forEach(function(el){
                    if (excludes.indexOf(el) < 0) nodes.push(el);
                });
            }
            return $(nodes);
        },
        eq: function(idx){
            return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
        },
        first: function(){
            var el = this[0];
            return el && !$.isObject(el) ? el : $(el)
        },
        last: function(){
            var el = this[this.length - 1];
            return el && !$.isObject(el) ? el : $(el);
        },
        find: function(selector){
            var result;
            if (this.length == 1) result = $.qsa(selector,this[0]);
            else result = this.map(function(){ return $.qsa(selector,this) });
            return $(result);
        },
        closest: function(selector, context){
            var node = this[0];
            while (node && !$.matches(node, selector))
                node = node !== context && node !== document && node.parentNode;
            return $(node);
        },
        parents: function(selector){
            var ancestors = [], nodes = this;
            while (nodes.length > 0)
                nodes = $.map(nodes, function(node){
                    if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
                        ancestors.push(node);
                        return node;
                    }
                })
            return filtered(ancestors, selector);
        },
        parent: function(selector){
            return filtered(uniq(this.pluck('parentNode')), selector);
        },
        children: function(selector){
            return filtered(this.map(function(){ return $.slice.call(this.children) }), selector);
        },
        siblings: function(selector){
            return filtered(this.map(function(i, el){
                return $.slice.call(el.parentNode.children).filter(function(child){ return child!==el });
            }), selector);
        },
        empty: function(){
            return this.each(function(){ this.innerHTML = '' });
        },
        pluck: function(property){
            return this.map(function(){ return this[property] });
        },
        show: function(){
            return this.each(function(){
                this.style.display == "none" && (this.style.display = null);
                if (getComputedStyle(this, '').getPropertyValue("display") == "none")
                    this.style.display = defaultDisplay(this.nodeName);
            });
        },
        hide: function(){
            return this.css("display", "none");
        },
        toggle: function(setting){
            return (setting === undefined ? this.css("display") == "none" : setting) ? this.show() : this.hide()
        },
        css: function(property, value){
            if (value === undefined && typeof property == 'string')
                return (
                    this.length == 0
                        ? undefined
                        : this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property));

            var css = '';
            for (key in property)
                if(typeof property[key] == 'string' && property[key] == '')
                    this.each(function(){ this.style.removeProperty(dasherize(key)) });
                else
                    css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';

            if (typeof property == 'string')
                if (value == '')
                    this.each(function(){ this.style.removeProperty(dasherize(property)) });
                else
                    css = dasherize(property) + ":" + maybeAddPx(property, value);
            return this.each(function(){ this.style.cssText += ';' + css });
        },
        replaceWith: function(newContent){
            return this.before(newContent).remove();
        },
        wrap: function(newContent){
            return this.each(function(){
                $(this).wrapAll($(newContent)[0].cloneNode(false));
            })
        },
        wrapAll: function(newContent){
            if (this[0]) {
                $(this[0]).before(newContent = $(newContent));
                newContent.append(this);
            }
            return this;
        },
        unwrap: function(){
            this.parent().each(function(){
                $(this).replaceWith($(this).children());
            });
            return this;
        },
        clone: function(){
            return $(this.map(function(){ return this.cloneNode(true) }));
        },
        prev: function(){ return $(this.pluck('previousElementSibling')) },
        next: function(){ return $(this.pluck('nextElementSibling')) },
        html: function(html){
            return html === undefined ?
                (this.length > 0 ? this[0].innerHTML : null) :
                this.each(function(idx){
                    var originHtml = this.innerHTML;
                    $(this).empty().append( funcArg(this, html, idx, originHtml) );
                });
        },
        text: function(text){
            return text === undefined ?
                (this.length > 0 ? this[0].textContent : null) :
                this.each(function(){ this.textContent = text });
        },
        attr: function(name, value){
            var result
            return (typeof name == 'string' && value === undefined) ?
                (this.length == 0 || this[0].nodeType !== 1 ? undefined :
                        (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
                            (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
                ) :
                this.each(function(idx){
                    if (this.nodeType !== 1) return;
                    if ($.isObject(name)) for (key in name) this.setAttribute(key, name[key]);
                    else this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)));
                })
        },
        removeAttr: function(name){
            return this.each(function(){ if (this.nodeType === 1) this.removeAttribute(name) });
        },
        prop: function(name, value){
            return (value === undefined) ?
                (this[0] ? this[0][name] : undefined) :
                this.each(function(idx){
                    this[name] = funcArg(this, value, idx, this[name])
                });
        },
        data: function(name, value){
            var data = this.attr('data-' + dasherize(name), value);
            return data !== null ? data : undefined;
        },
        val: function(value){
            return (value === undefined) ?
                (this.length > 0 ? this[0].value : undefined) :
                this.each(function(idx){
                    this.value = funcArg(this, value, idx, this.value)
                });
        },
        offset: function(){
            if (this.length==0) return null;
            var obj = this[0].getBoundingClientRect();
            return {
                left: obj.left + window.pageXOffset,
                top: obj.top + window.pageYOffset,
                width: obj.width,
                height: obj.height
            };
        },
        index: function(element){
            return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
        },
        hasClass: function(name){
            if (this.length < 1) return false;
            else return classRE(name).test(this[0].className);
        },
        addClass: function(name){
            return this.each(function(idx){
                classList = [];
                var cls = this.className, newName = funcArg(this, name, idx, cls)
                newName.split(/\s+/g).forEach(function(klass){
                    if (!$(this).hasClass(klass)) classList.push(klass)
                }, this);
                classList.length && (this.className += (cls ? " " : "") + classList.join(" "));
            });
        },
        removeClass: function(name){
            return this.each(function(idx){
                if (name === undefined)
                    return this.className = '';
                classList = this.className;
                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
                    classList = classList.replace(classRE(klass), " ");
                });
                this.className = classList.trim();
            });
        },
        toggleClass: function(name, when){
            return this.each(function(idx){
                var newName = funcArg(this, name, idx, this.className);
                (when === undefined ? !$(this).hasClass(newName) : when) ?
                    $(this).addClass(newName) : $(this).removeClass(newName)
            });
        },
        submit:function (callback) {
            if (callback) this.bind('submit', callback);
            else if (this.length) {
                var event = $.Event('submit');
                this.eq(0).trigger(event);
                if (!event.defaultPrevented) this.get(0).submit()
            }
            return this
        },
        fadeIn:function(still,opa,skip){
            var ele = this;
            ele.css({
//                "display":"block",
                "opacity":0
            });
            ele.show();
            var count = 1/(skip||0.05);
            var speed = still/count,
                tempOpa = 0,
                endOpa = opa || 1;
            (function(){
            	tempOpa += skip||0.05;
                ele.css({"opacity":tempOpa});
                if(tempOpa<=endOpa){
//                    console.log("1");
                    setTimeout(arguments.callee,speed);
                }
            })();
        },
        fadeOut:function(still,opa,skip){
            var ele = this;
//            ele.css({
//                "display":"block",
//                "opacity":1
//            });
            ele.show();
            var count = 1/(skip||0.05);
            var speed = still/count,
                tempOpa = opa || 1;
            (function(){
            	tempOpa -= skip||0.05;
                ele.css({"opacity":tempOpa});
                if(tempOpa>=0){
//                    console.log(1);
                    setTimeout(arguments.callee,speed);
                }else{
                    ele.hide();
                }
            })()
        }
    };

    // Generate the `width` and `height` functions
    ['width', 'height'].forEach(function(dimension){
        $.fn[dimension] = function(value){
            var offset, Dimension = dimension.replace(/./, function(m){ return m[0].toUpperCase() });
            if (value === undefined) return this[0] == window ? window['inner' + Dimension] :
                this[0] == document ? document.documentElement['offset' + Dimension] :
                (offset = this.offset()) && offset[dimension]
            else return this.each(function(idx){
                var el = $(this);
                el.css(dimension, funcArg(this, value, idx, el[dimension]()));
            });
        };
    });

    var table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
            'tr': document.createElement('tbody'),
            'tbody': table, 'thead': table, 'tfoot': table,
            'td': tableRow, 'th': tableRow,
            '*': document.createElement('div')
        };
    // `fragment` takes a html string and an optional tag name
    // to generate DOM nodes nodes from the given html string.
    // The generated DOM nodes are returned as an array.
    // This function can be overriden in plugins for example to make
    // it compatible with browsers that don't support the DOM fully.
    var fragment = function(html, name) {
        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
        if (!(name in containers)) name = '*'
        var container = containers[name]
        container.innerHTML = '' + html;
        return $.each($.slice.call(container.childNodes), function(){
            container.removeChild(this);
        });
    };

    function insert(operator, target, node) {
        var parent = (operator % 2) ? target : target.parentNode
        parent ? parent.insertBefore(node,
            !operator ? target.nextSibling :      // after
                operator == 1 ? parent.firstChild :   // prepend
                    operator == 2 ? target :              // before
                        null) :                               // append
            $(node).remove()
    }

    function traverseNode(node, fun) {
        fun(node)
        for (var key in node.childNodes) traverseNode(node.childNodes[key], fun);
    }


    var adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ];
    // Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
    adjacencyOperators.forEach(function(key, operator) {
        $.fn[key] = function(){
            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
            var nodes = $.map(arguments, function(n){return $.isObject(n) ? n : fragment(n) });
            if (nodes.length < 1) return this;
            var size = this.length, copyByClone = size > 1, inReverse = operator < 2;
            return this.each(function(index, target){
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[inReverse ? nodes.length-i-1 : i];
                    traverseNode(node, function(node){
                        if (node.nodeName != null && node.nodeName.toUpperCase() === 'SCRIPT' && (!node.type || node.type === 'text/javascript'))
                            window['eval'].call(window, node.innerHTML);
                    });
                    if (copyByClone && index < size - 1) node = node.cloneNode(true);
                    insert(operator, target, node);
                }
            })
        }

        $.fn[(operator % 2) ? key+'To' : 'insert'+(operator ? 'Before' : 'After')] = function(html){
            $(html)[key](this);
            return this;
        }
    });


    /**
     * 兼容 AMD 模块
     **/
    if (typeof define === 'function' && define.amd) {
        define('ryui', [], function() {
            return $;
        });
    }

    return $;
})(document);
// If `$` is not yet defined, point it to `ryui`
window.ryui = ryui;
'$' in window || (window.$ = ryui);
/**
 * $.os
 * @param {type} $
 * @returns {undefined}
 */
(function($, window) {
    function detect(ua) {
        this.os = {};
        var funcs = [

            function() { //wechat
                var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
                if (wechat) { //wechat
                    this.os.wechat = {
                        version: wechat[2].replace(/_/g, '.')
                    };
                }
                return false;
            },
            function() { //android
                var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
                if (android) {
                    this.os.android = true;
                    this.os.version = android[2];

                    this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
                }
                return this.os.android === true;
            },
            function() { //ios
                var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
                if (iphone) { //iphone
                    this.os.ios = this.os.iphone = true;
                    this.os.version = iphone[2].replace(/_/g, '.');
                } else {
                    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
                    if (ipad) { //ipad
                        this.os.ios = this.os.ipad = true;
                        this.os.version = ipad[2].replace(/_/g, '.');
                    }
                }
                return this.os.ios === true;
            }
        ];
        [].every.call(funcs, function(func) {
            return !func.call($);
        });
    }
    detect.call($, navigator.userAgent);
})(ryui, window);
/**
 * ryui target(action>popover>modal>tab>toggle)
 */
(function($, window, document) {
    /**
     * targets
     */
    $.targets = {};
    /**
     * target handles
     */
    $.targetHandles = [];
    /**
     * register target
     * @param {type} target
     * @returns {$.targets}
     */
    $.registerTarget = function(target) {

        target.index = target.index || 1000;

        $.targetHandles.push(target);

        $.targetHandles.sort(function(a, b) {
            return a.index - b.index;
        });

        return $.targetHandles;
    };
    //XXX 对于不支持触屏的PC，提供click支持
    var touchSupport = ('ontouchstart' in document);
    var eventName = touchSupport?'touchstart':'mousedown';
    window.addEventListener(eventName, function(event) {
        var target = event.target;
        var founds = {};
        for (; target && target !== document; target = target.parentNode) {
            var isFound = false;
            $.each($.targetHandles, function(index, targetHandle) {
                var name = targetHandle.name;
                if (!isFound && !founds[name] && targetHandle.hasOwnProperty('handle')) {
                    $.targets[name] = targetHandle.handle(event, target);
                    if ($.targets[name]) {
                        founds[name] = true;
                        if (targetHandle.isContinue !== true) {
                            isFound = true;
                        }
                    }
                } else {
                    if (!founds[name]) {
                        if (targetHandle.isReset !== false)
                            $.targets[name] = false;
                    }
                }
            });
            if (isFound) {
                break;
            }
        }

    });
})(ryui, window, document);

/**
 * fixed trim
 * @param {type} undefined
 * @returns {undefined}
 */
(function(undefined) {
    if (String.prototype.trim === undefined) { // fix for iOS 3.2
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
    Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
            obj['__proto__'] = proto;
            return obj;
        };

})();
/**
 * fixed CustomEvent
 */
(function() {
    if (typeof window.CustomEvent === 'undefined') {
        function CustomEvent(event, params) {
            params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
            var evt = document.createEvent('Events');
            var bubbles = true;
            for (var name in params) {
                (name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name]);
            }
            evt.initEvent(event, bubbles, true);
            return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    }
})();
/**
 * ryui fixed classList
 * @param {type} document
 * @returns {undefined}
 */
(function(document) {
    if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {

        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/),
                            index = classes.indexOf(value);

                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    };
                }

                var ret = {
                    add: update(function(classes, index, value) {
                        ~index || classes.push(value);
                    }),
                    remove: update(function(classes, index) {
                        ~index && classes.splice(index, 1);
                    }),
                    toggle: update(function(classes, index, value) {
                        ~index ? classes.splice(index, 1) : classes.push(value);
                    }),
                    contains: function(value) {
                        return !!~self.className.split(/\s+/).indexOf(value);
                    },
                    item: function(i) {
                        return self.className.split(/\s+/)[i] || null;
                    }
                };

                Object.defineProperty(ret, 'length', {
                    get: function() {
                        return self.className.split(/\s+/).length;
                    }
                });

                return ret;
            }
        });
    }
})(document);

/**
 * ryui fixed requestAnimationFrame
 * @param {type} window
 * @returns {undefined}
 */
(function(window) {
    if (!window.requestAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = window.webkitRequestAnimationFrame || function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || function(id) {
                clearTimeout(id);
            };
    };
}(window));
/**
 * fastclick(only for radio,checkbox)
 */
(function($, window, name) {
    if (window.FastClick) {
        return;
    }
    var touchSupport = ('ontouchstart' in document);
    var handle = function(event, target) {
        if (target.tagName === 'LABEL') {
            if (target.parentNode) {
                target = target.parentNode.querySelector('input');
            }
        }
        if (target && (target.type === 'radio' || target.type === 'checkbox')) {
            if (!target.disabled) { //disabled
                return target;
            }
        }
        return false;
    };

    $.registerTarget({
        name: name,
        index: 40,
        handle: handle,
        target: false
    });
    var dispatchEvent = function(event) {
        var targetElement = $.targets.click;
        if (targetElement) {
            var clickEvent, touch;
            // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect
            if (document.activeElement && document.activeElement !== targetElement) {
                document.activeElement.blur();
            }
            //XXX 对于不支持触屏的PC，提供click支持
            if(!touchSupport)return;
            touch = event.detail.gesture.changedTouches[0];
            // Synthesise a click event, with an extra attribute so it can be tracked
            clickEvent = document.createEvent('MouseEvents');
            clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
            clickEvent.forwardedTouchEvent = true;
            targetElement.dispatchEvent(clickEvent);
            event.detail && event.detail.gesture.preventDefault();
        }
    };
    window.addEventListener('tap', dispatchEvent);
    window.addEventListener('doubletap', dispatchEvent);
    //捕获 click
    //XXX 对于不支持触屏的PC，提供click支持
    if(touchSupport)
        window.addEventListener('click', function(event) {
            if ($.targets.click) {
                if (!event.forwardedTouchEvent) { //stop click
                    if (event.stopImmediatePropagation) {
                        event.stopImmediatePropagation();
                    } else {
                        // Part of the hack for browsers that don't support Event#stopImmediatePropagation
                        event.propagationStopped = true;
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
            }
        }, true);

})(ryui, window, 'click');
/**
 * ryui namespace(optimization)
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    $.namespace = 'ryui';
    $.classNamePrefix = $.namespace + '-';
    $.classSelectorPrefix = '.' + $.classNamePrefix;
    /**
     * 返回正确的className
     * @param {type} className
     * @returns {String}
     */
    $.className = function(className) {
        return $.classNamePrefix + className;
    };
    /**
     * 返回正确的classSelector
     * @param {type} classSelector
     * @returns {String}
     */
    $.classSelector = function(classSelector) {
        return classSelector.replace(/\./g, $.classSelectorPrefix);
    };
    /**
     * 返回正确的eventName
     * @param {type} event
     * @param {type} module
     * @returns {String}
     */
    $.eventName = function(event, module) {
        return event + ($.namespace ? ('.' + $.namespace) : '') + ( module ? ('.' + module) : '');
    };
})(ryui);

/**
 *
 * @module ryui
 * @class event
 * @version 1.0.0
 */
(function($) {
    var handlers = {}, _zid = 1, specialEvents={}

    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

    function zid(element) {
        return element._zid || (element._zid = _zid++)
    }
    function findHandlers(element, event, fn, selector) {
        event = parse(event)
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function(handler) {
            return handler
                && (!event.e  || handler.e == event.e)
                && (!event.ns || matcher.test(handler.ns))
                && (!fn       || zid(handler.fn) === zid(fn))
                && (!selector || handler.sel == selector)
        })
    }
    function parse(event) {
        var parts = ('' + event).split('.')
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
    }
    function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
    }

    function eachEvent(events, fn, iterator){
        if ($.isObject(events)) $.each(events, iterator)
        else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
    }

    function add(element, events, fn, selector, getDelegate, capture){
        capture = !!capture
        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
        eachEvent(events, fn, function(event, fn){
            var delegate = getDelegate && getDelegate(fn, event),
                callback = delegate || fn
            var proxyfn = function (event) {
                var result = callback.apply(element, [event].concat(event.data))
                if (result === false) event.preventDefault()
                return result
            }
            var handler = $.extend(parse(event), {fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length})
            set.push(handler)
            element.addEventListener(handler.e, proxyfn, capture)
        })
    }
    function remove(element, events, fn, selector){
        var id = zid(element)
        eachEvent(events || '', fn, function(event, fn){
            findHandlers(element, event, fn, selector).forEach(function(handler){
                delete handlers[id][handler.i]
                element.removeEventListener(handler.e, handler.proxy, false)
            })
        })
    }

    $.event = { add: add, remove: remove }

    $.proxy = function(fn, context) {
        if ($.isFunction(fn)) {
            var proxyFn = function(){ return fn.apply(context, arguments) }
            proxyFn._zid = zid(fn)
            return proxyFn
        } else if (typeof context == 'string') {
            return $.proxy(fn[context], fn)
        } else {
            throw new TypeError("expected function")
        }
    }

    $.fn.bind = function(event, callback){
        return this.each(function(){
            add(this, event, callback)
        })
    }
    $.fn.unbind = function(event, callback){
        return this.each(function(){
            remove(this, event, callback)
        })
    }
    $.fn.one = function(event, callback){
        return this.each(function(i, element){
            add(this, event, callback, null, function(fn, type){
                return function(){
                    var result = fn.apply(element, arguments)
                    remove(element, type, fn)
                    return result
                }
            })
        })
    }

    var returnTrue = function(){return true},
        returnFalse = function(){return false},
        eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
        }
    function createProxy(event) {
        var proxy = $.extend({originalEvent: event}, event)
        $.each(eventMethods, function(name, predicate) {
            proxy[name] = function(){
                this[predicate] = returnTrue
                return event[name].apply(event, arguments)
            }
            proxy[predicate] = returnFalse
        })
        return proxy
    }

    // emulates the 'defaultPrevented' property for browsers that have none
    function fix(event) {
        if (!('defaultPrevented' in event)) {
            event.defaultPrevented = false
            var prevent = event.preventDefault
            event.preventDefault = function() {
                this.defaultPrevented = true
                prevent.call(this)
            }
        }
    }

    $.fn.delegate = function(selector, event, callback){
        var capture = false
        if(event == 'blur' || event == 'focus'){
            if($.iswebkit)
                event = event == 'blur' ? 'focusout' : event == 'focus' ? 'focusin' : event
            else
                capture = true
        }

        return this.each(function(i, element){
            add(element, event, callback, selector, function(fn){
                return function(e){
                    var evt, match = $(e.target).closest(selector, element).get(0)
                    if (match) {
                        evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
                        return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
                    }
                }
            }, capture)
        })
    }
    $.fn.undelegate = function(selector, event, callback){
        return this.each(function(){
            remove(this, event, callback, selector)
        })
    }

    $.fn.on = function(event, selector, callback){
        return selector == undefined || $.isFunction(selector) ?
            this.bind(event, selector) : this.delegate(selector, event, callback)
    }
    $.fn.off = function(event, selector, callback){
        return selector == undefined || $.isFunction(selector) ?
            this.unbind(event, selector) : this.undelegate(selector, event, callback)
    }

    $.fn.trigger = function(event, data){
        if (typeof event == 'string') event = $.Event(event)
        fix(event)
        event.data = data
        return this.each(function(){
            // items in the collection might not be DOM elements
            // (todo: possibly support events on plain old objects)
            if('dispatchEvent' in this) this.dispatchEvent(event)
        })
    }

    // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble
    $.fn.triggerHandler = function(event, data){
        var e, result
        this.each(function(i, element){
            e = createProxy(typeof event == 'string' ? $.Event(event) : event)
            e.data = data
            e.target = element
            $.each(findHandlers(element, event.type || event), function(i, handler){
                result = handler.proxy(e)
                if (e.isImmediatePropagationStopped()) return false
            })
        })
        return result
    }

        // shortcut methods for `.bind(event, fn)` for each event type
    ;('focusin focusout load resize scroll unload '+
    'change select error tap').split(' ').forEach(function(event) {
        $.fn[event] = function(callback){ return this.bind(event, callback) }
    })

    ;['focus', 'blur'].forEach(function(name) {
        $.fn[name] = function(callback) {
            if (callback) this.bind(name, callback)
            else if (this.length) try { this.get(0)[name]() } catch(e){}
            return this
        }
    })

    $.Event = function(type, props) {
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
        return event
    }
})(ryui);
/**
 * ryui gestures
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {
    $.EVENT_START = 'touchstart';
    $.EVENT_MOVE = 'touchmove';
    $.EVENT_END = 'touchend';
    $.EVENT_CANCEL = 'touchcancel';
    $.EVENT_CLICK = 'click';
    var CLASS_ACTIVE = 'ryui-active';
    $.gestures = {
        session: {}
    };
    /**
     * Gesture preventDefault
     * @param {type} e
     * @returns {undefined}
     */
    $.preventDefault = function(e) {
        e.preventDefault();
    };
    /**
     * Gesture stopPropagation
     * @param {type} e
     * @returns {undefined}
     */
    $.stopPropagation = function(e) {
        e.stopPropagation();
    };

    /**
     * register gesture
     * @param {type} gesture
     * @returns {$.gestures}
     */
    $.addGesture = function(gesture) {
        return $.addAction('gestures', gesture);

    };

    var round = Math.round;
    var abs = Math.abs;
    var sqrt = Math.sqrt;
    var atan = Math.atan;
    var atan2 = Math.atan2;
    /**
     * distance
     * @param {type} p1
     * @param {type} p2
     * @returns {Number}
     */
    var getDistance = function(p1, p2, props) {
        if (!props) {
            props = ['x', 'y'];
        }
        var x = p2[props[0]] - p1[props[0]];
        var y = p2[props[1]] - p1[props[1]];
        return sqrt((x * x) + (y * y));
    };
    /**
     * scale
     * @param {Object} starts
     * @param {Object} moves
     */
    var getScale = function(starts, moves) {
        if (starts.length >= 2 && moves.length >= 2) {
            var props = ['pageX', 'pageY'];
            return getDistance(moves[1], moves[0], props) / getDistance(starts[1], starts[0], props);
        }
        return 1;
    };
    /**
     * angle
     * @param {type} p1
     * @param {type} p2
     * @returns {Number}
     */
    var getAngle = function(p1, p2, props) {
        if (!props) {
            props = ['x', 'y'];
        }
        var x = p2[props[0]] - p1[props[0]];
        var y = p2[props[1]] - p1[props[1]];
        return atan2(y, x) * 180 / Math.PI;
    };
    /**
     * direction
     * @param {Object} x
     * @param {Object} y
     */
    var getDirection = function(x, y) {
        if (x === y) {
            return '';
        }
        if (abs(x) >= abs(y)) {
            return x > 0 ? 'left' : 'right';
        }
        return y > 0 ? 'up' : 'down';
    };
    /**
     * rotation
     * @param {Object} start
     * @param {Object} end
     */
    var getRotation = function(start, end) {
        var props = ['pageX', 'pageY'];
        return getAngle(end[1], end[0], props) - getAngle(start[1], start[0], props);
    };
    /**
     * px per ms
     * @param {Object} deltaTime
     * @param {Object} x
     * @param {Object} y
     */
    var getVelocity = function(deltaTime, x, y) {
        return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
        };
    };
    /**
     * detect gestures
     * @param {type} event
     * @param {type} touch
     * @returns {undefined}
     */
    var detect = function(event, touch) {
        if ($.gestures.stoped) {
            return;
        }
        $.doAction('gestures', function(index, gesture) {
            if (!$.gestures.stoped) {
                if ($.options.gestureConfig[gesture.name] !== false) {
                    gesture.handle(event, touch);
                }
            }
        });
    };
    /**
     * 暂时无用
     * @param {Object} node
     * @param {Object} parent
     */
    var hasParent = function(node, parent) {
        while (node) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };

    var uniqueArray = function(src, key, sort) {
        var results = [];
        var values = [];
        var i = 0;

        while (i < src.length) {
            var val = key ? src[i][key] : src[i];
            if (values.indexOf(val) < 0) {
                results.push(src[i]);
            }
            values[i] = val;
            i++;
        }

        if (sort) {
            if (!key) {
                results = results.sort();
            } else {
                results = results.sort(function sortUniqueArray(a, b) {
                    return a[key] > b[key];
                });
            }
        }

        return results;
    };
    var getMultiCenter = function(touches) {
        var touchesLength = touches.length;
        if (touchesLength === 1) {
            return {
                x: round(touches[0].pageX),
                y: round(touches[0].pageY)
            };
        }

        var x = 0;
        var y = 0;
        var i = 0;
        while (i < touchesLength) {
            x += touches[i].pageX;
            y += touches[i].pageY;
            i++;
        }

        return {
            x: round(x / touchesLength),
            y: round(y / touchesLength)
        };
    };
    var multiTouch = function() {
        return $.options.gestureConfig.pinch;
    };
    var copySimpleTouchData = function(touch) {
        var touches = [];
        var i = 0;
        while (i < touch.touches.length) {
            touches[i] = {
                pageX: round(touch.touches[i].pageX),
                pageY: round(touch.touches[i].pageY)
            };
            i++;
        }
        return {
            timestamp: $.now(),
            gesture: touch.gesture,
            touches: touches,
            center: getMultiCenter(touch.touches),
            deltaX: touch.deltaX,
            deltaY: touch.deltaY
        };
    };

    var calDelta = function(touch) {
        var session = $.gestures.session;
        var center = touch.center;
        var offset = session.offsetDelta || {};
        var prevDelta = session.prevDelta || {};
        var prevTouch = session.prevTouch || {};

        if (touch.gesture.type === $.EVENT_START || touch.gesture.type === $.EVENT_END) {
            prevDelta = session.prevDelta = {
                x: prevTouch.deltaX || 0,
                y: prevTouch.deltaY || 0
            };

            offset = session.offsetDelta = {
                x: center.x,
                y: center.y
            };
        }
        touch.deltaX = prevDelta.x + (center.x - offset.x);
        touch.deltaY = prevDelta.y + (center.y - offset.y);
    };
    var calTouchData = function(touch) {
        var session = $.gestures.session;
        var touches = touch.touches;
        var touchesLength = touches.length;

        if (!session.firstTouch) {
            session.firstTouch = copySimpleTouchData(touch);
        }

        if (multiTouch() && touchesLength > 1 && !session.firstMultiTouch) {
            session.firstMultiTouch = copySimpleTouchData(touch);
        } else if (touchesLength === 1) {
            session.firstMultiTouch = false;
        }

        var firstTouch = session.firstTouch;
        var firstMultiTouch = session.firstMultiTouch;
        var offsetCenter = firstMultiTouch ? firstMultiTouch.center : firstTouch.center;

        var center = touch.center = getMultiCenter(touches);
        touch.timestamp = $.now();
        touch.deltaTime = touch.timestamp - firstTouch.timestamp;

        touch.angle = getAngle(offsetCenter, center);
        touch.distance = getDistance(offsetCenter, center);

        calDelta(touch);

        touch.offsetDirection = getDirection(touch.deltaX, touch.deltaY);

        touch.scale = firstMultiTouch ? getScale(firstMultiTouch.touches, touches) : 1;
        touch.rotation = firstMultiTouch ? getRotation(firstMultiTouch.touches, touches) : 0;

        calIntervalTouchData(touch);

    };
    var CAL_INTERVAL = 25;
    var calIntervalTouchData = function(touch) {
        var session = $.gestures.session;
        var last = session.lastInterval || touch;
        var deltaTime = touch.timestamp - last.timestamp;
        var velocity;
        var velocityX;
        var velocityY;
        var direction;

        if (touch.gesture.type != $.EVENT_CANCEL && (deltaTime > CAL_INTERVAL || last.velocity === undefined)) {
            var deltaX = last.deltaX - touch.deltaX;
            var deltaY = last.deltaY - touch.deltaY;

            var v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY) || last.direction;

            session.lastInterval = touch;
        } else {
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
        }

        touch.velocity = velocity;
        touch.velocityX = velocityX;
        touch.velocityY = velocityY;
        touch.direction = direction;
    };
    var targetIds = {};
    var getTouches = function(event, touch) {
        var allTouches = $.slice.call(event.touches || event);

        var type = event.type;

        var targetTouches = [];
        var changedTargetTouches = [];
        if(type === $.EVENT_START){
            event.target.classList.add(CLASS_ACTIVE);
            if($.options.gestureConfig.rippleEffect) rippleEffect(event);
        }
        if(type === $.EVENT_END || type === $.EVENT_CANCEL){
            event.target.classList.remove(CLASS_ACTIVE);
        }
        //当touchstart或touchmove且touches长度为1，直接获得all和changed
        if ((type === $.EVENT_START || type === $.EVENT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            targetTouches = allTouches;
            changedTargetTouches = allTouches;
        } else {
            var i = 0;
            var targetTouches = [];
            var changedTargetTouches = [];
            var changedTouches = $.slice.call(event.changedTouches || event);

            touch.target = event.target;
            var sessionTarget = $.gestures.session.target || event.target;
            targetTouches = allTouches.filter(function(touch) {
                return hasParent(touch.target, sessionTarget);
            });

            if (type === $.EVENT_START) {
                i = 0;
                while (i < targetTouches.length) {
                    targetIds[targetTouches[i].identifier] = true;
                    i++;
                }
            }

            i = 0;
            while (i < changedTouches.length) {
                if (targetIds[changedTouches[i].identifier]) {
                    changedTargetTouches.push(changedTouches[i]);
                }
                if (type === $.EVENT_END || type === $.EVENT_CANCEL) {
                    delete targetIds[changedTouches[i].identifier];
                }
                i++;
            }

            if (!changedTargetTouches.length) {
                return false;
            }
        }
        targetTouches = uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true);
        var touchesLength = targetTouches.length;
        var changedTouchesLength = changedTargetTouches.length;

        if (type === $.EVENT_START && touchesLength - changedTouchesLength === 0) { //first
            touch.isFirst = true;
            $.gestures.touch = $.gestures.session = {
                target: event.target
            };
        }
        touch.isFinal = ((type === $.EVENT_END || type === $.EVENT_CANCEL) && (touchesLength - changedTouchesLength === 0));

        touch.touches = targetTouches;
        touch.changedTouches = changedTargetTouches;
        return true;

    };

    var rippleEffect=function(e){
        var target = e.target;
        if (target.tagName.toLowerCase() ==='button'
            || target.classList.contains('ryui-btn') || target.classList.contains('poly-btn')
        ){
            if (target.disabled === true) return;
            var offset = $.offset(target);
            var ripple = document.createElement('div');
            ripple.className = 'ryui-ripple-effect';
            ripple.style.height = ripple.style.width = Math.min(offset.width, offset.height)/2 + 'px';
            var touch = e.targetTouches[0];
            var left = touch.pageX -parseInt(ripple.style.width) / 2 - offset.left;
            var top = touch.pageY -parseInt(ripple.style.height) / 2 - offset.top;
            ripple.style.top = top + 'px';
            ripple.style.left = left + 'px';
            target.appendChild(ripple);
            window.setTimeout(function() {
                target.removeChild(ripple);
            }, 2000);
        }
    };

    var handleTouchEvent = function(event) {
        var touch = {
            gesture: event
        };
        var touches = getTouches(event, touch);
        if (!touches) {
            return;
        }
        calTouchData(touch);
        detect(event, touch);
        $.gestures.session.prevTouch = touch;
    };
    window.addEventListener($.EVENT_START, handleTouchEvent);
    window.addEventListener($.EVENT_MOVE, handleTouchEvent);
    window.addEventListener($.EVENT_END, handleTouchEvent);
    window.addEventListener($.EVENT_CANCEL, handleTouchEvent);
    //fixed hashchange(android)
    window.addEventListener($.EVENT_CLICK, function(e) {
        //TODO 应该判断当前target是不是在targets.popover内部，而不是非要相等
        if (($.targets.popover && e.target === $.targets.popover) || ($.targets.tab) || $.targets.offcanvas || $.targets.modal) {
            e.preventDefault();
        }
        //XXX 对于不支持触屏的PC，提供click支持
        var touchSupport = ('ontouchstart' in document);
        if(!touchSupport){
            $.trigger(e.target, 'tap', {gesture: e});
        }
    }, true);


    //增加原生滚动识别
    $.isScrolling = false;
    var scrollingTimeout = null;
    window.addEventListener('scroll', function() {
        $.isScrolling = true;
        scrollingTimeout && clearTimeout(scrollingTimeout);
        scrollingTimeout = setTimeout(function() {
            $.isScrolling = false;
        }, 250);
    });
})(ryui, window);
/**
 * ryui gesture flick[left|right|up|down]
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
    var flickStartTime = 0;
    var handle = function(event, touch) {
        var session = $.gestures.session;
        var options = this.options;
        var now = $.now();
        switch (event.type) {
            case $.EVENT_MOVE:
                if (now - flickStartTime > 300) {
                    flickStartTime = now;
                    session.flickStart = touch.center;
                }
                break;
            case $.EVENT_END:
            case $.EVENT_CANCEL:
                if (session.flickStart && options.flickMaxTime > (now - flickStartTime) && touch.distance > options.flickMinDistince) {
                    touch.flick = true;
                    touch.flickTime = now - flickStartTime;
                    touch.flickDistanceX = touch.center.x - session.flickStart.x;
                    touch.flickDistanceY = touch.center.y - session.flickStart.y;
                    $.trigger(session.target, name, touch);
                    $.trigger(session.target, name + touch.direction, touch);
                }
                break;
        }

    };
    /**
     * ryui gesture flick
     */
    $.addGesture({
        name: name,
        index: 5,
        handle: handle,
        options: {
            flickMaxTime: 200,
            flickMinDistince: 10
        }
    });
})(ryui, 'flick');
/**
 * ryui gesture swipe[left|right|up|down]
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
    var handle = function(event, touch) {
        var session = $.gestures.session;
        if (event.type === $.EVENT_END || event.type === $.EVENT_CANCEL) {
            var options = this.options;
            //TODO 后续根据velocity计算
            if (touch.direction && options.swipeMaxTime > touch.deltaTime && touch.distance > options.swipeMinDistince) {
                touch.swipe = true;
                $.trigger(session.target, name, touch);
                $.trigger(session.target, name + touch.direction, touch);
            }
        }
    };
    /**
     * ryui gesture swipe
     */
    $.addGesture({
        name: name,
        index: 10,
        handle: handle,
        options: {
            swipeMaxTime: 300,
            swipeMinDistince: 18
        }
    });
})(ryui, 'swipe');
/**
 * ryui gesture drag[start|left|right|up|down|end]
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
    var handle = function(event, touch) {
        var session = $.gestures.session;
        switch (event.type) {
            case $.EVENT_START:
                break;
            case $.EVENT_MOVE:
                if (!touch.direction) {
                    return;
                }
                //修正direction,可在session期间自行锁定拖拽方向，方便开发scroll类不同方向拖拽插件嵌套
                if (session.lockDirection && session.startDirection) {
                    if (session.startDirection && session.startDirection !== touch.direction) {
                        if (session.startDirection === 'up' || session.startDirection === 'down') {
                            touch.direction = touch.deltaY < 0 ? 'up' : 'down';
                        } else {
                            touch.direction = touch.deltaX < 0 ? 'left' : 'right';
                        }
                    }
                }

                if (!session.drag) {
                    session.drag = true;
                    $.trigger(session.target, name + 'start', touch);
                }
                $.trigger(session.target, name, touch);
                $.trigger(session.target, name + touch.direction, touch);
                break;
            case $.EVENT_END:
            case $.EVENT_CANCEL:
                if (session.drag && touch.isFinal) {
                    $.trigger(session.target, name + 'end', touch);
                }
                break;
        }
    };
    /**
     * ryui gesture drag
     */
    $.addGesture({
        name: name,
        index: 20,
        handle: handle,
        options: {
            fingers: 1
        }
    });
})(ryui, 'drag');
/**
 * ryui gesture tap and doubleTap
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
    var lastTarget;
    var lastTapTime;
    var handle = function(event, touch) {
        var session = $.gestures.session;
        var options = this.options;
        switch (event.type) {
            case $.EVENT_END:
                if (!touch.isFinal) {
                    return;
                }
                var target = session.target;
                if (!target || (target.disabled || (target.classList && target.classList.contains('ryui-disabled')))) {
                    return;
                }
                if (touch.distance < options.tapMaxDistance && touch.deltaTime < options.tapMaxTime) {
                    if ($.options.gestureConfig.doubletap && lastTarget && (lastTarget === target)) { //same target
                        if (lastTapTime && (touch.timestamp - lastTapTime) < options.tapMaxInterval) {
                            $.trigger(target, 'doubletap', touch);
                            lastTapTime = $.now();
                            lastTarget = target;
                            return;
                        }
                    }
                    $.trigger(target, name, touch);
                    lastTapTime = $.now();
                    lastTarget = target;
                }
                break;
        }
    };
    /**
     * ryui gesture tap
     */
    $.addGesture({
        name: name,
        index: 30,
        handle: handle,
        options: {
            fingers: 1,
            tapMaxInterval: 300,
            tapMaxDistance: 5,
            tapMaxTime: 250
        }
    });
})(ryui, 'tap');
/**
 * ryui gesture longtap
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
    var timer;
    var handle = function(event, touch) {
        var session = $.gestures.session;
        var options = this.options;
        switch (event.type) {
            case $.EVENT_START:
                clearTimeout(timer);
                timer = setTimeout(function() {
                    $.trigger(session.target, name, touch);
                }, options.holdTimeout);
                break;
            case $.EVENT_MOVE:
                if (touch.distance > options.holdThreshold) {
                    clearTimeout(timer);
                }
                break;
            case $.EVENT_END:
            case $.EVENT_CANCEL:
                clearTimeout(timer);
                break;
        }
    };
    /**
     * ryui gesture longtap
     */
    $.addGesture({
        name: name,
        index: 10,
        handle: handle,
        options: {
            fingers: 1,
            holdTimeout: 500,
            holdThreshold: 2
        }
    });
})(ryui, 'longtap');
/**
 * ryui gesture hold
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
    var timer;
    var handle = function(event, touch) {
        var session = $.gestures.session;
        var options = this.options;
        switch (event.type) {
            case $.EVENT_START:
                if ($.options.gestureConfig.hold) {
                    timer && clearTimeout(timer);
                    timer = setTimeout(function() {
                        touch.hold = true;
                        $.trigger(session.target, name, touch);
                    }, options.holdTimeout);
                }
                break;
            case $.EVENT_MOVE:
                break;
            case $.EVENT_END:
            case $.EVENT_CANCEL:
                if (timer) {
                    clearTimeout(timer) && (timer = null);
                    $.trigger(session.target, 'release', touch);
                }
                break;
        }
    };
    /**
     * ryui gesture hold
     */
    $.addGesture({
        name: name,
        index: 10,
        handle: handle,
        options: {
            fingers: 1,
            holdTimeout: 0
        }
    });
})(ryui, 'hold');
/**
 * ryui gesture pinch
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
    var handle = function(event, touch) {
        var options = this.options;
        var session = $.gestures.session;
        switch (event.type) {
            case $.EVENT_START:
                break;
            case $.EVENT_MOVE:
                if ($.options.gestureConfig.pinch) {
                    if (touch.touches.length < 2) {
                        return;
                    }
                    if (!session.pinch) { //start
                        session.pinch = true;
                        $.trigger(session.target, name + 'start', touch);
                    }
                    $.trigger(session.target, name, touch);
                    var scale = touch.scale;
                    var rotation = touch.rotation;
                    var lastScale = typeof touch.lastScale === 'undefined' ? 1 : touch.lastScale;
                    var scaleDiff = 0.000000000001; //防止scale与lastScale相等，不触发事件的情况。
                    if (scale > lastScale) { //out
                        lastScale = scale - scaleDiff;
                        $.trigger(session.target, name + 'out', touch);
                    } //in
                    else if (scale < lastScale) {
                        lastScale = scale + scaleDiff;
                        $.trigger(session.target, name + 'in', touch);
                    }
                    if (Math.abs(rotation) > options.minRotationAngle) {
                        $.trigger(session.target, 'rotate', touch);
                    }
                }
                break;
            case $.EVENT_END:
            case $.EVENT_CANCEL:
                if ($.options.gestureConfig.pinch && session.pinch && touch.touches.length === 2) {
                    $.trigger(session.target, name + 'end', touch);
                }
                break;
        }
    };
    /**
     * ryui gesture pinch
     */
    $.addGesture({
        name: name,
        index: 10,
        handle: handle,
        options: {
            minRotationAngle: 0
        }
    });
})(ryui, 'pinch');
/**
 * ryui.init
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    $.global = $.options = {
        gestureConfig: {
            tap: true,
            doubletap: false,
            longtap: true,
            hold: false,
            flick: true,
            swipe: true,
            drag: true,
            pinch: false,
            rippleEffect:true
        }
    };
    /**
     *
     * @param {type} options
     * @returns {undefined}
     */
    $.initGlobal = function(options) {
        $.options = $.extend(true, $.global, options);
        return this;
    };
    var inits = {};

    var isInitialized = false;
    //TODO 自动调用init?因为用户自己调用init的时机可能不确定，如果晚于自动init，则会有潜在问题
    //	$.ready(function() {
    //		setTimeout(function() {
    //			if (!isInitialized) {
    //				$.init();
    //			}
    //		}, 300);
    //	});

    /**
     * 单页配置 初始化
     * @method init
     * @param  {object} options 初始化参数
     */
    $.init = function(options) {
        isInitialized = true;
        $.options = $.extend(true, $.global, options || {});
        $.ready(function() {
            $.doAction('inits', function(index, init) {
                var isInit = !!(!inits[init.name] || init.repeat);
                if (isInit) {
                    init.handle.call($);
                    inits[init.name] = true;
                }
            });
        });
        return this;
    };

    /**
     * 增加初始化执行流程
     * @param {function} init
     */
    $.addInit = function(init) {
        return $.addAction('inits', init);
    };
    $(function() {
        var classList = document.body.classList;
        var os = [];
        if ($.os.ios) {
            os.push({
                os: 'ios',
                version: $.os.version
            });
            classList.add('ryui-ios');
        } else if ($.os.android) {
            os.push({
                os: 'android',
                version: $.os.version
            });
            classList.add('ryui-android');
        }
        if ($.os.wechat) {
            os.push({
                os: 'wechat',
                version: $.os.wechat.version
            });
            classList.add('ryui-wechat');
        }
        if (os.length) {
            $.each(os, function(index, osObj) {
                var version = '';
                var classArray = [];
                if (osObj.version) {
                    $.each(osObj.version.split('.'), function(i, v) {
                        version = version + (version ? '-' : '') + v;
                        classList.add($.className(osObj.os + '-' + version));
                    });
                }
            });
        }
    });
})(ryui);
/**
 *
 * @module ryui
 * @class ajax
 * @version 1.0.0
 *
 */
(function($, window, undefined) {

    var jsonType = 'application/json';
    var htmlType = 'text/html';
    var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var scriptTypeRE = /^(?:text|application)\/javascript/i;
    var xmlTypeRE = /^(?:text|application)\/xml/i;
    var blankRE = /^\s*$/;

    $.ajaxSettings = {
        type: 'GET',
        beforeSend: $.noop,
        success: $.noop,
        error: $.noop,
        complete: $.noop,
        context: null,
        xhr: function(protocol) {
            return new window.XMLHttpRequest();
        },
        accepts: {
            script: 'text/javascript, application/javascript, application/x-javascript',
            json: jsonType,
            xml: 'application/xml, text/xml',
            html: htmlType,
            text: 'text/plain'
        },
        timeout: 0,
        processData: true,
        cache: true
    };
    var ajaxBeforeSend = function(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false) {
            return false;
        }
    };
    var ajaxSuccess = function(data, xhr, settings) {
        settings.success.call(settings.context, data, 'success', xhr);
        ajaxComplete('success', xhr, settings);
    };
    // type: "timeout", "error", "abort", "parsererror"
    var ajaxError = function(error, type, xhr, settings) {
        settings.error.call(settings.context, xhr, type, error);
        ajaxComplete(type, xhr, settings);
    };
    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
    var ajaxComplete = function(status, xhr, settings) {
        settings.complete.call(settings.context, xhr, status);
    };

    var serialize = function(params, obj, traditional, scope) {
        var type, array = $.isArray(obj),
            hash = $.isPlainObject(obj);
        $.each(obj, function(key, value) {
            type = $.type(value);
            if (scope) {
                key = traditional ? scope :
                scope + '[' + (hash || type === 'object' || type === 'array' ? key : '') + ']';
            }
            // handle data in serializeArray() format
            if (!scope && array) {
                params.add(value.name, value.value);
            }
            // recurse into nested objects
            else if (type === "array" || (!traditional && type === "object")) {
                serialize(params, value, traditional, key);
            } else {
                params.add(key, value);
            }
        });
    };
    var serializeData = function(options) {
        if (options.processData && options.data && typeof options.data !== "string") {
            options.data = $.param(options.data, options.traditional);
        }
        if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
            options.url = appendQuery(options.url, options.data);
            options.data = undefined;
        }
    };
    var appendQuery = function(url, query) {
        if (query === '') {
            return url;
        }
        return (url + '&' + query).replace(/[&?]{1,2}/, '?');
    };
    var mimeToDataType = function(mime) {
        if (mime) {
            mime = mime.split(';', 2)[0];
        }
        return mime && (mime === htmlType ? 'html' :
                mime === jsonType ? 'json' :
                    scriptTypeRE.test(mime) ? 'script' :
                    xmlTypeRE.test(mime) && 'xml') || 'text';
    };
    var parseArguments = function(url, data, success, dataType) {
        if ($.isFunction(data)) {
            dataType = success, success = data, data = undefined;
        }
        if (!$.isFunction(success)) {
            dataType = success, success = undefined;
        }
        return {
            url: url,
            data: data,
            success: success,
            dataType: dataType
        };
    };
    $.ajax = function(url, options) {
        if (typeof url === "object") {
            options = url;
            url = undefined;
        }
        var settings = options || {};
        settings.url = url || settings.url;
        for (var key in $.ajaxSettings) {
            if (settings[key] === undefined) {
                settings[key] = $.ajaxSettings[key];
            }
        }
        settings.crossDomain=false;
        if($.devMode) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host;
        serializeData(settings);
        var dataType = settings.dataType;

        if (settings.cache === false || ((!options || options.cache !== true) && ('script' === dataType))) {
            settings.url = appendQuery(settings.url, '_=' + $.now());
        }
        var mime = settings.accepts[dataType];
        var headers = {};
        var setHeader = function(name, value) {
            headers[name.toLowerCase()] = [name, value];
        };
        var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
        var xhr = settings.xhr(settings);
        var nativeSetHeader = xhr.setRequestHeader;
        var abortTimeout;
        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest');
        setHeader('Accept', mime || '*/*');
        if (!!(mime = settings.mimeType || mime)) {
            if (mime.indexOf(',') > -1) {
                mime = mime.split(',', 2)[0];
            }
            xhr.overrideMimeType && xhr.overrideMimeType(mime);
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() !== 'GET')) {
            setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
        }
        if (settings.headers) {
            for (var name in settings.headers)
                setHeader(name, settings.headers[name]);
        }
        xhr.setRequestHeader = setHeader;

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                xhr.onreadystatechange = $.noop;
                clearTimeout(abortTimeout);
                var result, error = false;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && protocol === 'file:')) {
                    dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
                    result = xhr.responseText;
                    try {
                        // http://perfectionkills.com/global-eval-what-are-the-options/
                        if (dataType === 'script') {
                            (1, eval)(result);
                        } else if (dataType === 'xml') {
                            result = xhr.responseXML;
                        } else if (dataType === 'json') {
                            result = blankRE.test(result) ? null : $.parseJSON(result);
                        }
                    } catch (e) {
                        error = e;
                    }

                    if (error) {
                        ajaxError(error, 'parsererror', xhr, settings);
                    } else {
                        ajaxSuccess(result, xhr, settings);
                    }
                } else {
                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings);
                }
            }
        };
        if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.abort();
            ajaxError(null, 'abort', xhr, settings);
            return xhr;
        }

        if (settings.xhrFields) {
            for (var name in settings.xhrFields) {
                xhr[name] = settings.xhrFields[name];
            }
        }

        var async = 'async' in settings ? settings.async : true;

        xhr.open(settings.type.toUpperCase(), settings.url, async, settings.username, settings.password);

        for (var name in headers) {
            nativeSetHeader.apply(xhr, headers[name]);
        }
        if (settings.timeout > 0) {
            abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = $.noop;
                xhr.abort();
                ajaxError(null, 'timeout', xhr, settings);
            }, settings.timeout);
        }
        xhr.send(settings.data ? settings.data : null);
        return xhr;
    };


    $.param = function(obj, traditional) {
        var params = [];
        params.add = function(k, v) {
            this.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        };
        serialize(params, obj, traditional);
        return params.join('&').replace(/%20/g, '+');
    };
    $.get = function( /* url, data, success, dataType */ ) {
        return $.ajax(parseArguments.apply(null, arguments));
    };

    $.post = function( /* url, data, success, dataType */ ) {
        var options = parseArguments.apply(null, arguments);
        options.type = 'POST';
        return $.ajax(options);
    };

    $.getJSON = function( /* url, data, success */ ) {
        var options = parseArguments.apply(null, arguments);
        options.dataType = 'json';
        return $.ajax(options);
    };

    $.fn.load = function(url, data, success) {
        if (!this.length)
            return this;
        var self = this,
            parts = url.split(/\s/),
            selector,
            options = parseArguments(url, data, success),
            callback = options.success;
        if (parts.length > 1)
            options.url = parts[0], selector = parts[1];
        options.success = function(response) {
            if (selector) {
                var div = document.createElement('div');
                div.innerHTML = response.replace(rscript, "");
                var selectorDiv = document.createElement('div');
                var childs = div.querySelectorAll(selector);
                if (childs && childs.length > 0) {
                    for (var i = 0, len = childs.length; i < len; i++) {
                        selectorDiv.appendChild(childs[i]);
                    }
                }
                self[0].innerHTML = selectorDiv.innerHTML;
            } else {
                self[0].innerHTML = response;
            }
            callback && callback.apply(self, arguments);
        };
        $.ajax(options);
        return this;
    };
})(ryui, window);
/**
 * ryui layout(offset[,position,width,height...])
 * @param {type} $
 * @param {type} window
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, undefined) {
    $.offset = function(element) {
        var box = {
            top : 0,
            left : 0,
            width : 0,
            height : 0
        };
        if ( typeof element.getBoundingClientRect !== undefined) {
            box = element.getBoundingClientRect();
        }
        return {
            top : box.top + window.pageYOffset - element.clientTop,
            left : box.left + window.pageXOffset - element.clientLeft,
            width : box.width,
            height : box.height
        };
    };

})(ryui, window);
/**
 *
 * @module ryui
 * @class animation
 * @version 1.0.0
 *
 */
(function($, window) {
    /**
     * scrollTo
     */
    $.scrollTo = function(scrollTop, duration, callback) {
        duration = duration || 1000;
        var scroll = function(duration) {
            if (duration <= 0) {
                window.scrollTo(0, scrollTop);
                callback && callback();
                return;
            }
            var distaince = scrollTop - window.scrollY;
            setTimeout(function() {
                window.scrollTo(0, window.scrollY + distaince / duration * 10);
                scroll(duration - 10);
            }, 16.7);
        };
        scroll(duration);
    };
    $.animationFrame = function(cb) {
        var args, isQueued, context;
        return function() {
            args = arguments;
            context = this;
            if (!isQueued) {
                isQueued = true;
                requestAnimationFrame(function() {
                    cb.apply(context, args);
                    isQueued = false;
                });
            }
        };
    };

})(ryui, window);
(function($) {
    var initializing = false,
        fnTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;

    var Class = function() {};
    Class.extend = function(prop) {
        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;
        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn) {
                    return function() {
                        var tmp = this._super;

                        this._super = _super[name];

                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }
        function Class() {
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
        return Class;
    };
    $.Class = Class;
})(ryui);
(function($, window, document, undefined) {
    var CLASS_SCROLLBAR = 'ryui-scrollbar';
    var CLASS_INDICATOR = 'ryui-scrollbar-indicator';
    var CLASS_SCROLLBAR_VERTICAL = CLASS_SCROLLBAR + '-vertical';
    var CLASS_SCROLLBAR_HORIZONTAL = CLASS_SCROLLBAR + '-horizontal';

    var CLASS_ACTIVE = 'ryui-active';

    var ease = {
        quadratic: {
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function(k) {
                return k * (2 - k);
            }
        },
        circular: {
            style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
            fn: function(k) {
                return Math.sqrt(1 - (--k * k));
            }
        }
    }
    var Scroll = $.Class.extend({
        init: function(element, options) {
            this.wrapper = this.element = element;
            this.scroller = this.wrapper.children[0];
            this.scrollerStyle = this.scroller && this.scroller.style;
            this.stopped = false;

            this.options = $.extend(true, {
                scrollY: true,//是否竖向滚动
                scrollX: false,//是否横向滚动
                startX: 0,//初始化时滚动至x
                startY: 0,//初始化时滚动至y
                indicators: true,//是否显示滚动条
                stopPropagation: false,
                hardwareAccelerated: true,
                fixedBadAndorid: false,
                preventDefaultException: {
                    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
                },
                momentum: true,

                snap: false,//图片轮播，拖拽式选项卡

                bounce: true,//是否启用回弹
                bounceTime: 300,//回弹动画时间
                bounceEasing: ease.circular.style,//回弹动画曲线

                directionLockThreshold: 5,

                parallaxElement: false,//视差元素
                parallaxRatio: 0.5
            }, options);

            this.x = 0;
            this.y = 0;
            this.translateZ = this.options.hardwareAccelerated ? ' translateZ(0)' : '';

            this._init();
            if (this.scroller) {
                this.refresh();
                //				if (this.options.startX !== 0 || this.options.startY !== 0) { //需要判断吗？后续根据实际情况再看看
                this.scrollTo(this.options.startX, this.options.startY);
                //				}
            }
        },
        _init: function() {
            this._initParallax();
            this._initIndicators();
            this._initEvent();
        },
        _initParallax: function() {
            if (this.options.parallaxElement) {
                this.parallaxElement = document.querySelector(this.options.parallaxElement);
                this.parallaxStyle = this.parallaxElement.style;
                this.parallaxHeight = this.parallaxElement.offsetHeight;
                this.parallaxImgStyle = this.parallaxElement.querySelector('img').style;
            }
        },
        _initIndicators: function() {
            var self = this;
            self.indicators = [];
            if (!this.options.indicators) {
                return;
            }
            var indicators = [],
                indicator;

            // Vertical scrollbar
            if (self.options.scrollY) {
                indicator = {
                    el: this._createScrollBar(CLASS_SCROLLBAR_VERTICAL),
                    listenX: false
                };

                this.wrapper.appendChild(indicator.el);
                indicators.push(indicator);
            }

            // Horizontal scrollbar
            if (this.options.scrollX) {
                indicator = {
                    el: this._createScrollBar(CLASS_SCROLLBAR_HORIZONTAL),
                    listenY: false
                };

                this.wrapper.appendChild(indicator.el);
                indicators.push(indicator);
            }

            for (var i = indicators.length; i--;) {
                this.indicators.push(new Indicator(this, indicators[i]));
            }

        },
        _initSnap: function() {
            this.currentPage = {};
            this.pages = [];
            var snaps = this.snaps;
            var length = snaps.length;
            var m = 0;
            var n = -1;
            var x = 0;
            var cx = 0;
            for (var i = 0; i < length; i++) {
                var snap = snaps[i];
                var offsetLeft = snap.offsetLeft;
                var offsetWidth = snap.offsetWidth;
                if (i === 0 || offsetLeft <= snaps[i - 1].offsetLeft) {
                    m = 0;
                    n++;
                }
                if (!this.pages[m]) {
                    this.pages[m] = [];
                }
                x = this._getSnapX(offsetLeft);
                cx = x - Math.round((offsetWidth) / 2);
                this.pages[m][n] = {
                    x: x,
                    cx: cx,
                    pageX: m,
                    element: snap
                }
                if (snap.classList.contains(CLASS_ACTIVE)) {
                    this.currentPage = this.pages[m][0];
                }
                if (x >= this.maxScrollX) {
                    m++;
                }
            }
            this.options.startX = this.currentPage.x || 0;
        },
        _getSnapX: function(offsetLeft) {
            return Math.max(Math.min(0, -offsetLeft + (this.wrapperWidth / 2)), this.maxScrollX);
        },
        _gotoPage: function(index) {
            this.currentPage = this.pages[Math.min(index, this.pages.length - 1)][0];
            for (var i = 0, len = this.snaps.length; i < len; i++) {
                if (i === index) {
                    this.snaps[i].classList.add(CLASS_ACTIVE);
                } else {
                    this.snaps[i].classList.remove(CLASS_ACTIVE);
                }
            }
            this.scrollTo(this.currentPage.x, 0, this.options.bounceTime);
        },
        _nearestSnap: function(x) {
            if (!this.pages.length) {
                return {
                    x: 0,
                    pageX: 0
                };
            }
            var i = 0;
            var length = this.pages.length;

            if (x > 0) {
                x = 0;
            } else if (x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            for (; i < length; i++) {
                if (x >= this.pages[i][0].cx) {
                    return this.pages[i][0];
                }
            }
            return {
                x: 0,
                pageX: 0
            };
        },
        _initEvent: function(detach) {
            var action = detach ? 'removeEventListener' : 'addEventListener';
            window[action]('orientationchange', this);
            window[action]('resize', this);

            this.scroller[action]('webkitTransitionEnd', this);

            this.wrapper[action]('touchstart', this);
            this.wrapper[action]('touchcancel', this);
            this.wrapper[action]('touchend', this);
            this.wrapper[action]('drag', this);
            this.wrapper[action]('dragend', this);
            this.wrapper[action]('flick', this);
            this.wrapper[action]('scrollend', this);
            if (this.options.scrollX) {
                this.wrapper[action]('swiperight', this);
            }
            var segmentedControl = this.wrapper.querySelector('.ryui-segmented-control');
            if (segmentedControl) { //靠，这个bug排查了一下午，阻止hash跳转，一旦hash跳转会导致可拖拽选项卡的tab不见
                ryui(segmentedControl)[detach ? 'off' : 'on']('click', 'a', $.preventDefault);
            }

            this.wrapper[action]('scrollend', this._handleIndicatorScrollend.bind(this));

            this.wrapper[action]('scrollstart', this._handleIndicatorScrollstart.bind(this));

            this.wrapper[action]('refresh', this._handleIndicatorRefresh.bind(this));
        },
        _handleIndicatorScrollend: function() {
            this.indicators.map(function(indicator) {
                indicator.fade();
            });
        },
        _handleIndicatorScrollstart: function() {
            this.indicators.map(function(indicator) {
                indicator.fade(1);
            });
        },
        _handleIndicatorRefresh: function() {
            this.indicators.map(function(indicator) {
                indicator.refresh();
            });
        },
        handleEvent: function(e) {
            if (this.stopped) {
                this.resetPosition();
                return;
            }

            switch (e.type) {
                case 'touchstart':
                    this._start(e);
                    break;
                case 'drag':
                    this.options.stopPropagation && e.stopPropagation();
                    this._drag(e);
                    break;
                case 'dragend':
                case 'flick':
                    this.options.stopPropagation && e.stopPropagation();
                    this._flick(e);
                    break;
                case 'touchcancel':
                case 'touchend':
                    this._end(e);
                    break;
                case 'webkitTransitionEnd':
                    this._transitionEnd(e);
                    break;
                case 'scrollend':
                    this._scrollend(e);
                    e.stopPropagation();
                    break;
                case 'orientationchange':
                case 'resize':
                    this._resize();
                    break;
                case 'swiperight':
                    e.stopPropagation();
                    break;

            }
        },
        _start: function(e) {
            this.moved = this.needReset = false;
            this._transitionTime();
            if (this.isInTransition && this.moved) {
                this.needReset = true;
                this.isInTransition = false;
                var pos = $.parseTranslateMatrix($.getStyles(this.scroller, 'webkitTransform'));
                this.setTranslate(Math.round(pos.x), Math.round(pos.y));
                this.resetPosition(); //reset
                $.trigger(this.scroller, 'scrollend', this);
                //				e.stopPropagation();
                e.preventDefault();
            }
            this.reLayout();
            $.trigger(this.scroller, 'beforescrollstart', this);
        },
        _getDirectionByAngle: function(angle) {
            if (angle < -80 && angle > -100) {
                return 'up';
            } else if (angle >= 80 && angle < 100) {
                return 'down';
            } else if (angle >= 170 || angle <= -170) {
                return 'left';
            } else if (angle >= -35 && angle <= 10) {
                return 'right';
            }
            return null;
        },
        _drag: function(e) {
            //			if (this.needReset) {
            //				e.stopPropagation(); //disable parent drag(nested scroller)
            //				return;
            //			}
            var detail = e.detail;
            if (this.options.scrollY || detail.direction === 'up' || detail.direction === 'down') { //如果是竖向滚动或手势方向是上或下
                //ios8 hack
                if ($.os.ios && parseFloat($.os.version) >= 8) { //多webview时，离开当前webview会导致后续touch事件不触发
                    var clientY = detail.gesture.touches[0].clientY;
                    //下拉刷新 or 上拉加载
                    if ((clientY + 10) > window.innerHeight || clientY < 10) {
                        this.resetPosition(this.options.bounceTime);
                        return;
                    }
                }
            }
            var isPreventDefault = isReturn = false;
            var direction = this._getDirectionByAngle(detail.angle);
            if (detail.direction === 'left' || detail.direction === 'right') {
                if (this.options.scrollX) {
                    isPreventDefault = true;
                    if (!this.moved) { //识别角度(该角度导致轮播不灵敏)
                        //						if (direction !== 'left' && direction !== 'right') {
                        //							isReturn = true;
                        //						} else {
                        $.gestures.session.lockDirection = true; //锁定方向
                        $.gestures.session.startDirection = detail.direction;
                        //						}
                    }
                } else if (this.options.scrollY && !this.moved) {
                    isReturn = true;
                }
            } else if (detail.direction === 'up' || detail.direction === 'down') {
                if (this.options.scrollY) {
                    isPreventDefault = true;
                    //					if (!this.moved) { //识别角度,竖向滚动似乎没必要进行小角度验证
                    //						if (direction !== 'up' && direction !== 'down') {
                    //							isReturn = true;
                    //						}
                    //					}
                    if (!this.moved) {
                        $.gestures.session.lockDirection = true; //锁定方向
                        $.gestures.session.startDirection = detail.direction;
                    }
                } else if (this.options.scrollX && !this.moved) {
                    isReturn = true;
                }
            } else {
                isReturn = true;
            }
            if (this.moved || isPreventDefault) {
                e.stopPropagation(); //阻止冒泡(scroll类嵌套)
                detail.gesture && detail.gesture.preventDefault();
            }
            if (isReturn) { //禁止非法方向滚动
                return;
            }
            if (!this.moved) {
                $.trigger(this.scroller, 'scrollstart', this);
            } else {
                e.stopPropagation(); //move期间阻止冒泡(scroll嵌套)
            }
            var deltaX = 0;
            var deltaY = 0;
            if (!this.moved) { //start
                deltaX = detail.deltaX;
                deltaY = detail.deltaY;
            } else { //move
                deltaX = detail.deltaX - $.gestures.session.prevTouch.deltaX;
                deltaY = detail.deltaY - $.gestures.session.prevTouch.deltaY;
            }
            var absDeltaX = Math.abs(detail.deltaX);
            var absDeltaY = Math.abs(detail.deltaY);
            if (absDeltaX > absDeltaY + this.options.directionLockThreshold) {
                deltaY = 0;
            } else if (absDeltaY >= absDeltaX + this.options.directionLockThreshold) {
                deltaX = 0;
            }

            deltaX = this.hasHorizontalScroll ? deltaX : 0;
            deltaY = this.hasVerticalScroll ? deltaY : 0;
            var newX = this.x + deltaX;
            var newY = this.y + deltaY;
            // Slow down if outside of the boundaries
            if (newX > 0 || newX < this.maxScrollX) {
                newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
            }
            if (newY > 0 || newY < this.maxScrollY) {
                newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
            }

            if (!this.requestAnimationFrame) {
                this._updateTranslate();
            }

            this.moved = true;
            this.x = newX;
            this.y = newY;
            $.trigger(this.scroller, 'scroll', this);
        },
        _flick: function(e) {
            //			if (!this.moved || this.needReset) {
            //				return;
            //			}
            if (!this.moved) {
                return;
            }
            e.stopPropagation();
            var detail = e.detail;
            this._clearRequestAnimationFrame();
            if (e.type === 'dragend' && detail.flick) { //dragend
                return;
            }

            var newX = Math.round(this.x);
            var newY = Math.round(this.y);

            this.isInTransition = false;
            // reset if we are outside of the boundaries
            if (this.resetPosition(this.options.bounceTime)) {
                return;
            }

            this.scrollTo(newX, newY); // ensures that the last position is rounded

            if (e.type === 'dragend') { //dragend
                $.trigger(this.scroller, 'scrollend', this);
                return;
            }
            var time = 0;
            var easing = '';
            // start momentum animation if needed
            if (this.options.momentum && detail.flickTime < 300) {
                momentumX = this.hasHorizontalScroll ? this._momentum(this.x, detail.flickDistanceX, detail.flickTime, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                    destination: newX,
                    duration: 0
                };
                momentumY = this.hasVerticalScroll ? this._momentum(this.y, detail.flickDistanceY, detail.flickTime, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                    destination: newY,
                    duration: 0
                };
                newX = momentumX.destination;
                newY = momentumY.destination;
                time = Math.max(momentumX.duration, momentumY.duration);
                this.isInTransition = true;
            }

            if (newX != this.x || newY != this.y) {
                if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                    easing = ease.quadratic;
                }
                this.scrollTo(newX, newY, time, easing);
                return;
            }

            $.trigger(this.scroller, 'scrollend', this);
            //			e.stopPropagation();
        },
        _end: function(e) {
            this.needReset = false;
            if ((!this.moved && this.needReset) || e.type === 'touchcancel') {
                this.resetPosition();
            }
        },
        _transitionEnd: function(e) {
            if (e.target != this.scroller || !this.isInTransition) {
                return;
            }
            this._transitionTime();
            if (!this.resetPosition(this.options.bounceTime)) {
                this.isInTransition = false;
                $.trigger(this.scroller, 'scrollend', this);
            }
        },
        _scrollend: function(e) {
            if (Math.abs(this.y) > 0 && this.y <= this.maxScrollY) {
                $.trigger(this.scroller, 'scrollbottom', this);
            }
        },
        _resize: function() {
            var that = this;
            clearTimeout(that.resizeTimeout);
            that.resizeTimeout = setTimeout(function() {
                that.refresh();
            }, that.options.resizePolling);
        },
        _transitionTime: function(time) {
            time = time || 0;
            this.scrollerStyle['webkitTransitionDuration'] = time + 'ms';
            if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
                this.parallaxStyle['webkitTransitionDuration'] = time + 'ms';
            }
            if (this.options.fixedBadAndorid && !time && $.os.isBadAndroid) {
                this.scrollerStyle['webkitTransitionDuration'] = '0.001s';
                if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
                    this.parallaxStyle['webkitTransitionDuration'] = '0.001s';
                }
            }
            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTime(time);
                }
            }
        },
        _transitionTimingFunction: function(easing) {
            this.scrollerStyle['webkitTransitionTimingFunction'] = easing;
            if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
                this.parallaxStyle['webkitTransitionDuration'] = easing;
            }
            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTimingFunction(easing);
                }
            }
        },
        _translate: function(x, y) {
            this.x = x;
            this.y = y;
        },
        _clearRequestAnimationFrame: function() {
            if (this.requestAnimationFrame) {
                cancelAnimationFrame(this.requestAnimationFrame);
                this.requestAnimationFrame = null;
            }
        },
        _updateTranslate: function() {
            var self = this;
            if (self.x !== self.lastX || self.y !== self.lastY) {
                self.setTranslate(self.x, self.y);
            }
            self.requestAnimationFrame = requestAnimationFrame(function() {
                self._updateTranslate();
            });
        },
        _createScrollBar: function(clazz) {
            var scrollbar = document.createElement('div');
            var indicator = document.createElement('div');
            scrollbar.className = CLASS_SCROLLBAR + ' ' + clazz;
            indicator.className = CLASS_INDICATOR;
            scrollbar.appendChild(indicator);
            if (clazz === CLASS_SCROLLBAR_VERTICAL) {
                this.scrollbarY = scrollbar;
                this.scrollbarIndicatorY = indicator;
            } else if (clazz === CLASS_SCROLLBAR_HORIZONTAL) {
                this.scrollbarX = scrollbar;
                this.scrollbarIndicatorX = indicator;
            }
            this.wrapper.appendChild(scrollbar);
            return scrollbar;
        },
        _preventDefaultException: function(el, exceptions) {
            for (var i in exceptions) {
                if (exceptions[i].test(el[i])) {
                    return true;
                }
            }
            return false;
        },
        _reLayout: function() {
            if (!this.hasHorizontalScroll) {
                this.maxScrollX = 0;
                this.scrollerWidth = this.wrapperWidth;
            }

            if (!this.hasVerticalScroll) {
                this.maxScrollY = 0;
                this.scrollerHeight = this.wrapperHeight;
            }

            this.indicators.map(function(indicator) {
                indicator.refresh();
            });

            //以防slider类嵌套使用
            if (this.options.snap && typeof this.options.snap === 'string') {
                var items = this.scroller.querySelectorAll(this.options.snap);
                this.itemLength = 0;
                this.snaps = [];
                for (var i = 0, len = items.length; i < len; i++) {
                    var item = items[i];
                    if (item.parentNode === this.scroller) {
                        this.itemLength++;
                        this.snaps.push(item);
                    }
                }
                this._initSnap(); //需要每次都_initSnap么。其实init的时候执行一次，后续resize的时候执行一次就行了吧.先这么做吧，如果影响性能，再调整
            }
        },
        _momentum: function(current, distance, time, lowerMargin, wrapperSize, deceleration) {
            var speed = parseFloat(Math.abs(distance) / time),
                destination,
                duration;

            deceleration = deceleration === undefined ? 0.0006 : deceleration;
            destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
            duration = speed / deceleration;
            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed;
            } else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed;
            }

            return {
                destination: Math.round(destination),
                duration: duration
            };
        },
        _getTranslateStr: function(x, y) {
            if (this.options.hardwareAccelerated) {
                return 'translate3d(' + x + 'px,' + y + 'px,0px) ' + this.translateZ;
            }
            return 'translate(' + x + 'px,' + y + 'px) ';
        },
        //API
        setStopped: function(stopped) {
            this.stopped = !!stopped;
        },
        setTranslate: function(x, y) {
            this.x = x;
            this.y = y;
            this.scrollerStyle['webkitTransform'] = this._getTranslateStr(x, y);
            if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
                var parallaxY = y * this.options.parallaxRatio;
                var scale = 1 + parallaxY / ((this.parallaxHeight - parallaxY) / 2);
                if (scale > 1) {
                    this.parallaxImgStyle['opacity'] = 1 - parallaxY / 100 * this.options.parallaxRatio;
                    this.parallaxStyle['webkitTransform'] = this._getTranslateStr(0, -parallaxY) + ' scale(' + scale + ',' + scale + ')';
                } else {
                    this.parallaxImgStyle['opacity'] = 1;
                    this.parallaxStyle['webkitTransform'] = this._getTranslateStr(0, -1) + ' scale(1,1)';
                }
            }
            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].updatePosition();
                }
            }
            this.lastX = this.x;
            this.lastY = this.y;
            $.trigger(this.scroller, 'scroll', this);
        },
        reLayout: function() {
            this.wrapper.offsetHeight;

            var paddingLeft = parseFloat($.getStyles(this.wrapper, 'padding-left')) || 0;
            var paddingRight = parseFloat($.getStyles(this.wrapper, 'padding-right')) || 0;
            var paddingTop = parseFloat($.getStyles(this.wrapper, 'padding-top')) || 0;
            var paddingBottom = parseFloat($.getStyles(this.wrapper, 'padding-bottom')) || 0;

            var clientWidth = this.wrapper.clientWidth;
            var clientHeight = this.wrapper.clientHeight;

            this.scrollerWidth = this.scroller.offsetWidth;
            this.scrollerHeight = this.scroller.offsetHeight;

            this.wrapperWidth = clientWidth - paddingLeft - paddingRight;
            this.wrapperHeight = clientHeight - paddingTop - paddingBottom;

            this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
            this.maxScrollY = Math.min(this.wrapperHeight - this.scrollerHeight, 0);
            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
            this._reLayout();
        },
        resetPosition: function(time) {
            var x = this.x,
                y = this.y;

            time = time || 0;
            if (!this.hasHorizontalScroll || this.x > 0) {
                x = 0;
            } else if (this.x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (!this.hasVerticalScroll || this.y > 0) {
                y = 0;
            } else if (this.y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            if (x == this.x && y == this.y) {
                return false;
            }
            this.scrollTo(x, y, time, this.options.bounceEasing);

            return true;
        },
        refresh: function() {
            this.reLayout();
            $.trigger(this.scroller, 'refresh', this);
            this.resetPosition();
        },
        scrollTo: function(x, y, time, easing) {
            var easing = easing || ease.circular;
            this.isInTransition = time > 0 && (this.lastX != x || this.lastY != y);
            if (this.isInTransition) {
                this._clearRequestAnimationFrame();
                this._transitionTimingFunction(easing.style);
                this._transitionTime(time);
                this.setTranslate(x, y);
            } else {
                this.setTranslate(x, y);
            }

        },
        scrollToBottom: function(time, easing) {
            time = time || this.options.bounceTime;
            this.scrollTo(0, this.maxScrollY, time, easing);
        },
        gotoPage: function(index) {
            this._gotoPage(index);
        },
        destory: function() {
            this._initEvent(true); //detach
            delete $.data[this.wrapper.getAttribute('data-scroll')];
            this.wrapper.setAttribute('data-scroll', '');
        }
    });
    //Indicator
    var Indicator = function(scroller, options) {
        this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
        this.wrapperStyle = this.wrapper.style;
        this.indicator = this.wrapper.children[0];
        this.indicatorStyle = this.indicator.style;
        this.scroller = scroller;

        this.options = $.extend({
            listenX: true,
            listenY: true,
            fade: false,
            speedRatioX: 0,
            speedRatioY: 0
        }, options);


        this.sizeRatioX = 1;
        this.sizeRatioY = 1;
        this.maxPosX = 0;
        this.maxPosY = 0;

        if (this.options.fade) {
            this.wrapperStyle['webkitTransform'] = this.scroller.translateZ;
            this.wrapperStyle['webkitTransitionDuration'] = this.options.fixedBadAndorid && $.os.isBadAndroid ? '0.001s' : '0ms';
            this.wrapperStyle.opacity = '0';
        }
    }
    Indicator.prototype = {
        handleEvent: function(e) {

        },
        transitionTime: function(time) {
            time = time || 0;
            this.indicatorStyle['webkitTransitionDuration'] = time + 'ms';
            if (this.scroller.options.fixedBadAndorid && !time && $.os.isBadAndroid) {
                this.indicatorStyle['webkitTransitionDuration'] = '0.001s';
            }
        },
        transitionTimingFunction: function(easing) {
            this.indicatorStyle['webkitTransitionTimingFunction'] = easing;
        },
        refresh: function() {
            this.transitionTime();

            if (this.options.listenX && !this.options.listenY) {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
            } else if (this.options.listenY && !this.options.listenX) {
                this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
            } else {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
            }

            this.wrapper.offsetHeight; // force refresh

            if (this.options.listenX) {
                this.wrapperWidth = this.wrapper.clientWidth;
                this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                this.indicatorStyle.width = this.indicatorWidth + 'px';

                this.maxPosX = this.wrapperWidth - this.indicatorWidth;

                this.minBoundaryX = 0;
                this.maxBoundaryX = this.maxPosX;

                this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
            }

            if (this.options.listenY) {
                this.wrapperHeight = this.wrapper.clientHeight;
                this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                this.indicatorStyle.height = this.indicatorHeight + 'px';

                this.maxPosY = this.wrapperHeight - this.indicatorHeight;

                this.minBoundaryY = 0;
                this.maxBoundaryY = this.maxPosY;

                this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
            }

            this.updatePosition();
        },

        updatePosition: function() {
            var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
                y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

            if (x < this.minBoundaryX) {
                this.width = Math.max(this.indicatorWidth + x, 8);
                this.indicatorStyle.width = this.width + 'px';
                x = this.minBoundaryX;
            } else if (x > this.maxBoundaryX) {
                this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                this.indicatorStyle.width = this.width + 'px';
                x = this.maxPosX + this.indicatorWidth - this.width;
            } else if (this.width != this.indicatorWidth) {
                this.width = this.indicatorWidth;
                this.indicatorStyle.width = this.width + 'px';
            }

            if (y < this.minBoundaryY) {
                this.height = Math.max(this.indicatorHeight + y * 3, 8);
                this.indicatorStyle.height = this.height + 'px';
                y = this.minBoundaryY;
            } else if (y > this.maxBoundaryY) {
                this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                this.indicatorStyle.height = this.height + 'px';
                y = this.maxPosY + this.indicatorHeight - this.height;
            } else if (this.height != this.indicatorHeight) {
                this.height = this.indicatorHeight;
                this.indicatorStyle.height = this.height + 'px';
            }

            this.x = x;
            this.y = y;

            this.indicatorStyle['webkitTransform'] = this.scroller._getTranslateStr(x, y);

        },
        fade: function(val, hold) {
            if (hold && !this.visible) {
                return;
            }

            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;

            var time = val ? 250 : 500,
                delay = val ? 0 : 300;

            val = val ? '1' : '0';

            this.wrapperStyle['webkitTransitionDuration'] = time + 'ms';

            this.fadeTimeout = setTimeout((function(val) {
                this.wrapperStyle.opacity = val;
                this.visible = +val;
            }).bind(this, val), delay);
        }
    };

    $.Scroll = Scroll;

    $.fn.scroll = function(options) {
        var scrollApis = [];
        this.each(function() {
            var scrollApi = null;
            var self = this;
            var id = self.getAttribute('data-scroll');
            if (!id) {
                id = ++$.uuid;
                var _options = $.extend({}, options);
                if (self.classList.contains('ryui-segmented-control')) {
                    _options = $.extend(_options, {
                        scrollY: false,
                        scrollX: true,
                        indicators: false,
                        snap: '.ryui-control-item'
                    });
                }
                $.data[id] = scrollApi = new Scroll(self, _options);
                self.setAttribute('data-scroll', id);
            } else {
                scrollApi = $.data[id];
            }
            scrollApis.push(scrollApi);
        });
        return scrollApis.length === 1 ? scrollApis[0] : scrollApis;
    };
})(ryui, window, document);
/**
 * snap 重构
 * @param {Object} $
 * @param {Object} window
 */
(function($, window) {
    var CLASS_SLIDER = 'ryui-slider';
    var CLASS_SLIDER_GROUP = 'ryui-slider-group';
    var CLASS_SLIDER_LOOP = 'ryui-slider-loop';
    var CLASS_SLIDER_INDICATOR = 'ryui-slider-indicator';
    var CLASS_ACTION_PREVIOUS = 'ryui-action-previous';
    var CLASS_ACTION_NEXT = 'ryui-action-next';
    var CLASS_SLIDER_ITEM = 'ryui-slider-item';

    var CLASS_ACTIVE = 'ryui-active';

    var SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;
    var SELECTOR_SLIDER_INDICATOR = '.' + CLASS_SLIDER_INDICATOR;
    var SELECTOR_SLIDER_PROGRESS_BAR = '.ryui-slider-progress-bar';

    var Slider = $.Slider = $.Scroll.extend({
        init: function(element, options) {
            this._super(element, $.extend(true, {
                fingers: 1,
                interval: 0, //设置为0，则不定时轮播
                scrollY: false,
                scrollX: true,
                indicators: false,
                bounceTime: 200,
                startX: false,
                snap: SELECTOR_SLIDER_ITEM
            }, options));
            if (this.options.startX) {
                //				$.trigger(this.wrapper, 'scrollend', this);
            }
        },
        _init: function() {
            var groups = this.wrapper.querySelectorAll('.' + CLASS_SLIDER_GROUP);
            for (var i = 0, len = groups.length; i < len; i++) {
                if (groups[i].parentNode === this.wrapper) {
                    this.scroller = groups[i];
                    break;
                }
            }
            if (this.scroller) {
                this.scrollerStyle = this.scroller.style;
                this.progressBar = this.wrapper.querySelector(SELECTOR_SLIDER_PROGRESS_BAR);
                if (this.progressBar) {
                    this.progressBarWidth = this.progressBar.offsetWidth;
                    this.progressBarStyle = this.progressBar.style;
                }
                //忘记这个代码是干什么的了？
                //				this.x = this._getScroll();
                //				if (this.options.startX === false) {
                //					this.options.startX = this.x;
                //				}
                //根据active修正startX

                this._super();
                this._initTimer();
            }
        },
        _triggerSlide: function() {
            var self = this;
            self.isInTransition = false;
            var page = self.currentPage;
            self.slideNumber = self._fixedSlideNumber();
            if (self.loop) {
                if (self.slideNumber === 0) {
                    self.setTranslate(self.pages[1][0].x, 0);
                } else if (self.slideNumber === self.itemLength - 3) {
                    self.setTranslate(self.pages[self.itemLength - 2][0].x, 0);
                }
            }
            if (self.lastSlideNumber != self.slideNumber) {
                self.lastSlideNumber = self.slideNumber;
                self.lastPage = self.currentPage;
                $.trigger(self.wrapper, 'slide', {
                    slideNumber: self.slideNumber
                });
            }
            self._initTimer();
        },
        _handleSlide: function(e) {
            var self = this;
            if (e.target !== self.wrapper) {
                return;
            }
            var detail = e.detail;
            detail.slideNumber = detail.slideNumber || 0;
            var items = self.scroller.querySelectorAll(SELECTOR_SLIDER_ITEM);
            var _slideNumber = detail.slideNumber;
            if (self.loop) {
                _slideNumber += 1;
            }
            if (!self.wrapper.classList.contains('ryui-segmented-control')) {
                for (var i = 0, len = items.length; i < len; i++) {
                    var item = items[i];
                    if (item.parentNode === self.scroller) {
                        if (i === _slideNumber) {
                            item.classList.add(CLASS_ACTIVE);
                        } else {
                            item.classList.remove(CLASS_ACTIVE);
                        }
                    }
                }
            }
            var indicatorWrap = self.wrapper.querySelector('.ryui-slider-indicator');
            if (indicatorWrap) {
                if (indicatorWrap.getAttribute('data-scroll')) { //scroll
                    $(indicatorWrap).scroll().gotoPage(detail.slideNumber);
                }
                var indicators = indicatorWrap.querySelectorAll('.ryui-indicator');
                if (indicators.length > 0) { //图片轮播
                    for (var i = 0, len = indicators.length; i < len; i++) {
                        indicators[i].classList[i === detail.slideNumber ? 'add' : 'remove'](CLASS_ACTIVE);
                    }
                } else {
                    var number = indicatorWrap.querySelector('.ryui-number span');
                    if (number) { //图文表格
                        number.innerText = (detail.slideNumber + 1);
                    } else { //segmented controls
                        var controlItems = self.wrapper.querySelectorAll('.ryui-control-item');
                        for (var i = 0, len = controlItems.length; i < len; i++) {
                            controlItems[i].classList[i === detail.slideNumber ? 'add' : 'remove'](CLASS_ACTIVE);
                        }
                    }
                }
            }
            e.stopPropagation();
        },
        _handleTabShow: function(e) {
            var self = this;
            self.gotoItem((e.detail.tabNumber || 0), self.options.bounceTime);
        },
        _handleIndicatorTap: function(event) {
            var self = this;
            var target = event.target;
            if (target.classList.contains(CLASS_ACTION_PREVIOUS) || target.classList.contains(CLASS_ACTION_NEXT)) {
                self[target.classList.contains(CLASS_ACTION_PREVIOUS) ? 'prevItem' : 'nextItem']();
                event.stopPropagation();
            }
        },
        _initEvent: function(detach) {
            var self = this;
            self._super(detach);
            var action = detach ? 'removeEventListener' : 'addEventListener';
            self.wrapper[action]('swiperight', $.stopPropagation);
            self.wrapper[action]('scrollend', self._triggerSlide.bind(this));

            self.wrapper[action]('slide', self._handleSlide.bind(this));

            self.wrapper[action]($.eventName('shown', 'tab'), self._handleTabShow.bind(this));
            //indicator
            var indicator = self.wrapper.querySelector(SELECTOR_SLIDER_INDICATOR);
            if (indicator) {
                indicator[action]('tap', self._handleIndicatorTap.bind(this));
            }
            //XXX item tap
            var items = self.scroller.querySelectorAll(SELECTOR_SLIDER_ITEM);
            if(items && self.options.callback){
                $.each(items,function(index,item){
                    item[action]('tap',function(){
                        self.options.callback(this,index);
                    });
                });
            }
        },
        _drag: function(e) {
            this._super(e);
            var direction = e.detail.direction;
            if (direction === 'left' || direction === 'right') {
                //拖拽期间取消定时
                var slidershowTimer = this.wrapper.getAttribute('data-slidershowTimer');
                slidershowTimer && window.clearTimeout(slidershowTimer);

                e.stopPropagation();
            }
        },
        _initTimer: function() {
            var self = this;
            var slider = self.wrapper;
            var interval = self.options.interval;
            var slidershowTimer = slider.getAttribute('data-slidershowTimer');
            slidershowTimer && window.clearTimeout(slidershowTimer);
            if (interval) {
                slidershowTimer = window.setTimeout(function() {
                    if (!slider) {
                        return;
                    }
                    //仅slider显示状态进行自动轮播
                    if (!!(slider.offsetWidth || slider.offsetHeight)) {
                        self.nextItem(true);
                        //下一个
                    }
                    self._initTimer();
                }, interval);
                slider.setAttribute('data-slidershowTimer', slidershowTimer);
            }
        },

        _fixedSlideNumber: function(page) {
            page = page || this.currentPage;
            var slideNumber = page.pageX;
            if (this.loop) {
                if (page.pageX === 0) {
                    slideNumber = this.itemLength - 3;
                } else if (page.pageX === (this.itemLength - 1)) {
                    slideNumber = 0;
                } else {
                    slideNumber = page.pageX - 1;
                }
            }
            return slideNumber;
        },
        _reLayout: function() {
            this.hasHorizontalScroll = true;
            this.loop = this.scroller.classList.contains(CLASS_SLIDER_LOOP);
            this._super();
        },
        _getScroll: function() {
            var result = $.parseTranslateMatrix($.getStyles(this.scroller, 'webkitTransform'));
            return result ? result.x : 0;
        },
        _transitionEnd: function(e) {
            if (e.target !== this.scroller || !this.isInTransition) {
                return;
            }
            this._transitionTime();
            this.isInTransition = false;
            $.trigger(this.wrapper, 'scrollend', this);
        },
        _flick: function(e) {
            if (!this.moved) { //无moved
                return;
            }
            var detail = e.detail;
            var direction = detail.direction;
            this._clearRequestAnimationFrame();
            this.isInTransition = true;
            //			if (direction === 'up' || direction === 'down') {
            //				this.resetPosition(this.options.bounceTime);
            //				return;
            //			}
            if (e.type === 'flick') {
                if (detail.deltaTime < 200) { //flick，太容易触发，额外校验一下deltaTime
                    this.x = this._getPage((this.slideNumber + (direction === 'right' ? -1 : 1)), true).x;
                }
                this.resetPosition(this.options.bounceTime);
            } else if (e.type === 'dragend' && !detail.flick) {
                this.resetPosition(this.options.bounceTime);
            }
            e.stopPropagation();
        },
        _initSnap: function() {
            this.scrollerWidth = this.itemLength * this.scrollerWidth;
            this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
            this._super();
            if (!this.currentPage.x) {
                //当slider处于隐藏状态时，导致snap计算是错误的，临时先这么判断一下，后续要考虑解决所有scroll在隐藏状态下初始化属性不正确的问题
                var currentPage = this.pages[this.loop ? 1 : 0];
                currentPage = currentPage || this.pages[0];
                if (!currentPage) {
                    return;
                }
                this.currentPage = currentPage[0];
                this.slideNumber = 0;
                this.lastSlideNumber = typeof this.lastSlideNumber === 'undefined' ? 0 : this.lastSlideNumber;
            } else {
                this.slideNumber = this._fixedSlideNumber();
                this.lastSlideNumber = typeof this.lastSlideNumber === 'undefined' ? this.slideNumber : this.lastSlideNumber;
            }
            this.options.startX = this.currentPage.x || 0;
        },
        _getSnapX: function(offsetLeft) {
            return Math.max(-offsetLeft, this.maxScrollX);
        },
        _getPage: function(slideNumber, isFlick) {
            if (this.loop) {
                if (slideNumber > (this.itemLength - (isFlick ? 2 : 3))) {
                    slideNumber = 1;
                    time = 0;
                } else if (slideNumber < (isFlick ? -1 : 0)) {
                    slideNumber = this.itemLength - 2;
                    time = 0;
                } else {
                    slideNumber += 1;
                }
            } else {
                if (!isFlick) {
                    if (slideNumber > (this.itemLength - 1)) {
                        slideNumber = 0;
                        time = 0;
                    } else if (slideNumber < 0) {
                        slideNumber = this.itemLength - 1;
                        time = 0;
                    }
                }
                slideNumber = Math.min(Math.max(0, slideNumber), this.itemLength - 1);
            }
            return this.pages[slideNumber][0];
        },
        _gotoItem: function(slideNumber, time) {
            this.currentPage = this._getPage(slideNumber, true); //此处传true。可保证程序切换时，动画与人手操作一致(第一张，最后一张的切换动画)
            this.scrollTo(this.currentPage.x, 0, time, this.options.bounceEasing);
            if (time === 0) {
                $.trigger(this.wrapper, 'scrollend', this);
            }
        },
        //API
        setTranslate: function(x, y) {
            this._super(x, y);
            var progressBar = this.progressBar;
            if (progressBar) {
                this.progressBarStyle.webkitTransform = this._getTranslateStr((-x * (this.progressBarWidth / this.wrapperWidth)), 0);
            }
        },
        resetPosition: function(time) {
            time = time || 0;
            if (this.x > 0) {
                this.x = 0;
            } else if (this.x < this.maxScrollX) {
                this.x = this.maxScrollX;
            }
            this.currentPage = this._nearestSnap(this.x);
            this.scrollTo(this.currentPage.x, 0, time);
            return true;
        },
        gotoItem: function(slideNumber, time) {
            this._gotoItem(slideNumber, typeof time === 'undefined' ? this.options.bounceTime : time);
        },
        nextItem: function() {
            this._gotoItem(this.slideNumber + 1, this.options.bounceTime);
        },
        prevItem: function() {
            this._gotoItem(this.slideNumber - 1, this.options.bounceTime);
        },
        getSlideNumber: function() {
            return this.slideNumber || 0;
        },
        refresh: function(options) {
            if (options) {
                $.extend(this.options, options);
                this._super();
                this.nextItem();
            } else {
                this._super();
            }
        },
        destory: function() {
            this._initEvent(true); //detach
            delete $.data[this.wrapper.getAttribute('data-slider')];
            this.wrapper.setAttribute('data-slider', '');
        }
    });
    $.fn.slider = function(options) {
        var slider = null;
        this.each(function() {
            var sliderElement = this;
            if (!this.classList.contains(CLASS_SLIDER)) {
                sliderElement = this.querySelector('.' + CLASS_SLIDER);
            }
            if (sliderElement && sliderElement.querySelector(SELECTOR_SLIDER_ITEM)) {
                var id = sliderElement.getAttribute('data-slider');
                if (!id) {
                    id = ++$.uuid;
                    $.data[id] = slider = new Slider(sliderElement, options);
                    sliderElement.setAttribute('data-slider', id);
                } else {
                    slider = $.data[id];
                    if (slider && options) {
                        slider.refresh(options);
                    }
                }
            }
        });
        return slider;
    };
    $.ready(function() {
        //		setTimeout(function() {
        //$('.ryui-slider').slider();
        $('.ryui-scroll-wrapper.ryui-slider-indicator.ryui-segmented-control').scroll({
            scrollY: false,
            scrollX: true,
            indicators: false,
            snap: '.ryui-control-item'
        });
        //		}, 500); //临时处理slider宽度计算不正确的问题(初步确认是scrollbar导致的)

    });
})(ryui, window);
/**
 * off-canvas
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} action
 * @returns {undefined}
 */
(function($, window, document, name) {
    var CLASS_OFF_CANVAS_LEFT = 'ryui-off-canvas-left';
    var CLASS_OFF_CANVAS_RIGHT = 'ryui-off-canvas-right';
    var CLASS_ACTION_BACKDROP = 'ryui-off-canvas-backdrop';
    var CLASS_OFF_CANVAS_WRAP = 'ryui-off-canvas-wrap';

    var CLASS_SLIDE_IN = 'ryui-slide-in';
    var CLASS_ACTIVE = 'ryui-active';


    var CLASS_TRANSITIONING = 'ryui-transitioning';

    var SELECTOR_INNER_WRAP = '.ryui-inner-wrap';


    var OffCanvas = $.Class.extend({
        init: function(element, options) {
            this.wrapper = this.element = element;
            this.scroller = this.wrapper.querySelector(SELECTOR_INNER_WRAP);
            this.classList = this.wrapper.classList;
            if (this.scroller) {
                this.options = $.extend(true, {
                    dragThresholdX: 10,
                    scale: 0.8,
                    opacity: 0.1
                }, options);
                document.body.classList.add('ryui-fullscreen'); //fullscreen
                this.refresh();
                this.initEvent();
            }
        },
        refresh: function(offCanvas) {
            //			offCanvas && !offCanvas.classList.contains(CLASS_ACTIVE) && this.classList.remove(CLASS_ACTIVE);
            this.slideIn = this.classList.contains(CLASS_SLIDE_IN);
            this.scalable = this.classList.contains('ryui-scalable') && !this.slideIn;
            this.scroller = this.wrapper.querySelector(SELECTOR_INNER_WRAP);
            //			!offCanvas && this.scroller.classList.remove(CLASS_TRANSITIONING);
            //			!offCanvas && this.scroller.setAttribute('style', '');
            this.offCanvasLefts = this.wrapper.querySelectorAll('.' + CLASS_OFF_CANVAS_LEFT);
            this.offCanvasRights = this.wrapper.querySelectorAll('.' + CLASS_OFF_CANVAS_RIGHT);
            if (offCanvas) {
                if (offCanvas.classList.contains(CLASS_OFF_CANVAS_LEFT)) {
                    this.offCanvasLeft = offCanvas;
                } else if (offCanvas.classList.contains(CLASS_OFF_CANVAS_RIGHT)) {
                    this.offCanvasRight = offCanvas;
                }
            } else {
                this.offCanvasRight = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT);
                this.offCanvasLeft = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT);
            }
            this.offCanvasRightWidth = this.offCanvasLeftWidth = 0;
            this.offCanvasLeftSlideIn = this.offCanvasRightSlideIn = false;
            if (this.offCanvasRight) {
                this.offCanvasRightWidth = this.offCanvasRight.offsetWidth;
                this.offCanvasRightSlideIn = this.slideIn && (this.offCanvasRight.parentNode === this.wrapper);
                //				this.offCanvasRight.classList.remove(CLASS_TRANSITIONING);
                //				this.offCanvasRight.classList.remove(CLASS_ACTIVE);
                //				this.offCanvasRight.setAttribute('style', '');
            }
            if (this.offCanvasLeft) {
                this.offCanvasLeftWidth = this.offCanvasLeft.offsetWidth;
                this.offCanvasLeftSlideIn = this.slideIn && (this.offCanvasLeft.parentNode === this.wrapper);
                //				this.offCanvasLeft.classList.remove(CLASS_TRANSITIONING);
                //				this.offCanvasLeft.classList.remove(CLASS_ACTIVE);
                //				this.offCanvasLeft.setAttribute('style', '');
            }
            this.backdrop = this.scroller.querySelector('.' + CLASS_ACTION_BACKDROP);

            this.options.dragThresholdX = this.options.dragThresholdX || 10;

            this.visible = false;
            this.startX = null;
            this.lastX = null;
            this.offsetX = null;
            this.lastTranslateX = null;
        },
        handleEvent: function(e) {
            switch (e.type) {
                case 'touchstart':
                    var tagName = e.target && e.target.tagName;
                    if (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT') {
                        e.preventDefault();
                    }
                    break;
                case 'webkitTransitionEnd': //有个bug需要处理，需要考虑假设没有触发webkitTransitionEnd的情况
                    if (e.target === this.scroller) {
                        this._dispatchEvent();
                    }
                    break;
                case 'drag':
                    var detail = e.detail;
                    if (!this.startX) {
                        this.startX = detail.center.x;
                        this.lastX = this.startX;
                    } else {
                        this.lastX = detail.center.x;
                    }
                    if (!this.isDragging && Math.abs(this.lastX - this.startX) > this.options.dragThresholdX && (detail.direction === 'left' || (detail.direction === 'right'))) {
                        if (this.slideIn) {
                            this.scroller = this.wrapper.querySelector(SELECTOR_INNER_WRAP);
                            if (this.classList.contains(CLASS_ACTIVE)) {
                                if (this.offCanvasRight && this.offCanvasRight.classList.contains(CLASS_ACTIVE)) {
                                    this.offCanvas = this.offCanvasRight;
                                    this.offCanvasWidth = this.offCanvasRightWidth;
                                } else {
                                    this.offCanvas = this.offCanvasLeft;
                                    this.offCanvasWidth = this.offCanvasLeftWidth;
                                }
                            } else {
                                if (detail.direction === 'left' && this.offCanvasRight) {
                                    this.offCanvas = this.offCanvasRight;
                                    this.offCanvasWidth = this.offCanvasRightWidth;
                                } else if (detail.direction === 'right' && this.offCanvasLeft) {
                                    this.offCanvas = this.offCanvasLeft;
                                    this.offCanvasWidth = this.offCanvasLeftWidth;
                                } else {
                                    this.scroller = null;
                                }
                            }
                        } else {
                            if (this.classList.contains(CLASS_ACTIVE)) {
                                if (detail.direction === 'left') {
                                    this.offCanvas = this.offCanvasLeft;
                                    this.offCanvasWidth = this.offCanvasLeftWidth;
                                } else {
                                    this.offCanvas = this.offCanvasRight;
                                    this.offCanvasWidth = this.offCanvasRightWidth;
                                }
                            } else {
                                if (detail.direction === 'right') {
                                    this.offCanvas = this.offCanvasLeft;
                                    this.offCanvasWidth = this.offCanvasLeftWidth;
                                } else {
                                    this.offCanvas = this.offCanvasRight;
                                    this.offCanvasWidth = this.offCanvasRightWidth;
                                }
                            }
                        }
                        if (this.offCanvas && this.scroller) {
                            this.startX = this.lastX;
                            this.isDragging = true;

                            $.gestures.session.lockDirection = true; //锁定方向
                            $.gestures.session.startDirection = detail.direction;

                            this.offCanvas.classList.remove(CLASS_TRANSITIONING);
                            this.scroller.classList.remove(CLASS_TRANSITIONING);
                            this.offsetX = this.getTranslateX();
                            this._initOffCanvasVisible();
                        }
                    }
                    if (this.isDragging) {
                        this.updateTranslate(this.offsetX + (this.lastX - this.startX));
                        detail.gesture.preventDefault();
                        e.stopPropagation();
                    }
                    break;
                case 'dragend':
                    if (this.isDragging) {
                        var detail = e.detail;
                        var direction = detail.direction;
                        this.isDragging = false;
                        this.offCanvas.classList.add(CLASS_TRANSITIONING);
                        this.scroller.classList.add(CLASS_TRANSITIONING);
                        var ratio = 0;
                        var x = this.getTranslateX();
                        if (!this.slideIn) {
                            if (x >= 0) {
                                ratio = (this.offCanvasLeftWidth && (x / this.offCanvasLeftWidth)) || 0;
                            } else {
                                ratio = (this.offCanvasRightWidth && (x / this.offCanvasRightWidth)) || 0;
                            }
                            if (ratio === 0) {
                                this.openPercentage(0);
                                this._dispatchEvent(); //此处不触发webkitTransitionEnd,所以手动dispatch
                                return;
                            }
                            if (ratio > 0 && ratio < 0.5 && direction === 'right') {
                                this.openPercentage(0);
                            } else if (ratio > 0.5 && direction === 'left') {
                                this.openPercentage(100);
                            } else if (ratio < 0 && ratio > -0.5 && direction === 'left') {
                                this.openPercentage(0);
                            } else if (direction === 'right' && ratio < 0 && ratio > -0.5) {
                                this.openPercentage(0);
                            } else if (ratio < 0.5 && direction === 'right') {
                                this.openPercentage(-100);
                            } else if (direction === 'right' && ratio >= 0 && (ratio >= 0.5 || detail.flick)) {
                                this.openPercentage(100);
                            } else if (direction === 'left' && ratio <= 0 && (ratio <= -0.5 || detail.flick)) {
                                this.openPercentage(-100);
                            } else {
                                this.openPercentage(0);
                            }
                            if (ratio === 1 || ratio === -1) { //此处不触发webkitTransitionEnd,所以手动dispatch
                                this._dispatchEvent();
                            }
                        } else {
                            if (x >= 0) {
                                ratio = (this.offCanvasRightWidth && (x / this.offCanvasRightWidth)) || 0;
                            } else {
                                ratio = (this.offCanvasLeftWidth && (x / this.offCanvasLeftWidth)) || 0;
                            }
                            if (ratio >= 0.5 && direction === 'left') {
                                this.openPercentage(0);
                            } else if (ratio > 0 && ratio <= 0.5 && direction === 'left') {
                                this.openPercentage(-100);
                            } else if (ratio >= 0.5 && direction === 'right') {
                                this.openPercentage(0);
                            } else if (ratio >= -0.5 && ratio < 0 && direction === 'left') {
                                this.openPercentage(100);
                            } else if (ratio > 0 && ratio <= 0.5 && direction === 'right') {
                                this.openPercentage(-100);
                            } else if (ratio <= -0.5 && direction === 'right') {
                                this.openPercentage(0);
                            } else if (ratio >= -0.5 && direction === 'right') {
                                this.openPercentage(100);
                            } else if (ratio <= -0.5 && direction === 'left') {
                                this.openPercentage(0);
                            } else if (ratio >= -0.5 && direction === 'left') {
                                this.openPercentage(-100);
                            } else {
                                this.openPercentage(0);
                            }
                            if (ratio === 1 || ratio === -1 || ratio === 0) {
                                this._dispatchEvent();
                                return;
                            }

                        }
                    }
                    break;
            }
        },
        _dispatchEvent: function() {
            if (this.classList.contains(CLASS_ACTIVE)) {
                $.trigger(this.wrapper, 'shown', this);
            } else {
                $.trigger(this.wrapper, 'hidden', this);
            }
        },
        _initOffCanvasVisible: function() {
            if (!this.visible) {
                this.visible = true;
                if (this.offCanvasLeft) {
                    this.offCanvasLeft.style.visibility = 'visible';
                }
                if (this.offCanvasRight) {
                    this.offCanvasRight.style.visibility = 'visible';
                }
            }
        },
        initEvent: function() {
            var self = this;
            if (self.backdrop) {
                self.backdrop.addEventListener('tap', function(e) {
                    self.close();
                    e.detail.gesture.preventDefault();
                });
            }
            if (this.classList.contains('ryui-draggable')) {
                this.wrapper.addEventListener('touchstart', this); //临时处理
                this.wrapper.addEventListener('drag', this);
                this.wrapper.addEventListener('dragend', this);
            }
            this.wrapper.addEventListener('webkitTransitionEnd', this);
        },
        openPercentage: function(percentage) {
            var p = percentage / 100;
            if (!this.slideIn) {
                if (this.offCanvasLeft && percentage >= 0) {
                    this.updateTranslate(this.offCanvasLeftWidth * p);
                    this.offCanvasLeft.classList[p !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
                } else if (this.offCanvasRight && percentage <= 0) {
                    this.updateTranslate(this.offCanvasRightWidth * p);
                    this.offCanvasRight.classList[p !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
                }
                this.classList[p !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
            } else {
                if (this.offCanvasLeft && percentage >= 0) {
                    p = p === 0 ? -1 : 0;
                    this.updateTranslate(this.offCanvasLeftWidth * p);
                    this.offCanvasLeft.classList[percentage !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
                } else if (this.offCanvasRight && percentage <= 0) {
                    p = p === 0 ? 1 : 0;
                    this.updateTranslate(this.offCanvasRightWidth * p);
                    this.offCanvasRight.classList[percentage !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
                }
                this.classList[percentage !== 0 ? 'add' : 'remove'](CLASS_ACTIVE);
            }

        },
        updateTranslate: function(x) {
            if (x !== this.lastTranslateX) {
                if (!this.slideIn) {
                    if ((!this.offCanvasLeft && x > 0) || (!this.offCanvasRight && x < 0)) {
                        this.setTranslateX(0);
                        return;
                    }
                    if (this.leftShowing && x > this.offCanvasLeftWidth) {
                        this.setTranslateX(this.offCanvasLeftWidth);
                        return;
                    }
                    if (this.rightShowing && x < -this.offCanvasRightWidth) {
                        this.setTranslateX(-this.offCanvasRightWidth);
                        return;
                    }
                    this.setTranslateX(x);
                    if (x >= 0) {
                        this.leftShowing = true;
                        this.rightShowing = false;
                        if (x > 0) {
                            if (this.offCanvasLeft) {
                                $.each(this.offCanvasLefts, function(index, offCanvas) {
                                    if (offCanvas === this.offCanvasLeft) {
                                        this.offCanvasLeft.style.zIndex = 0;
                                    } else {
                                        offCanvas.style.zIndex = -1;
                                    }
                                }.bind(this));
                            }
                            if (this.offCanvasRight) {
                                this.offCanvasRight.style.zIndex = -1;
                            }
                        }
                    } else {
                        this.rightShowing = true;
                        this.leftShowing = false;
                        if (this.offCanvasRight) {
                            $.each(this.offCanvasRights, function(index, offCanvas) {
                                if (offCanvas === this.offCanvasRight) {
                                    offCanvas.style.zIndex = 0;
                                } else {
                                    offCanvas.style.zIndex = -1;
                                }
                            }.bind(this));
                        }
                        if (this.offCanvasLeft) {
                            this.offCanvasLeft.style.zIndex = -1;
                        }
                    }
                } else {
                    if (this.offCanvas.classList.contains(CLASS_OFF_CANVAS_RIGHT)) {
                        if (x < 0) {
                            this.setTranslateX(0);
                            return;
                        }
                        if (x > this.offCanvasRightWidth) {
                            this.setTranslateX(this.offCanvasRightWidth);
                            return;
                        }
                    } else {
                        if (x > 0) {
                            this.setTranslateX(0);
                            return;
                        }
                        if (x < -this.offCanvasLeftWidth) {
                            this.setTranslateX(-this.offCanvasLeftWidth);
                            return;
                        }
                    }
                    this.setTranslateX(x);
                }
                this.lastTranslateX = x;
            }
        },
        setTranslateX: $.animationFrame(function(x) {
            if (this.scroller) {
                if (this.scalable && this.offCanvas.parentNode === this.wrapper) {
                    var percent = Math.abs(x) / this.offCanvasWidth;
                    var zoomOutScale = 1 - (1 - this.options.scale) * percent;
                    var zoomInScale = this.options.scale + (1 - this.options.scale) * percent;
                    var zoomOutOpacity = 1 - (1 - this.options.opacity) * percent;
                    var zoomInOpacity = this.options.opacity + (1 - this.options.opacity) * percent;
                    if (this.offCanvas.classList.contains(CLASS_OFF_CANVAS_LEFT)) {
                        this.offCanvas.style.webkitTransformOrigin = '-100%';
                        this.scroller.style.webkitTransformOrigin = 'left';
                    } else {
                        this.offCanvas.style.webkitTransformOrigin = '200%';
                        this.scroller.style.webkitTransformOrigin = 'right';
                    }
                    this.offCanvas.style.opacity = zoomInOpacity;
                    this.offCanvas.style.webkitTransform = 'translate3d(0,0,0) scale(' + zoomInScale + ')';
                    this.scroller.style.webkitTransform = 'translate3d(' + x + 'px,0,0) scale(' + zoomOutScale + ')';
                } else {
                    if (this.slideIn) {
                        this.offCanvas.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
                    } else {
                        this.scroller.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
                    }
                }
            }
        }),
        getTranslateX: function() {
            if (this.offCanvas) {
                var scroller = this.slideIn ? this.offCanvas : this.scroller;
                var result = $.parseTranslateMatrix($.getStyles(scroller, 'webkitTransform'));
                return (result && result.x) || 0;
            }
            return 0;
        },
        isShown: function(direction) {
            var shown = false;
            if (!this.slideIn) {
                var x = this.getTranslateX();
                if (direction === 'right') {
                    shown = this.classList.contains(CLASS_ACTIVE) && x < 0;
                } else if (direction === 'left') {
                    shown = this.classList.contains(CLASS_ACTIVE) && x > 0;
                } else {
                    shown = this.classList.contains(CLASS_ACTIVE) && x !== 0;
                }
            } else {
                if (direction === 'left') {
                    shown = this.classList.contains(CLASS_ACTIVE) && this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT + '.' + CLASS_ACTIVE);
                } else if (direction === 'right') {
                    shown = this.classList.contains(CLASS_ACTIVE) && this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT + '.' + CLASS_ACTIVE);
                } else {
                    shown = this.classList.contains(CLASS_ACTIVE) && (this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT + '.' + CLASS_ACTIVE) || this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT + '.' + CLASS_ACTIVE));
                }
            }
            return shown;
        },
        close: function() {
            this._initOffCanvasVisible();
            this.offCanvas = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT + '.' + CLASS_ACTIVE) || this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_LEFT + '.' + CLASS_ACTIVE);
            this.offCanvasWidth = this.offCanvas.offsetWidth;
            if (this.scroller) {
                this.offCanvas.offsetHeight;
                this.offCanvas.classList.add(CLASS_TRANSITIONING);
                this.scroller.classList.add(CLASS_TRANSITIONING);
                this.openPercentage(0);
            }
        },
        show: function(direction) {
            this._initOffCanvasVisible();
            if (this.isShown(direction)) {
                return false;
            }
            if (!direction) {
                direction = this.wrapper.querySelector('.' + CLASS_OFF_CANVAS_RIGHT) ? 'right' : 'left';
            }
            if (direction === 'right') {
                this.offCanvas = this.offCanvasRight;
                this.offCanvasWidth = this.offCanvasRightWidth;
            } else {
                this.offCanvas = this.offCanvasLeft;
                this.offCanvasWidth = this.offCanvasLeftWidth;
            }
            if (this.scroller) {
                this.offCanvas.offsetHeight;
                this.offCanvas.classList.add(CLASS_TRANSITIONING);
                this.scroller.classList.add(CLASS_TRANSITIONING);
                this.openPercentage(direction === 'left' ? 100 : -100);
            }
            return true;
        },
        toggle: function(directionOrOffCanvas) {
            var direction = directionOrOffCanvas;
            if (directionOrOffCanvas && directionOrOffCanvas.classList) {
                direction = directionOrOffCanvas.classList.contains(CLASS_OFF_CANVAS_LEFT) ? 'left' : 'right';
                this.refresh(directionOrOffCanvas);
            }
            if (!this.show(direction)) {
                this.close();
            }
        }
    });

    //hash to offcanvas
    var findOffCanvasContainer = function(target) {
        parentNode = target.parentNode;
        if (parentNode) {
            if (parentNode.classList.contains(CLASS_OFF_CANVAS_WRAP)) {
                return parentNode;
            } else {
                parentNode = parentNode.parentNode;
                if (parentNode.classList.contains(CLASS_OFF_CANVAS_WRAP)) {
                    return parentNode;
                }
            }
        }
    };
    var handle = function(event, target) {
        if (target.tagName === 'A' && target.hash) {
            var offcanvas = document.getElementById(target.hash.replace('#', ''));
            if (offcanvas) {
                var container = findOffCanvasContainer(offcanvas);
                if (container) {
                    $.targets._container = container;
                    return offcanvas;
                }
            }
        }
        return false;
    };

    $.registerTarget({
        name: name,
        index: 60,
        handle: handle,
        target: false,
        isReset: false,
        isContinue: true
    });

    window.addEventListener('tap', function(e) {
        if (!$.targets.offcanvas) {
            return;
        }
        //TODO 此处类型的代码后续考虑统一优化(target机制)，现在的实现费力不讨好
        var target = e.target;
        for (; target && target !== document; target = target.parentNode) {
            if (target.tagName === 'A' && target.hash && target.hash === ('#' + $.targets.offcanvas.id)) {
                e.detail && e.detail.gesture && e.detail.gesture.preventDefault(); //fixed hashchange
                $($.targets._container).offCanvas().toggle($.targets.offcanvas);
                $.targets.offcanvas = $.targets._container = null;
                break;
            }
        }
    });

    $.fn.offCanvas = function(options) {
        var offCanvasApis = [];
        this.each(function() {
            var offCanvasApi = null;
            var self = this;
            //hack old version
            if (!self.classList.contains(CLASS_OFF_CANVAS_WRAP)) {
                self = findOffCanvasContainer(self);
            }
            var id = self.getAttribute('data-offCanvas');
            if (!id) {
                id = ++$.uuid;
                $.data[id] = offCanvasApi = new OffCanvas(self, options);
                self.setAttribute('data-offCanvas', id);
            } else {
                offCanvasApi = $.data[id];
            }
            if (options === 'show' || options === 'close' || options === 'toggle') {
                offCanvasApi.toggle();
            }
            offCanvasApis.push(offCanvasApi);
        });
        return offCanvasApis.length === 1 ? offCanvasApis[0] : offCanvasApis;
    };
    $.ready(function() {
        $('.ryui-off-canvas-wrap').offCanvas();
    });
})(ryui, window, document, 'offcanvas');
/**
 * Modals
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} name
 * @returns {undefined}
 */
(function($, window, document, name) {
    var CLASS_MODAL = 'ryui-modal';

    var handle = function(event, target) {
        if (target.tagName === 'A' && target.hash) {
            var modal = document.getElementById(target.hash.replace('#', ''));
            if (modal && modal.classList.contains(CLASS_MODAL)) {
                return modal;
            }
        }
        return false;
    };

    $.registerTarget({
        name: name,
        index: 50,
        handle: handle,
        target: false,
        isReset: false,
        isContinue: true
    });

    window.addEventListener('tap', function(event) {
        if ($.targets.modal) {
            event.detail.gesture.preventDefault(); //fixed hashchange
            $.targets.modal.classList.toggle('ryui-active');
        }
    });
})(ryui, window, document, 'modal');
/**
 * Popovers
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} name
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, name) {

    var CLASS_POPOVER = 'ryui-popover';
    var CLASS_POPOVER_ARROW = 'ryui-popover-arrow';
    var CLASS_ACTION_POPOVER = 'ryui-popover-action';
    var CLASS_BACKDROP = 'ryui-backdrop';
    var CLASS_BAR_POPOVER = 'ryui-bar-popover';
    var CLASS_BAR_BACKDROP = 'ryui-bar-backdrop';
    var CLASS_ACTION_BACKDROP = 'ryui-backdrop-action';
    var CLASS_ACTIVE = 'ryui-active';
    var CLASS_BOTTOM = 'ryui-bottom';



    var handle = function(event, target) {
        if (target.tagName === 'A' && target.hash) {
            $.targets._popover = document.getElementById(target.hash.replace('#', ''));
            if ($.targets._popover && $.targets._popover.classList.contains(CLASS_POPOVER)) {
                return target;
            } else {
                $.targets._popover = null;
            }
        }
        return false;
    };

    $.registerTarget({
        name: name,
        index: 60,
        handle: handle,
        target: false,
        isReset: false,
        isContinue: true
    });

    var fixedPopoverScroll = function(isPopoverScroll) {
        //		if (isPopoverScroll) {
        //			document.body.setAttribute('style', 'overflow:hidden;');
        //		} else {
        //			document.body.setAttribute('style', '');
        //		}
    };
    var onPopoverShown = function(e) {
        this.removeEventListener('webkitTransitionEnd', onPopoverShown);
        this.addEventListener('touchmove', $.preventDefault);
        $.trigger(this, 'shown', this);
    }
    var onPopoverHidden = function(e) {
        setStyle(this, 'none');
        this.removeEventListener('webkitTransitionEnd', onPopoverHidden);
        this.removeEventListener('touchmove', $.preventDefault);
        fixedPopoverScroll(false);
        $.trigger(this, 'hidden', this);
    };

    var backdrop = (function() {
        var element = document.createElement('div');
        element.classList.add(CLASS_BACKDROP);
        element.addEventListener('touchmove', $.preventDefault);
        element.addEventListener('tap', function(e) {
            var popover = $.targets._popover;
            if (popover) {
                popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
                popover.classList.remove(CLASS_ACTIVE);
                removeBackdrop(popover);
                document.body.setAttribute('style', ''); //webkitTransitionEnd有时候不触发？
            }
        });

        return element;
    }());
    var removeBackdrop = function(popover) {
        backdrop.setAttribute('style', 'opacity:0');
        $.targets.popover = $.targets._popover = null; //reset
        setTimeout(function() {
            if (!popover.classList.contains(CLASS_ACTIVE) && backdrop.parentNode && backdrop.parentNode === document.body) {
                document.body.removeChild(backdrop);
            }
        }, 350);
    };
    window.addEventListener('tap', function(e) {
        if (!$.targets.popover) {
            return;
        }
        var toggle = false;
        var target = e.target;
        for (; target && target !== document; target = target.parentNode) {
            if (target === $.targets.popover) {
                toggle = true;
            }
        }
        if (toggle) {
            e.detail.gesture.preventDefault(); //fixed hashchange
            togglePopover($.targets._popover, $.targets.popover);
        }

    });

    var togglePopover = function(popover, anchor) {
        //remove一遍，以免来回快速切换，导致webkitTransitionEnd不触发，无法remove
        popover.removeEventListener('webkitTransitionEnd', onPopoverShown);
        popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
        backdrop.classList.remove(CLASS_BAR_BACKDROP);
        backdrop.classList.remove(CLASS_ACTION_BACKDROP);
        var _popover = document.querySelector('.ryui-popover.ryui-active');
        if (_popover) {
            //			_popover.setAttribute('style', '');
            _popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
            _popover.classList.remove(CLASS_ACTIVE);
            //			_popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
            //			fixedPopoverScroll(false);
            //同一个弹出则直接返回，解决同一个popover的toggle
            if (popover === _popover) {
                removeBackdrop(_popover);
                return;
            }
        }
        var isActionSheet = false;
        if (popover.classList.contains(CLASS_BAR_POPOVER) || popover.classList.contains(CLASS_ACTION_POPOVER)) { //navBar
            if (popover.classList.contains(CLASS_ACTION_POPOVER)) { //action sheet popover
                isActionSheet = true;
                backdrop.classList.add(CLASS_ACTION_BACKDROP);
            } else { //bar popover
                backdrop.classList.add(CLASS_BAR_BACKDROP);
                //				if (anchor) {
                //					if (anchor.parentNode) {
                //						var offsetWidth = anchor.offsetWidth;
                //						var offsetLeft = anchor.offsetLeft;
                //						var innerWidth = window.innerWidth;
                //						popover.style.left = (Math.min(Math.max(offsetLeft, defaultPadding), innerWidth - offsetWidth - defaultPadding)) + "px";
                //					} else {
                //						//TODO anchor is position:{left,top,bottom,right}
                //					}
                //				}
            }
        }
        setStyle(popover, 'block'); //actionsheet transform
        popover.offsetHeight;
        popover.classList.add(CLASS_ACTIVE);
        backdrop.setAttribute('style', '');
        document.body.appendChild(backdrop);
        fixedPopoverScroll(true);
        calPosition(popover, anchor, isActionSheet); //position
        backdrop.classList.add(CLASS_ACTIVE);
        popover.addEventListener('webkitTransitionEnd', onPopoverShown);
    };
    var setStyle = function(popover, display, top, left) {
        var style = popover.style;
        if (typeof display !== 'undefined')
            style.display = display;
        if (typeof top !== 'undefined')
            style.top = top + 'px';
        if (typeof left !== 'undefined')
            style.left = left + 'px';
    };
    var calPosition = function(popover, anchor, isActionSheet) {
        if (!popover || !anchor) {
            return;
        }

        if (isActionSheet) { //actionsheet
            setStyle(popover, 'block')
            return;
        }

        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;

        var pWidth = popover.offsetWidth;
        var pHeight = popover.offsetHeight;

        var aWidth = anchor.offsetWidth;
        var aHeight = anchor.offsetHeight;
        var offset = $.offset(anchor);

        var arrow = popover.querySelector('.' + CLASS_POPOVER_ARROW);
        if (!arrow) {
            arrow = document.createElement('div');
            arrow.className = CLASS_POPOVER_ARROW;
            popover.appendChild(arrow);
        }
        var arrowSize = arrow && arrow.offsetWidth / 2 || 0;



        var pTop = 0;
        var pLeft = 0;
        var diff = 0;
        var arrowLeft = 0;
        var defaultPadding = popover.classList.contains(CLASS_ACTION_POPOVER) ? 0 : 5;

        var position = 'top';
        if ((pHeight + arrowSize) < (offset.top - window.pageYOffset)) { //top
            pTop = offset.top - pHeight - arrowSize;
        } else if ((pHeight + arrowSize) < (wHeight - (offset.top - window.pageYOffset) - aHeight)) { //bottom
            position = 'bottom';
            pTop = offset.top + aHeight + arrowSize;
        } else { //middle
            position = 'middle';
            pTop = Math.max((wHeight - pHeight) / 2 + window.pageYOffset, 0);
            pLeft = Math.max((wWidth - pWidth) / 2 + window.pageXOffset, 0);
        }
        if (position === 'top' || position === 'bottom') {
            pLeft = aWidth / 2 + offset.left - pWidth / 2;
            diff = pLeft;
            if (pLeft < defaultPadding) pLeft = defaultPadding;
            if (pLeft + pWidth > wWidth) pLeft = wWidth - pWidth - defaultPadding;

            if (arrow) {
                if (position === 'top') {
                    arrow.classList.add(CLASS_BOTTOM);
                } else {
                    arrow.classList.remove(CLASS_BOTTOM);
                }
                diff = diff - pLeft;
                arrowLeft = (pWidth / 2 - arrowSize / 2 + diff);
                arrowLeft = Math.max(Math.min(arrowLeft, pWidth - arrowSize * 2 - 6), 6);
                arrow.setAttribute('style', 'left:' + arrowLeft + 'px');
            }
        } else if (position === 'middle') {
            arrow.setAttribute('style', 'display:none');
        }
        setStyle(popover, 'block', pTop, pLeft);
    };
    /**
     * 遮罩层
     * @param {function} 可选 callback 遮罩层关闭时执行的的回调函数
     * var $mask=$.createMask(function(){alert("遮罩层关闭")});
     * $mask.show();//显示遮罩层
     * $mask.close();//关闭遮罩层
     */
    $.createMask = function(callback) {
        var element = document.createElement('div');
        element.classList.add(CLASS_BACKDROP);
        element.addEventListener('touchmove', $.preventDefault);
        element.addEventListener('tap', function() {
            mask.close();
        });
        var mask = [element];
        mask._show = false;
        mask.show = function() {
            mask._show = true;
            element.setAttribute('style', 'opacity:1');
            document.body.appendChild(element);
            return mask;
        };
        mask._remove = function() {
            if (mask._show) {
                mask._show = false;
                element.setAttribute('style', 'opacity:0');
                $.later(function() {
                    var body = document.body;
                    element.parentNode === body && body.removeChild(element);
                }, 350);
            }
            return mask;
        };
        mask.close = function() {
            if (callback) {
                if (callback() !== false) {
                    mask._remove();
                }
            } else {
                mask._remove();
            }
        };
        return mask;
    };
    $.fn.popover = function() {
        var args = arguments;
        this.each(function() {
            $.targets._popover = this;
            if (args[0] === 'show' || args[0] === 'hide' || args[0] === 'toggle') {
                togglePopover(this, args[1]);
            }
        });
    };

})(ryui, window, document, 'popover');
/**
 * segmented-controllers
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, name, undefined) {

    var CLASS_CONTROL_ITEM = 'ryui-control-item';
    var CLASS_SEGMENTED_CONTROL = 'ryui-segmented-control';
    var CLASS_CONTROL_CONTENT = 'ryui-control-content';
    var CLASS_TAB_BAR = 'ryui-bar-tab';
    var CLASS_TAB_ITEM = 'ryui-tab-item';
    var CLASS_SLIDER_ITEM = 'ryui-slider-item';

    var handle = function(event, target) {
        if (target.classList && (target.classList.contains(CLASS_CONTROL_ITEM) || target.classList.contains(CLASS_TAB_ITEM))) {
            event.preventDefault(); //stop hash change
            //			if (target.hash) {
            return target;
            //			}
        }
        return false;
    };

    $.registerTarget({
        name: name,
        index: 80,
        handle: handle,
        target: false
    });

    window.addEventListener('tap', function(e) {

        var targetTab = $.targets.tab;
        if (!targetTab) {
            return;
        }
        var activeTab;
        var activeBodies;
        var targetBody;
        var className = 'ryui-active';
        var classSelector = '.' + className;
        var segmentedControl = targetTab.parentNode;

        for (; segmentedControl && segmentedControl !== document; segmentedControl = segmentedControl.parentNode) {
            if (segmentedControl.classList.contains(CLASS_SEGMENTED_CONTROL)) {
                activeTab = segmentedControl.querySelector(classSelector + '.' + CLASS_CONTROL_ITEM);
                break;
            } else if (segmentedControl.classList.contains(CLASS_TAB_BAR)) {
                activeTab = segmentedControl.querySelector(classSelector + '.' + CLASS_TAB_ITEM);
            }
        }


        if (activeTab) {
            activeTab.classList.remove(className);
        }

        var isLastActive = targetTab === activeTab;
        if (targetTab) {
            targetTab.classList.add(className);
        }

        if (!targetTab.hash) {
            return;
        }

        targetBody = document.getElementById(targetTab.hash.replace('#', ''));

        if (!targetBody) {
            return;
        }
        if (!targetBody.classList.contains(CLASS_CONTROL_CONTENT)) { //tab bar popover
            targetTab.classList[isLastActive ? 'remove' : 'add'](className);
            return;
        }
        if (isLastActive) { //same
            return;
        }
        var parentNode = targetBody.parentNode;
        activeBodies = parentNode.querySelectorAll('.' + CLASS_CONTROL_CONTENT + classSelector);
        for (var i = 0; i < activeBodies.length; i++) {
            var activeBody = activeBodies[i];
            activeBody.parentNode === parentNode && activeBody.classList.remove(className);
        }

        targetBody.classList.add(className);

        var contents = targetBody.parentNode.querySelectorAll('.' + CLASS_CONTROL_CONTENT);
        $.trigger(targetBody, $.eventName('shown', name), {
            tabNumber: Array.prototype.indexOf.call(contents, targetBody)
        });
        e.detail && e.detail.gesture.preventDefault(); //fixed hashchange
    });

})(ryui, window, document, 'tab');
/**
 * Toggles switch
 * @param {type} $
 * @param {type} window
 * @param {type} name
 * @returns {undefined}
 */
(function($, window, name) {

    var CLASS_SWITCH = 'ryui-switch';
    var CLASS_SWITCH_HANDLE = 'ryui-switch-handle';
    var CLASS_ACTIVE = 'ryui-active';
    var CLASS_DRAGGING = 'ryui-dragging';

    var CLASS_DISABLED = 'ryui-disabled';

    var SELECTOR_SWITCH_HANDLE = '.' + CLASS_SWITCH_HANDLE;

    var handle = function(event, target) {
        if (target.classList && target.classList.contains(CLASS_SWITCH)) {
            return target;
        }
        return false;
    };

    $.registerTarget({
        name: name,
        index: 100,
        handle: handle,
        target: false
    });


    var Toggle = function(element) {
        this.element = element;
        this.classList = this.element.classList;
        this.handle = this.element.querySelector(SELECTOR_SWITCH_HANDLE);
        this.init();
        this.initEvent();
    };
    Toggle.prototype.init = function() {
        this.toggleWidth = this.element.offsetWidth;
        this.handleWidth = this.handle.offsetWidth;
        this.handleX = this.toggleWidth - this.handleWidth - 3;
    };
    Toggle.prototype.initEvent = function() {
        this.element.addEventListener('touchstart', this);
        this.element.addEventListener('drag', this);
        this.element.addEventListener('swiperight', this);
        this.element.addEventListener('touchend', this);
        this.element.addEventListener('touchcancel', this);

    };
    Toggle.prototype.handleEvent = function(e) {
        if (this.classList.contains(CLASS_DISABLED)) {
            return;
        }
        switch (e.type) {
            case 'touchstart':
                this.start(e);
                break;
            case 'drag':
                this.drag(e);
                break;
            case 'swiperight':
                this.swiperight();
                break;
            case 'touchend':
            case 'touchcancel':
                this.end(e);
                break;
        }
    };
    Toggle.prototype.start = function(e) {
        this.classList.add(CLASS_DRAGGING);
        if (this.toggleWidth === 0 || this.handleWidth === 0) { //当switch处于隐藏状态时，width为0，需要重新初始化
            this.init();
        }
    };
    Toggle.prototype.drag = function(e) {
        var detail = e.detail;
        if (!this.isDragging) {
            if (detail.direction === 'left' || detail.direction === 'right') {
                this.isDragging = true;
                this.lastChanged = undefined;
                this.initialState = this.classList.contains(CLASS_ACTIVE);
            }
        }
        if (this.isDragging) {
            this.setTranslateX(detail.deltaX);
            e.stopPropagation();
            detail.gesture.preventDefault();
        }
    };
    Toggle.prototype.swiperight = function(e) {
        if (this.isDragging) {
            e.stopPropagation();
        }
    };
    Toggle.prototype.end = function(e) {
        this.classList.remove(CLASS_DRAGGING);
        if (this.isDragging) {
            this.isDragging = false;
            e.stopPropagation();
            $.trigger(this.element, 'toggle', {
                isActive: this.classList.contains(CLASS_ACTIVE)
            });
        } else {
            this.toggle();
        }
    };
    Toggle.prototype.toggle = function() {
        var classList = this.classList;
        if (classList.contains(CLASS_ACTIVE)) {
            classList.remove(CLASS_ACTIVE);
            this.handle.style.webkitTransform = 'translate(0,0)';
        } else {
            classList.add(CLASS_ACTIVE);
            this.handle.style.webkitTransform = 'translate(' + this.handleX + 'px,0)';
        }
        $.trigger(this.element, 'toggle', {
            isActive: this.classList.contains(CLASS_ACTIVE)
        });
    };
    Toggle.prototype.setTranslateX = $.animationFrame(function(x) {
        if (!this.isDragging) {
            return;
        }
        var isChanged = false;
        if ((this.initialState && -x > (this.handleX / 2)) || (!this.initialState && x > (this.handleX / 2))) {
            isChanged = true;
        }
        if (this.lastChanged !== isChanged) {
            if (isChanged) {
                this.handle.style.webkitTransform = 'translate(' + (this.initialState ? 0 : this.handleX) + 'px,0)';
                this.classList[this.initialState ? 'remove' : 'add'](CLASS_ACTIVE);
            } else {
                this.handle.style.webkitTransform = 'translate(' + (this.initialState ? this.handleX : 0) + 'px,0)';
                this.classList[this.initialState ? 'add' : 'remove'](CLASS_ACTIVE);
            }
            this.lastChanged = isChanged;
        }

    });

    $.fn['switch'] = function(options) {
        var switchApis = [];
        this.each(function() {
            var switchApi = null;
            var id = this.getAttribute('data-switch');
            if (!id) {
                id = ++$.uuid;
                $.data[id] = new Toggle(this);
                this.setAttribute('data-switch', id);
            } else {
                switchApi = $.data[id];
            }
            switchApis.push(switchApi);
        });
        return switchApis.length > 1 ? switchApis : switchApis[0];
    };
    $.ready(function() {
        $('.' + CLASS_SWITCH)['switch']();
    });
})(ryui, window, 'toggle');
/**
 * Tableviews
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 */
(function($, window, document) {

    var CLASS_ACTIVE = 'ryui-active';
    var CLASS_SELECTED = 'ryui-selected';
    var CLASS_GRID_VIEW = 'ryui-grid-view';
    var CLASS_RADIO_VIEW = 'ryui-table-view-radio';
    var CLASS_TABLE_VIEW_CELL = 'ryui-table-view-cell';
    var CLASS_COLLAPSE_CONTENT = 'ryui-collapse-content';
    var CLASS_DISABLED = 'ryui-disabled';
    var CLASS_TOGGLE = 'ryui-switch';
    var CLASS_BTN = 'ryui-btn';

    var CLASS_SLIDER_HANDLE = 'ryui-slider-handle';
    var CLASS_SLIDER_LEFT = 'ryui-slider-left';
    var CLASS_SLIDER_RIGHT = 'ryui-slider-right';
    var CLASS_TRANSITIONING = 'ryui-transitioning';


    var SELECTOR_SLIDER_HANDLE = '.' + CLASS_SLIDER_HANDLE;
    var SELECTOR_SLIDER_LEFT = '.' + CLASS_SLIDER_LEFT;
    var SELECTOR_SLIDER_RIGHT = '.' + CLASS_SLIDER_RIGHT;
    var SELECTOR_SELECTED = '.' + CLASS_SELECTED;
    var SELECTOR_BUTTON = '.' + CLASS_BTN;
    var overFactor = 0.8;
    var cell, a;

    var isMoved = isOpened = openedActions = progress = false;
    var sliderHandle = sliderActionLeft = sliderActionRight = buttonsLeft = buttonsRight = sliderDirection = sliderRequestAnimationFrame = false;
    var timer = translateX = lastTranslateX = sliderActionLeftWidth = sliderActionRightWidth = 0;



    var toggleActive = function(isActive) {
        if (isActive) {
            if (a) {
                a.classList.add(CLASS_ACTIVE);
            } else if (cell) {
                cell.classList.add(CLASS_ACTIVE);
            }
        } else {
            timer && timer.cancel();
            if (a) {
                a.classList.remove(CLASS_ACTIVE);
            } else if (cell) {
                cell.classList.remove(CLASS_ACTIVE);
            }
        }
    };

    var updateTranslate = function() {
        if (translateX !== lastTranslateX) {
            if (buttonsRight && buttonsRight.length > 0) {
                progress = translateX / sliderActionRightWidth;
                if (translateX < -sliderActionRightWidth) {
                    translateX = -sliderActionRightWidth - Math.pow(-translateX - sliderActionRightWidth, overFactor);
                }
                for (var i = 0, len = buttonsRight.length; i < len; i++) {
                    var buttonRight = buttonsRight[i];
                    if (typeof buttonRight._buttonOffset === 'undefined') {
                        buttonRight._buttonOffset = buttonRight.offsetLeft;
                    }
                    buttonOffset = buttonRight._buttonOffset;
                    setTranslate(buttonRight, (translateX - buttonOffset * (1 + Math.max(progress, -1))));
                }
            }
            if (buttonsLeft && buttonsLeft.length > 0) {
                progress = translateX / sliderActionLeftWidth;
                if (translateX > sliderActionLeftWidth) {
                    translateX = sliderActionLeftWidth + Math.pow(translateX - sliderActionLeftWidth, overFactor);
                }
                for (var i = 0, len = buttonsLeft.length; i < len; i++) {
                    var buttonLeft = buttonsLeft[i];
                    if (typeof buttonLeft._buttonOffset === 'undefined') {
                        buttonLeft._buttonOffset = sliderActionLeftWidth - buttonLeft.offsetLeft - buttonLeft.offsetWidth;
                    }
                    buttonOffset = buttonLeft._buttonOffset;
                    if (buttonsLeft.length > 1) {
                        buttonLeft.style.zIndex = buttonsLeft.length - i;
                    }
                    setTranslate(buttonLeft, (translateX + buttonOffset * (1 - Math.min(progress, 1))));
                }
            }
            setTranslate(sliderHandle, translateX);
            lastTranslateX = translateX;
        }
        sliderRequestAnimationFrame = requestAnimationFrame(function() {
            updateTranslate();
        });
    };
    var setTranslate = function(element, x) {
        if (element) {
            element.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
        }
    };

    window.addEventListener('touchstart', function(event) {
        if (cell) {
            toggleActive(false);
        }
        cell = a = false;
        isMoved = isOpened = openedActions = false;
        var target = event.target;
        var isDisabled = false;
        for (; target && target !== document; target = target.parentNode) {
            if (target.classList) {
                var classList = target.classList;
                if ((target.tagName === 'INPUT' && target.type !== 'radio' && target.type !== 'checkbox') || target.tagName === 'BUTTON' || classList.contains(CLASS_TOGGLE) || classList.contains(CLASS_BTN) || classList.contains(CLASS_DISABLED)) {
                    isDisabled = true;
                }
                if (classList.contains(CLASS_COLLAPSE_CONTENT)) { //collapse content
                    break;
                }
                if (classList.contains(CLASS_TABLE_VIEW_CELL)) {
                    cell = target;
                    //TODO swipe to delete close
                    var selected = cell.parentNode.querySelector(SELECTOR_SELECTED);
                    if (!cell.parentNode.classList.contains(CLASS_RADIO_VIEW) && selected && selected !== cell) {
                        $.swipeoutClose(selected);
                        cell = isDisabled = false;
                        return;
                    }
                    if (!cell.parentNode.classList.contains(CLASS_GRID_VIEW)) {
                        var link = cell.querySelector('a');
                        if (link && link.parentNode === cell) { //li>a
                            a = link;
                        }
                    }
                    var handle = cell.querySelector(SELECTOR_SLIDER_HANDLE);
                    if (handle) {
                        toggleEvents(cell);
                        event.stopPropagation();
                    }
                    if (!isDisabled) {
                        if (handle) {
                            if (timer) {
                                timer.cancel();
                            }
                            timer = $.later(function() {
                                toggleActive(true);
                            }, 100);
                        } else {
                            toggleActive(true);
                        }
                    }
                    break;
                }
            }
        }
    });
    window.addEventListener('touchmove', function(event) {
        toggleActive(false);
    });

    var handleEvent = {
        handleEvent: function(event) {
            switch (event.type) {
                case 'drag':
                    this.drag(event);
                    break;
                case 'dragend':
                    this.dragend(event);
                    break;
                case 'flick':
                    this.flick(event);
                    break;
                case 'swiperight':
                    this.swiperight(event);
                    break;
                case 'swipeleft':
                    this.swipeleft(event);
                    break;
            }
        },
        drag: function(event) {
            if (!cell) {
                return;
            }
            if (!isMoved) { //init
                sliderHandle = sliderActionLeft = sliderActionRight = buttonsLeft = buttonsRight = sliderDirection = sliderRequestAnimationFrame = false;
                sliderHandle = cell.querySelector(SELECTOR_SLIDER_HANDLE);
                if (sliderHandle) {
                    sliderActionLeft = cell.querySelector(SELECTOR_SLIDER_LEFT);
                    sliderActionRight = cell.querySelector(SELECTOR_SLIDER_RIGHT);
                    if (sliderActionLeft) {
                        sliderActionLeftWidth = sliderActionLeft.offsetWidth;
                        buttonsLeft = sliderActionLeft.querySelectorAll(SELECTOR_BUTTON);
                    }
                    if (sliderActionRight) {
                        sliderActionRightWidth = sliderActionRight.offsetWidth;
                        buttonsRight = sliderActionRight.querySelectorAll(SELECTOR_BUTTON);
                    }
                    cell.classList.remove(CLASS_TRANSITIONING);
                    isOpened = cell.classList.contains(CLASS_SELECTED);
                    if (isOpened) {
                        openedActions = cell.querySelector(SELECTOR_SLIDER_LEFT + SELECTOR_SELECTED) ? 'left' : 'right';
                    }
                }
            }
            var detail = event.detail;
            var direction = detail.direction;
            var angle = detail.angle;
            if (direction === 'left' && (angle > 150 || angle < -150)) {
                if (buttonsRight || (buttonsLeft && isOpened)) { //存在右侧按钮或存在左侧按钮且是已打开状态
                    isMoved = true;
                }
            } else if (direction === 'right' && (angle > -30 && angle < 30)) {
                if (buttonsLeft || (buttonsRight && isOpened)) { //存在左侧按钮或存在右侧按钮且是已打开状态
                    isMoved = true;
                }
            }
            if (isMoved) {
                event.stopPropagation();
                event.detail.gesture.preventDefault();
                var translate = event.detail.deltaX;
                if (isOpened) {
                    if (openedActions === 'right') {
                        translate = translate - sliderActionRightWidth;
                    } else {
                        translate = translate + sliderActionLeftWidth;
                    }
                }
                if ((translate > 0 && !buttonsLeft) || (translate < 0 && !buttonsRight)) {
                    if (!isOpened) {
                        return;
                    }
                    translate = 0;
                }
                if (translate < 0) {
                    sliderDirection = 'toLeft';
                } else if (translate > 0) {
                    sliderDirection = 'toRight';
                } else {
                    if (!sliderDirection) {
                        sliderDirection = 'toLeft';
                    }
                }
                if (!sliderRequestAnimationFrame) {
                    updateTranslate();
                }
                translateX = translate;
            }
        },
        flick: function(event) {
            if (isMoved) {
                event.stopPropagation();
            }
        },
        swipeleft: function(event) {
            if (isMoved) {
                event.stopPropagation();
            }
        },
        swiperight: function(event) {
            if (isMoved) {
                event.stopPropagation();
            }
        },
        dragend: function(event) {
            if (!isMoved) {
                return;
            }
            event.stopPropagation();
            if (sliderRequestAnimationFrame) {
                cancelAnimationFrame(sliderRequestAnimationFrame);
                sliderRequestAnimationFrame = null;
            }
            var detail = event.detail;
            isMoved = false;
            var action = 'close';
            var actionsWidth = sliderDirection === 'toLeft' ? sliderActionRightWidth : sliderActionLeftWidth;
            var isToggle = detail.swipe || (Math.abs(translateX) > actionsWidth / 2);
            if (isToggle) {
                if (!isOpened) {
                    action = 'open';
                } else if (detail.direction === 'left' && openedActions === 'right') {
                    action = 'open';
                } else if (detail.direction === 'right' && openedActions === 'left') {
                    action = 'open';
                }

            }
            cell.classList.add(CLASS_TRANSITIONING);
            var buttons;
            if (action === 'open') {
                var newTranslate = sliderDirection === 'toLeft' ? -actionsWidth : actionsWidth;
                setTranslate(sliderHandle, newTranslate);
                buttons = sliderDirection === 'toLeft' ? buttonsRight : buttonsLeft;
                if (typeof buttons !== 'undefined') {
                    var button = null;
                    for (var i = 0; i < buttons.length; i++) {
                        button = buttons[i];
                        setTranslate(button, newTranslate);
                    }
                    button.parentNode.classList.add(CLASS_SELECTED);
                    cell.classList.add(CLASS_SELECTED);
                    if (!isOpened) {
                        $.trigger(cell, sliderDirection === 'toLeft' ? 'slideleft' : 'slideright');
                    }
                }
            } else {
                setTranslate(sliderHandle, 0);
                sliderActionLeft && sliderActionLeft.classList.remove(CLASS_SELECTED);
                sliderActionRight && sliderActionRight.classList.remove(CLASS_SELECTED);
                cell.classList.remove(CLASS_SELECTED);
            }
            var buttonOffset;
            if (buttonsLeft && buttonsLeft.length > 0 && buttonsLeft !== buttons) {
                for (var i = 0, len = buttonsLeft.length; i < len; i++) {
                    var buttonLeft = buttonsLeft[i];
                    buttonOffset = buttonLeft._buttonOffset;
                    if (typeof buttonOffset === 'undefined') {
                        buttonLeft._buttonOffset = sliderActionLeftWidth - buttonLeft.offsetLeft - buttonLeft.offsetWidth;
                    }
                    setTranslate(buttonLeft, buttonOffset);
                }
            }
            if (buttonsRight && buttonsRight.length > 0 && buttonsRight !== buttons) {
                for (var i = 0, len = buttonsRight.length; i < len; i++) {
                    var buttonRight = buttonsRight[i];
                    buttonOffset = buttonRight._buttonOffset;
                    if (typeof buttonOffset === 'undefined') {
                        buttonRight._buttonOffset = buttonRight.offsetLeft;
                    }
                    setTranslate(buttonRight, -buttonOffset);
                }
            }
        }
    };

    function toggleEvents(element, isRemove) {
        var method = !!isRemove ? 'removeEventListener' : 'addEventListener';
        element[method]('drag', handleEvent);
        element[method]('dragend', handleEvent);
        element[method]('swiperight', handleEvent);
        element[method]('swipeleft', handleEvent);
        element[method]('flick', handleEvent);
    };
    /**
     * 打开滑动菜单
     * @param {Object} el
     * @param {Object} direction
     */
    $.swipeoutOpen = function(el, direction) {
        if (!el) return;
        var classList = el.classList;
        if (classList.contains(CLASS_SELECTED)) return;
        if (!direction) {
            if (el.querySelector(SELECTOR_SLIDER_RIGHT)) {
                direction = 'right';
            } else {
                direction = 'left';
            }
        }
        var swipeoutAction = el.querySelector($.classSelector(".slider-" + direction));
        if (!swipeoutAction) return;
        swipeoutAction.classList.add(CLASS_SELECTED);
        classList.add(CLASS_SELECTED);
        classList.remove(CLASS_TRANSITIONING);
        var buttons = swipeoutAction.querySelectorAll(SELECTOR_BUTTON);
        var swipeoutWidth = swipeoutAction.offsetWidth;
        var translate = (direction === 'right') ? -swipeoutWidth : swipeoutWidth;
        var length = buttons.length;
        var button;
        for (var i = 0; i < length; i++) {
            button = buttons[i];
            if (direction === 'right') {
                setTranslate(button, -button.offsetLeft);
            } else {
                setTranslate(button, (swipeoutWidth - button.offsetWidth - button.offsetLeft));
            }
        }
        classList.add(CLASS_TRANSITIONING);
        for (var i = 0; i < length; i++) {
            setTranslate(buttons[i], translate);
        }
        setTranslate(el.querySelector(SELECTOR_SLIDER_HANDLE), translate);
    };
    /**
     * 关闭滑动菜单
     * @param {Object} el
     */
    $.swipeoutClose = function(el) {
        if (!el) return;
        var classList = el.classList;
        if (!classList.contains(CLASS_SELECTED)) return;
        var direction = el.querySelector(SELECTOR_SLIDER_RIGHT + SELECTOR_SELECTED) ? 'right' : 'left';
        var swipeoutAction = el.querySelector($.classSelector(".slider-" + direction));
        if (!swipeoutAction) return;
        swipeoutAction.classList.remove(CLASS_SELECTED);
        classList.remove(CLASS_SELECTED);
        classList.add(CLASS_TRANSITIONING);
        var buttons = swipeoutAction.querySelectorAll(SELECTOR_BUTTON);
        var swipeoutWidth = swipeoutAction.offsetWidth;
        var length = buttons.length;
        var button;
        setTranslate(el.querySelector(SELECTOR_SLIDER_HANDLE), 0);
        for (var i = 0; i < length; i++) {
            button = buttons[i];
            if (direction === 'right') {
                setTranslate(button, (-button.offsetLeft));
            } else {
                setTranslate(button, (swipeoutWidth - button.offsetWidth - button.offsetLeft));
            }
        }
    };

    window.addEventListener('touchend', function(event) { //使用touchend来取消高亮，避免一次点击既不触发tap，doubletap，longtap的事件
        if (!cell) {
            return;
        }
        toggleActive(false);
        sliderHandle && toggleEvents(cell, true);
    });
    window.addEventListener('touchcancel', function(event) { //使用touchcancel来取消高亮，避免一次点击既不触发tap，doubletap，longtap的事件
        if (!cell) {
            return;
        }
        toggleActive(false);
        sliderHandle && toggleEvents(cell, true);
    });
    var radioOrCheckboxClick = function(event) {
        var type = event.target && event.target.type || '';
        if (type === 'radio' || type === 'checkbox') {
            return;
        }
        var classList = cell.classList;
        if (classList.contains('ryui-radio')) {
            var input = cell.querySelector('input[type=radio]');
            if (input) {
                //				input.click();
                input.checked = !input.checked;
                $.trigger(input, 'change');
            }
        } else if (classList.contains('ryui-checkbox')) {
            var input = cell.querySelector('input[type=checkbox]');
            if (input) {
                //				input.click();
                input.checked = !input.checked;
                $.trigger(input, 'change');
            }
        }
    };
    //fixed hashchange(android)
    window.addEventListener($.EVENT_CLICK, function(e) {
        if (cell && cell.classList.contains('ryui-collapse')) {
            e.preventDefault();
        }
    });
    window.addEventListener('doubletap', function(event) {
        if (cell) {
            radioOrCheckboxClick(event);
        }
    });
    var preventDefaultException = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;
    window.addEventListener('tap', function(event) {
        //XXX 对于不支持触屏的PC，提供click支持
        var touchSupport = ('ontouchstart' in document);
        if(!touchSupport && event.target.classList.contains('ryui-navigate-right')){
            cell = event.target.parentNode;
        }
        if (!cell) {
            return;
        }
        var isExpand = false;
        var classList = cell.classList;
        var ul = cell.parentNode;
        if (ul && ul.classList.contains(CLASS_RADIO_VIEW)) {
            if (classList.contains(CLASS_SELECTED)) {
                return;
            }
            var selected = ul.querySelector('li' + SELECTOR_SELECTED);
            if (selected) {
                selected.classList.remove(CLASS_SELECTED);
            }
            classList.add(CLASS_SELECTED);
            $.trigger(cell, 'selected', {
                el: cell
            });
            return;
        }
        if (classList.contains('ryui-collapse') && !cell.parentNode.classList.contains('ryui-unfold')) {
            if (!preventDefaultException.test(event.target.tagName)) {
                event.detail.gesture.preventDefault();
            }

            if (!classList.contains(CLASS_ACTIVE)) { //展开时,需要收缩其他同类
                var collapse = cell.parentNode.querySelector('.ryui-collapse.ryui-active');
                if (collapse) {
                    collapse.classList.remove(CLASS_ACTIVE);
                }
                isExpand = true;
            }
            classList.toggle(CLASS_ACTIVE);
            if (isExpand) {
                //触发展开事件
                $.trigger(cell, 'expand');

                //scroll
                //暂不滚动
                // var offsetTop = $.offset(cell).top;
                // var scrollTop = document.body.scrollTop;
                // var height = window.innerHeight;
                // var offsetHeight = cell.offsetHeight;
                // var cellHeight = (offsetTop - scrollTop + offsetHeight);
                // if (offsetHeight > height) {
                // 	$.scrollTo(offsetTop, 300);
                // } else if (cellHeight > height) {
                // 	$.scrollTo(cellHeight - height + scrollTop, 300);
                // }
            }
        } else {
            radioOrCheckboxClick(event);
        }
    });
})(ryui, window, document);
/**
 * Input(TODO resize)
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 */
(function($, window, document) {
    var CLASS_ICON = 'ryui-icon';
    var CLASS_ICON_CLEAR = 'ryui-icon-clear';
    var CLASS_ICON_SPEECH = 'ryui-icon-speech';
    var CLASS_ICON_SEARCH = 'ryui-icon-search';
    var CLASS_INPUT_ROW = 'ryui-input-row';
    var CLASS_PLACEHOLDER = 'ryui-placeholder';
    var CLASS_TOOLTIP = 'ryui-tooltip';
    var CLASS_HIDDEN = 'ryui-hidden';
    var CLASS_FOCUSIN = 'ryui-focusin';
    var SELECTOR_ICON_CLOSE = '.' + CLASS_ICON_CLEAR;
    var SELECTOR_ICON_SPEECH = '.' + CLASS_ICON_SPEECH;
    var SELECTOR_PLACEHOLDER = '.' + CLASS_PLACEHOLDER;
    var SELECTOR_TOOLTIP = '.' + CLASS_TOOLTIP;

    var findRow = function(target) {
        for (; target && target !== document; target = target.parentNode) {
            if (target.classList && target.classList.contains(CLASS_INPUT_ROW)) {
                return target;
            }
        }
        return null;
    };
    var Input = function(element, options) {
        this.element = element;
        this.options = options || {
                actions: 'clear'
            };
        if (~this.options.actions.indexOf('slider')) { //slider
            this.sliderActionClass = CLASS_TOOLTIP + ' ' + CLASS_HIDDEN;
            this.sliderActionSelector = SELECTOR_TOOLTIP;
        } else { //clear,speech,search
            if (~this.options.actions.indexOf('clear')) {
                this.clearActionClass = CLASS_ICON + ' ' + CLASS_ICON_CLEAR + ' ' + CLASS_HIDDEN;
                this.clearActionSelector = SELECTOR_ICON_CLOSE;
            }
            if (~this.options.actions.indexOf('speech')) { //only for 5+
                this.speechActionClass = CLASS_ICON + ' ' + CLASS_ICON_SPEECH;
                this.speechActionSelector = SELECTOR_ICON_SPEECH;
            }
            if (~this.options.actions.indexOf('search')) {
                this.searchActionClass = CLASS_PLACEHOLDER;
                this.searchActionSelector = SELECTOR_PLACEHOLDER;
            }
        }
        this.init();
    };
    Input.prototype.init = function() {
        this.initAction();
        this.initElementEvent();
    };
    Input.prototype.initAction = function() {
        var self = this;

        var row = self.element.parentNode;
        if (row) {
            if (self.sliderActionClass) {
                self.sliderAction = self.createAction(row, self.sliderActionClass, self.sliderActionSelector);
            } else {
                if (self.searchActionClass) {
                    self.searchAction = self.createAction(row, self.searchActionClass, self.searchActionSelector);
                    self.searchAction.addEventListener('tap', function(e) {
                        $.focus(self.element);
                        e.stopPropagation();
                    });
                }
                if (self.speechActionClass) {
                    self.speechAction = self.createAction(row, self.speechActionClass, self.speechActionSelector);
                    self.speechAction.addEventListener('click', $.stopPropagation);
                    self.speechAction.addEventListener('tap', function(event) {
                        self.speechActionClick(event);
                    });
                }
                if (self.clearActionClass) {
                    self.clearAction = self.createAction(row, self.clearActionClass, self.clearActionSelector);
                    self.clearAction.addEventListener('tap', function(event) {
                        self.clearActionClick(event);
                    });

                }
            }
        }
    };
    Input.prototype.createAction = function(row, actionClass, actionSelector) {
        var action = row.querySelector(actionSelector);
        if (!action) {
            var action = document.createElement('span');
            action.className = actionClass;
            if (actionClass === this.searchActionClass) {
                action.innerHTML = '<span class="' + CLASS_ICON + ' ' + CLASS_ICON_SEARCH + '"></span><span>' + this.element.getAttribute('placeholder') + '</span>';
                this.element.setAttribute('placeholder', '');
                if (this.element.value.trim()) {
                    row.classList.add('ryui-active');
                }
            }
            row.insertBefore(action, this.element.nextSibling);
        }
        return action;
    };
    Input.prototype.initElementEvent = function() {
        var element = this.element;

        if (this.sliderActionClass) {
            var tooltip = this.sliderAction;
            //TODO resize
            var offsetLeft = element.offsetLeft;
            var width = element.offsetWidth - 28;
            var tooltipWidth = tooltip.offsetWidth;
            var distince = Math.abs(element.max - element.min);

            var timer = null;
            var showTip = function() {
                tooltip.classList.remove(CLASS_HIDDEN);
                tooltipWidth = tooltipWidth || tooltip.offsetWidth;
                var scaleWidth = (width / distince) * Math.abs(element.value - element.min);
                tooltip.style.left = (14 + offsetLeft + scaleWidth - tooltipWidth / 2) + 'px';
                tooltip.innerText = element.value;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function() {
                    tooltip.classList.add(CLASS_HIDDEN);
                }, 1000);
            };
            element.addEventListener('input', showTip);
            element.addEventListener('tap', showTip);
            element.addEventListener('touchmove', function(e) {
                e.stopPropagation();
            });
        } else {
            if (this.clearActionClass) {
                var action = this.clearAction;
                if (!action) {
                    return;
                }
                $.each(['keyup', 'change', 'input', 'focus', 'cut', 'paste'], function(index, type) {
                    (function(type) {
                        element.addEventListener(type, function() {
                            action.classList[element.value.trim() ? 'remove' : 'add'](CLASS_HIDDEN);
                        });
                    })(type);
                });
                element.addEventListener('blur', function() {
                    action.classList.add(CLASS_HIDDEN);
                });
            }
            if (this.searchActionClass) {
                element.addEventListener('focus', function() {
                    element.parentNode.classList.add('ryui-active');
                });
                element.addEventListener('blur', function() {
                    if (!element.value.trim()) {
                        element.parentNode.classList.remove('ryui-active');
                    }
                });
            }
        }
    };
    Input.prototype.setPlaceholder = function(text) {
        if (this.searchActionClass) {
            var placeholder = this.element.parentNode.querySelector(SELECTOR_PLACEHOLDER);
            placeholder && (placeholder.getElementsByTagName('span')[1].innerText = text);
        } else {
            this.element.setAttribute('placeholder', text);
        }
    };
    Input.prototype.clearActionClick = function(event) {
        var self = this;
        self.element.value = '';
        $.focus(self.element);
        self.clearAction.classList.add(CLASS_HIDDEN);
        $.trigger(self.element, 'change');
        $.trigger(self.element, 'input');
        event.preventDefault();
    };
    Input.prototype.speechActionClick = function(event) {
        if (window.plus) {
            var self = this;
            var oldValue = self.element.value;
            self.element.value = '';
            document.body.classList.add(CLASS_FOCUSIN);
            plus.speech.startRecognize({
                engine: 'iFly'
            }, function(s) {
                self.element.value += s;
                $.focus(self.element);
                plus.speech.stopRecognize();
                $.trigger(self.element, 'recognized', {
                    value: self.element.value
                });
                if (oldValue !== self.element.value) {
                    $.trigger(self.element, 'change');
                    $.trigger(self.element, 'input');
                }
                // document.body.classList.remove(CLASS_FOCUSIN);
            }, function(e) {
                document.body.classList.remove(CLASS_FOCUSIN);
            });
        } else {
            alert('only for 5+');
        }
        event.preventDefault();
    };
    $.fn.input = function(options) {
        var inputApis = [];
        this.each(function() {
            var inputApi = null;
            var actions = [];
            var row = findRow(this.parentNode);
            if (this.type === 'range' && row.classList.contains('ryui-input-range')) {
                actions.push('slider');
            } else {
                var classList = this.classList;
                if (classList.contains('ryui-input-clear')) {
                    actions.push('clear');
                }
                if (classList.contains('ryui-input-speech')) {
                    actions.push('speech');
                }
                if (this.type === 'search' && row.classList.contains('ryui-search')) {
                    actions.push('search');
                }
            }
            var id = this.getAttribute('data-input-' + actions[0]);
            if (!id) {
                id = ++$.uuid;
                inputApi = $.data[id] = new Input(this, {
                    actions: actions.join(',')
                });
                for (var i = 0, len = actions.length; i < len; i++) {
                    this.setAttribute('data-input-' + actions[i], id);
                }
            } else {
                inputApi = $.data[id];
            }
            inputApis.push(inputApi);
        });
        return inputApis.length === 1 ? inputApis[0] : inputApis;
    };
    $.ready(function() {
        $('.ryui-input-row input').input();
    });
})(ryui, window, document);
/**
 * 数字输入框
 * varstion 1.0.1
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($) {

    var touchSupport = ('ontouchstart' in document);
    var tapEventName = touchSupport ? 'tap' : 'click';
    var changeEventName = 'change';
    //var holderClassName = 'ryui-numbox';
    var plusClassName = 'ryui-numbox-btn-plus';
    var minusClassName = 'ryui-numbox-btn-minus';
    var inputClassName = 'ryui-numbox-input';

    var Numbox = $.Numbox = $.Class.extend({
        init: function(holder, options) {
            var self = this;
            if (!holder) {
                throw "构造 numbox 时缺少容器元素";
            }
            self.holder = holder;
            //避免重复初始化开始
            if (self.holder.__numbox_inited) return;
            self.holder.__numbox_inited = true;
            //避免重复初始化结束
            options = options || {};
            options.step = parseInt(options.step || 1);
            self.options = options;
            self.input = $.qsa('.' + inputClassName, self.holder)[0];
            self.plus = $.qsa('.' + plusClassName, self.holder)[0];
            self.minus = $.qsa('.' + minusClassName, self.holder)[0];
            self.checkValue();
            self.initEvent();
        },
        initEvent: function() {
            var self = this;
            self.plus.addEventListener(tapEventName, function(event) {
                var val = parseInt(self.input.value) + self.options.step;
                self.input.value = val.toString();
                $.trigger(self.input, changeEventName, null);
                if(self.options.callback) {
                    self.options.callback(val, self, "plus");
                    return false;
                }
            });
            self.minus.addEventListener(tapEventName, function(event) {
                var val = parseInt(self.input.value) - self.options.step;
                self.input.value = val.toString();
                $.trigger(self.input, changeEventName, null);
                if(self.options.callback) {
                    self.options.callback(val, self, "minus");
                    return false;
                }
            });
            self.input.addEventListener(changeEventName, function(event) {
                self.checkValue();
            });
        },
        checkValue: function() {
            var self = this;
            var val = self.input.value;
            if (val == null || val == '' || isNaN(val)) {
                self.input.value = self.options.min || 0;
                self.minus.disabled = self.options.min != null;
            } else {
                var val = parseInt(val);
                if (self.options.max != null && !isNaN(self.options.max) && val >= parseInt(self.options.max)) {
                    val = self.options.max;
                    self.plus.disabled = true;
                } else {
                    self.plus.disabled = false;
                }
                if (self.options.min != null && !isNaN(self.options.min) && val <= parseInt(self.options.min)) {
                    val = self.options.min;
                    self.minus.disabled = true;
                } else {
                    self.minus.disabled = false;
                }
                self.input.value = val;
            }
        }
    });

    $.fn.numbox = function(options) {
        //遍历选择的元素
        this.each(function(i, element) {
            var optionsText = element.getAttribute('data-numbox-options');
            options=$.extend(true,  optionsText ? JSON.parse(optionsText) : {}, options || {});
            options.step = element.getAttribute('data-numbox-step') || options.step;
            options.min = element.getAttribute('data-numbox-min') || options.min;
            options.max = element.getAttribute('data-numbox-max') || options.max;
            new Numbox(element, options);

        });
        return this;
    }

    //自动处理 class='ryui-locker' 的 dom
    // $.ready(function() {
    // 	$('.' + holderClassName).numbox();
    // });
}(ryui));
/**
 *
 * @module ryui
 * @class util
 * @version 1.0.0
 *
 */
(function($) {
    /**
     * 过滤字符串，去掉头尾空格
     * @method trim
     * @param  {String} str 必选 字符串
     * @returns {String}  去掉空格的字符串
     */
    $.trim=function(str) {
        if (String.prototype.trim) {
            return str == null ? "" : String.prototype.trim.call(str);
        } else {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    };

    /**
     * 过滤所有字符串，去掉所有的空格
     * @method trimAll
     * @param  {String} str 必选 字符串
     * @returns {String} 去掉空格的字符串
     */
    $.trimAll=function(str){
        return str.replace(/\s*/g,'');
    };

    /**
     * 过滤所有字符串，将匹配正则表达式字符替换为指定的字符
     * @method replaceAll
     * @param  {String} regexp 必选 正则表达式
     * @param  {String} str 必选 指定替换的字符
     * @returns {String} 处理后的字符串
     */
    String.prototype.replaceAll=function(regexp,str){
        return this.replace(new RegExp(regexp,"gm"),str);
    };

    /**
     * json转字符串,并且将双引号转为&quot;
     * @method jsonToStrForDiv
     * @param  {object} json 必选 转换的对象
     * @returns {string} 字符串
     */
    $.jsonToStrForDiv = function obj2String(obj){
        return JSON && JSON.stringify(obj).replaceAll('"','&quot;');
    };

    /**
     * json转字符串
     * @method jsonToStr
     * @param  {object} json 必选 转换的对象
     * @returns {string} 字符串
     */
    $.jsonToStr=function(json){
        if(typeof json === 'object'){
            return JSON && JSON.stringify(json);
        }
    };

    /**
     * 字符串转json
     * @method strToJson
     * @param  {string} str 必选 转换的字符串
     * @returns {object} json对象
     */
    $.strToJson=function(str){
        if(typeof str === 'string'){
            return JSON && JSON.parse(str);
        }
    };

    /**
     * 格式化金额
     * @param {number} m 必选 金额
     * @param {int} n 可选 保留几位小数默认2位
     * @returns {number} 返回格式化后的金额
     */
    $.formatMoney=function(m, n) {
        var n = n || 2;
        if(typeof m != 'number') {
            m = Number(m);
        }
        var _j = Math.pow(10, n);
        m = (Math.ceil(m * _j)) / _j;
        return m.toFixed(n);
    };

    /**
     * 通过经纬度计算距离
     * @method getFlatternDistance
     * @param  {number} lng1 必选  第一个点的经度
     * @param  {number} lat1 必选  第一个点的纬度
     * @param  {number} lng2 必选 第二个点的经度
     * @param  {number} lat2 必选 第二个点的纬度
     * @returns {number}  两点的距离  单位米
     */
    $.getFlatternDistance=function(lng1, lat1, lng2, lat2) {
        var EARTH_RADIUS = 6378137.0;    //单位M
        var PI = Math.PI;

        function getRad(d){
            return d*PI/180.0;
        }

        var f = getRad((lat1 + lat2)/2);
        var g = getRad((lat1 - lat2)/2);
        var l = getRad((lng1 - lng2)/2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s,c,w,r,d,h1,h2;
        var a = EARTH_RADIUS;
        var fl = 1/298.257;

        sg = sg*sg;
        sl = sl*sl;
        sf = sf*sf;

        s = sg*(1-sl) + (1-sf)*sl;
        c = (1-sg)*(1-sl) + sf*sl;

        w = Math.atan(Math.sqrt(s/c));
        r = Math.sqrt(s*c)/w;
        d = 2*w*a;
        h1 = (3*r -1)/2/c;
        h2 = (3*r +1)/2/s;

        return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
    };

    /**
     * 转化为浮点数
     * @method floatAdd
     * @param {Number} f 必选 Number对象
     * @param {Number} digit 可选 保留小数位数（默认10位，f末尾为0则省略）
     * @return {Number}
     */
    $.formatFloat=function(f, digit) {
        if(!digit)digit=10;
        var m = Math.pow(10, digit);
        return parseInt(f * m, 10) / m;
    };
})(ryui);
/**
 *
 * @module ryui
 * @class validate
 * @version 1.0.0
 *
 */
(function($) {
    /** formValidate
     * 表单验证
     * @method isElement
     * @param  {function} callback 可选 校验成功回调
     **/
    $.fn.formValidate=function(callback){
        var CLASS_WARN = 'ryui-warn';
        var elements = this[0].elements;
        $.each(elements,function(index,item){
            $(item).on('change',function(e){
                validate(e.target);
            });
            $(item).on('input',function(e){
                validate(e.target);
            });
            $(item).on('invalid',function(e){
                e.target.parentNode.classList.add(CLASS_WARN);
            });
        });
        $(this).on('submit',function(e){
            $.each(elements,function(index,item){
                if(!validate(item))return false;
            });
            if(callback)callback();
            return false;
        });

        function validate(item){
            if(item.tagName.toLowerCase() !=='button'){
                var parent = item.parentNode;
                var isValid = item.checkValidity();
                if(isValid){
                    parent.classList.remove(CLASS_WARN);
                } else{
                    parent.classList.add(CLASS_WARN)
                    return false;
                }
            }
            return true;
        }
    };
    /**
     * 是否为元素
     * @method isElement
     * @param  {Object} obj 必选 判断的对象
     * @returns {boolean} true/false 是返回true不是返回false
     */
    $.isElement=function(obj){
        return !!(obj && obj.nodeType == 1);
    };
    /**
     * 验证是否是手机号码
     * @method isMobilePhone
     * @param {string} mp 必选 手机号码
     * @returns {object} true/fasle
     */
    $.isMobilePhone=function(mp) {
        return /^1[3|4|5|8][0-9]\d{8}$/.test(mp);
    };
    /**
     * 验证是否是正整数不包含0
     * @method isInteger
     * @param {String} str 必选 字符串
     * @returns {boolean} true/fasle
     */
    $.isInteger=function(str) {
        return /^[1-9]\d*$/.test(str);
    };
    /**
     * 验证是否是正整数包含0
     * @method isIntegerConZero
     * @param {string} str 字符串
     * @returns {boolean} true/fasle
     */
    $.isIntegerConZero=function(str) {
        return /^[1-9]\d*|0$/.test(str);
    };
    /**
     * 验证是否是数字(包括整数和浮点数)
     * @method isIntegerConZero
     * @param {string} str 字符串
     * @returns {boolean} true/fasle
     */
    $.isNumber=function(str){
        return $.type(str)==='number';
    };
    /**
     * 验证是否是Email
     * @method isEmail
     * @param {string} str 字符串
     * @returns {boolean} true/fasle
     */
    $.isEmail=function(str){
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(str);
    };
    /**
     * 验证是否是URL
     * @method isUrl
     * @param {string} str 字符串
     * @returns {boolean} true/fasle
     */
    $.isUrl=function(str){
        return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(str);
    };
    /**
     * 验证是否是中文字符
     * @method isChinese
     * @param {string} str 字符串
     * @returns {boolean} true/fasle
     */
    $.isChinese=function(str){
        return /^[\u4e00-\u9fa5]+$/.test(str);
    };
    /**
     * 验证是否是IP地址
     * @method isIp
     * @param {string} str 字符串
     * @returns {boolean} true/fasle
     */
    $.isIp=function(str){
        return /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/.test(str);
    };
    /**
     * 验证是否是合法的身份证号
     * @method isIdcard
     * @param {string} str 字符串
     * @returns {boolean} true/fasle
     */
    $.isIdcard=function(str){
        var sId = str;
        if (sId.length == 15) {
            if(!/^\d{14}(\d|x)$/i.test(sId)){
                return false;
            } else  {
                sId=sId.substr(0,6)+'19'+sId.substr(6,9);
                sId+= getVCode(sId);
            }
        }
        function getVCode(CardNo17) {
            var Wi = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
            var Ai = new Array('1','0','X','9','8','7','6','5','4','3','2');
            var cardNoSum = 0;
            for (var i=0; i<CardNo17.length; i++)cardNoSum+=CardNo17.charAt(i)*Wi[i];
            var seq = cardNoSum%11;
            return Ai[seq];
        }
        var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} ;

        var iSum=0 ;
        var info="" ;
        if(!/^\d{17}(\d|x)$/i.test(sId)){
            return false;
        }
        sId=sId.replace(/x$/i,"a");
        if(aCity[parseInt(sId.substr(0,2))]==null){
            return false;
        }
        sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
        var d=new Date(sBirthday.replace(/-/g,"/")) ;
        if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
            return false;
        }
        for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
        if(iSum%11!=1){
            return false;
        }
        return true;
    }
})(ryui);
/**
 *
 * @module ryui
 * @class storage
 * @version 1.0.0
 *
 */
(function($,window) {
    /**
     * 存入本地存储
     *
     * @method setStorage
     * @param {String} key 必选 键
     * @param {Object} value 必选 值
     */
    $.setStorage=function(key, value) {
        if (window.localStorage) {
            window.localStorage[key] = value;
        } else {
            alert('localStorage null');
        }
    };
    /**
     * 获取本地存储
     *
     * @method getStorage
     * @required {String} key 必选 键
     * @return {Object} 返回对应的值
     */
    $.getStorage=function(key) {
        if (window.localStorage) {
            var i;
            for (i in window.localStorage) {
                if (i == key)
                    return window.localStorage[i];
            }
        } else {
            alert('localStorage error');
        }
    };
    /**
     * 清除对应key的本地存储
     *
     * @method clearStorage
     * @param {String} key 必选 键
     */
    $.clearStorage=function(key) {
        if (window.localStorage) {
            if (key) {
                window.localStorage.removeItem(key);
            }
        } else {
            alert('localStorage error');
        }
    }
    /**
     * 清除所有的键值对
     *
     * @method clearAllStorage
     */
    $.clearAllStorage=function() {
        if (window.localStorage) {
            window.localStorage.clear();
        }
    }
})(ryui,window);
/**
 * ryui back
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {

    var CLASS_ACTION = 'ryui-action';
    var handle = function(event, target) {
        var className = target.className || '';
        if (typeof className !== 'string') { //svg className(SVGAnimatedString)
            className = '';
        }
        if (className && ~className.indexOf(CLASS_ACTION)) {
            if (target.classList.contains('ryui-action-back')) {
                event.preventDefault();
            }
            return target;
        }
        return false;
    };

    $.registerTarget({
        name: 'action',
        index: 50,
        handle: handle,
        target: false,
        isContinue: true
    });

    /**
     * register back
     * @param {type} back
     * @returns {$.gestures}
     */
    $.addBack = function(back) {
        return $.addAction('backs', back);
    };
    /**
     * default
     */
    $.addBack({
        name: 'browser',
        index: 100,
        handle: function() {
            $.closeWin();
            return true;
        }
    });

    /**
     * 后退
     */
    $.back = function() {
        if (typeof $.options.beforeback === 'function') {
            if ($.options.beforeback() === false) {
                return;
            }
        }
        $.doAction('backs');
    };
    window.addEventListener('tap', function(e) {
        var action = $.targets.action;
        if (action && action.classList.contains('ryui-action-back')) {
            $.back();
        }
    });

    window.addEventListener('swiperight', function(e) {
        var detail = e.detail;
        if ($.options.swipeBack === true && Math.abs(detail.angle) < 3) {
            //$.back();//TODO 
        }
    });
})(ryui, window);
/**
 *
 * @module ryui
 * @class ajax
 * @version 1.0.0
 *
 */
(function($, window) {
    $.serverSettings={
        serverPath:"",
        urlPath:{}
    };
    $.request=function(options,callback){
        var method=options['method'] || "post";
        var urlType=options['urlType'];
        var url="";
        if(!$.isExist(urlType)||!$.isExist($.serverSettings.urlPath[urlType])){
            $.toast("请求地址不存在!");
            return;
        }else{
            url=$.serverSettings.serverPath+$.serverSettings.urlPath[urlType];
        }
        $.ajaxSettings.error=function(){
            $.toast('网络错误!');
        };
        var success=function(response){
            if(typeof callback == "function") {
                callback(response);
            }
        }
        if(method=="get"){
            $.getJSON(url,  options.data, success);
        }else{
            $.post(url, options.data, success, "json");
        }
    }
})(ryui, window);
/**
 * use juicer 0.6.9-stable
 */
(function($) {
    var juicer = function() {
        var args = [].slice.call(arguments);

        args.push(juicer.options);

        if(args[0].match(/^\s*#([\w:\-\.]+)\s*$/igm)) {
            args[0].replace(/^\s*#([\w:\-\.]+)\s*$/igm, function($, $id) {
                var _document = document;
                var elem = _document && _document.getElementById($id);
                args[0] = elem ? (elem.value || elem.innerHTML) : $;
            });
        }

        if(typeof(document) !== 'undefined' && document.body) {
            juicer.compile.call(juicer, document.body.innerHTML);
        }

        if(arguments.length == 1) {
            return juicer.compile.apply(juicer, args);
        }

        if(arguments.length >= 2) {
            return juicer.to_html.apply(juicer, args);
        }
    };

    var __escapehtml = {
        escapehash: {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2f;'
        },
        escapereplace: function(k) {
            return __escapehtml.escapehash[k];
        },
        escaping: function(str) {
            return typeof(str) !== 'string' ? str : str.replace(/[&<>"]/igm, this.escapereplace);
        },
        detection: function(data) {
            return typeof(data) === 'undefined' ? '' : data;
        }
    };

    var __throw = function(error) {
        if(typeof(console) !== 'undefined') {
            if(console.warn) {
                console.warn(error);
                return;
            }

            if(console.log) {
                console.log(error);
                return;
            }
        }

        throw(error);
    };

    var __creator = function(o, proto) {
        o = o !== Object(o) ? {} : o;

        if(o.__proto__) {
            o.__proto__ = proto;
            return o;
        }

        var empty = function() {};
        var n = Object.create ?
            Object.create(proto) :
            new(empty.prototype = proto, empty);

        for(var i in o) {
            if(o.hasOwnProperty(i)) {
                n[i] = o[i];
            }
        }

        return n;
    };

    var annotate = function(fn) {
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;
        var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        var FN_BODY = /^function[^{]+{([\s\S]*)}/m;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var args = [],
            fnText,
            fnBody,
            argDecl;

        if (typeof fn === 'function') {
            if (fn.length) {
                fnText = fn.toString();
            }
        } else if(typeof fn === 'string') {
            fnText = fn;
        }

        fnText = fnText.trim();
        argDecl = fnText.match(FN_ARGS);
        fnBody = fnText.match(FN_BODY)[1].trim();

        for(var i = 0; i < argDecl[1].split(FN_ARG_SPLIT).length; i++) {
            var arg = argDecl[1].split(FN_ARG_SPLIT)[i];
            arg.replace(FN_ARG, function(all, underscore, name) {
                args.push(name);
            });
        }

        return [args, fnBody];
    };

    juicer.__cache = {};
    juicer.version = '0.6.9-stable';
    juicer.settings = {};

    juicer.tags = {
        operationOpen: '{@',
        operationClose: '}',
        interpolateOpen: '\\${',
        interpolateClose: '}',
        noneencodeOpen: '\\$\\${',
        noneencodeClose: '}',
        commentOpen: '\\{#',
        commentClose: '\\}'
    };

    juicer.options = {
        cache: true,
        strip: true,
        errorhandling: true,
        detection: true,
        _method: __creator({
            __escapehtml: __escapehtml,
            __throw: __throw,
            __juicer: juicer
        }, {})
    };

    juicer.tagInit = function() {
        var forstart = juicer.tags.operationOpen + 'each\\s*([^}]*?)\\s*as\\s*(\\w*?)\\s*(,\\s*\\w*?)?' + juicer.tags.operationClose;
        var forend = juicer.tags.operationOpen + '\\/each' + juicer.tags.operationClose;
        var ifstart = juicer.tags.operationOpen + 'if\\s*([^}]*?)' + juicer.tags.operationClose;
        var ifend = juicer.tags.operationOpen + '\\/if' + juicer.tags.operationClose;
        var elsestart = juicer.tags.operationOpen + 'else' + juicer.tags.operationClose;
        var elseifstart = juicer.tags.operationOpen + 'else if\\s*([^}]*?)' + juicer.tags.operationClose;
        var interpolate = juicer.tags.interpolateOpen + '([\\s\\S]+?)' + juicer.tags.interpolateClose;
        var noneencode = juicer.tags.noneencodeOpen + '([\\s\\S]+?)' + juicer.tags.noneencodeClose;
        var inlinecomment = juicer.tags.commentOpen + '[^}]*?' + juicer.tags.commentClose;
        var rangestart = juicer.tags.operationOpen + 'each\\s*(\\w*?)\\s*in\\s*range\\(([^}]+?)\\s*,\\s*([^}]+?)\\)' + juicer.tags.operationClose;
        var include = juicer.tags.operationOpen + 'include\\s*([^}]*?)\\s*,\\s*([^}]*?)' + juicer.tags.operationClose;
        var helperRegisterStart = juicer.tags.operationOpen + 'helper\\s*([^}]*?)\\s*' + juicer.tags.operationClose;
        var helperRegisterBody = '([\\s\\S]*?)';
        var helperRegisterEnd = juicer.tags.operationOpen + '\\/helper' + juicer.tags.operationClose;

        juicer.settings.forstart = new RegExp(forstart, 'igm');
        juicer.settings.forend = new RegExp(forend, 'igm');
        juicer.settings.ifstart = new RegExp(ifstart, 'igm');
        juicer.settings.ifend = new RegExp(ifend, 'igm');
        juicer.settings.elsestart = new RegExp(elsestart, 'igm');
        juicer.settings.elseifstart = new RegExp(elseifstart, 'igm');
        juicer.settings.interpolate = new RegExp(interpolate, 'igm');
        juicer.settings.noneencode = new RegExp(noneencode, 'igm');
        juicer.settings.inlinecomment = new RegExp(inlinecomment, 'igm');
        juicer.settings.rangestart = new RegExp(rangestart, 'igm');
        juicer.settings.include = new RegExp(include, 'igm');
        juicer.settings.helperRegister = new RegExp(helperRegisterStart + helperRegisterBody + helperRegisterEnd, 'igm');
    };

    juicer.tagInit();

    // Using this method to set the options by given conf-name and conf-value,
    // you can also provide more than one key-value pair wrapped by an object.
    // this interface also used to custom the template tag delimater, for this
    // situation, the conf-name must begin with tag::, for example: juicer.set
    // ('tag::operationOpen', '{@').

    juicer.set = function(conf, value) {
        var that = this;

        var escapePattern = function(v) {
            return v.replace(/[\$\(\)\[\]\+\^\{\}\?\*\|\.]/igm, function($) {
                return '\\' + $;
            });
        };

        var set = function(conf, value) {
            var tag = conf.match(/^tag::(.*)$/i);

            if(tag) {
                that.tags[tag[1]] = escapePattern(value);
                that.tagInit();
                return;
            }

            that.options[conf] = value;
        };

        if(arguments.length === 2) {
            set(conf, value);
            return;
        }

        if(conf === Object(conf)) {
            for(var i in conf) {
                if(conf.hasOwnProperty(i)) {
                    set(i, conf[i]);
                }
            }
        }
    };

    // Before you're using custom functions in your template like ${name | fnName},
    // you need to register this fn by juicer.register('fnName', fn).

    juicer.register = function(fname, fn) {
        var _method = this.options._method;

        if(_method.hasOwnProperty(fname)) {
            return false;
        }

        return _method[fname] = fn;
    };

    // remove the registered function in the memory by the provided function name.
    // for example: juicer.unregister('fnName').

    juicer.unregister = function(fname) {
        var _method = this.options._method;

        if(_method.hasOwnProperty(fname)) {
            return delete _method[fname];
        }
    };

    juicer.template = function(options) {
        var that = this;

        this.options = options;

        this.__interpolate = function(_name, _escape, options) {
            var _define = _name.split('|'), _fn = _define[0] || '', _cluster;

            if(_define.length > 1) {
                _name = _define.shift();
                _cluster = _define.shift().split(',');
                _fn = '_method.' + _cluster.shift() + '.call({}, ' + [_name].concat(_cluster) + ')';
            }

            return '<%= ' + (_escape ? '_method.__escapehtml.escaping' : '') + '(' +
                (!options || options.detection !== false ? '_method.__escapehtml.detection' : '') + '(' +
                _fn +
                ')' +
                ')' +
                ' %>';
        };

        this.__removeShell = function(tpl, options) {
            var _counter = 0;

            tpl = tpl
            // inline helper register
                .replace(juicer.settings.helperRegister, function($, helperName, fnText) {
                    var anno = annotate(fnText);
                    var fnArgs = anno[0];
                    var fnBody = anno[1];
                    var fn = new Function(fnArgs.join(','), fnBody);

                    juicer.register(helperName, fn);
                    return $;
                })

                // for expression
                .replace(juicer.settings.forstart, function($, _name, alias, key) {
                    var alias = alias || 'value', key = key && key.substr(1);
                    var _iterate = 'i' + _counter++;
                    return '<% ~function() {' +
                        'for(var ' + _iterate + ' in ' + _name + ') {' +
                        'if(' + _name + '.hasOwnProperty(' + _iterate + ')) {' +
                        'var ' + alias + '=' + _name + '[' + _iterate + '];' +
                        (key ? ('var ' + key + '=' + _iterate + ';') : '') +
                        ' %>';
                })
                .replace(juicer.settings.forend, '<% }}}(); %>')

                // if expression
                .replace(juicer.settings.ifstart, function($, condition) {
                    return '<% if(' + condition + ') { %>';
                })
                .replace(juicer.settings.ifend, '<% } %>')

                // else expression
                .replace(juicer.settings.elsestart, function($) {
                    return '<% } else { %>';
                })

                // else if expression
                .replace(juicer.settings.elseifstart, function($, condition) {
                    return '<% } else if(' + condition + ') { %>';
                })

                // interpolate without escape
                .replace(juicer.settings.noneencode, function($, _name) {
                    return that.__interpolate(_name, false, options);
                })

                // interpolate with escape
                .replace(juicer.settings.interpolate, function($, _name) {
                    return that.__interpolate(_name, true, options);
                })

                // clean up comments
                .replace(juicer.settings.inlinecomment, '')

                // range expression
                .replace(juicer.settings.rangestart, function($, _name, start, end) {
                    var _iterate = 'j' + _counter++;
                    return '<% ~function() {' +
                        'for(var ' + _iterate + '=' + start + ';' + _iterate + '<' + end + ';' + _iterate + '++) {{' +
                        'var ' + _name + '=' + _iterate + ';' +
                        ' %>';
                })

                // include sub-template
                .replace(juicer.settings.include, function($, tpl, data) {
                    // compatible for node.js
                    if(tpl.match(/^file\:\/\//igm)) return $;
                    return '<%= _method.__juicer(' + tpl + ', ' + data + '); %>';
                });

            // exception handling
            if(!options || options.errorhandling !== false) {
                tpl = '<% try { %>' + tpl;
                tpl += '<% } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} %>';
            }

            return tpl;
        };

        this.__toNative = function(tpl, options) {
            return this.__convert(tpl, !options || options.strip);
        };

        this.__lexicalAnalyze = function(tpl) {
            var buffer = [];
            var method = [];
            var prefix = '';
            var reserved = [
                'if', 'each', '_', '_method', 'console',
                'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do',
                'finally', 'for', 'function', 'in', 'instanceof', 'new', 'return', 'switch',
                'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'typeof',
                'class', 'enum', 'export', 'extends', 'import', 'super', 'implements', 'interface',
                'let', 'package', 'private', 'protected', 'public', 'static', 'yield', 'const', 'arguments',
                'true', 'false', 'undefined', 'NaN'
            ];

            var indexOf = function(array, item) {
                if (Array.prototype.indexOf && array.indexOf === Array.prototype.indexOf) {
                    return array.indexOf(item);
                }

                for(var i=0; i < array.length; i++) {
                    if(array[i] === item) return i;
                }

                return -1;
            };

            var variableAnalyze = function($, statement) {
                statement = statement.match(/\w+/igm)[0];

                if(indexOf(buffer, statement) === -1 && indexOf(reserved, statement) === -1 && indexOf(method, statement) === -1) {

                    // avoid re-declare native function, if not do this, template 
                    // `{@if encodeURIComponent(name)}` could be throw undefined.

                    if(typeof(window) !== 'undefined' && typeof(window[statement]) === 'function' && window[statement].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i)) {
                        return $;
                    }

                    // compatible for node.js
                    if(typeof(global) !== 'undefined' && typeof(global[statement]) === 'function' && global[statement].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i)) {
                        return $;
                    }

                    // avoid re-declare registered function, if not do this, template 
                    // `{@if registered_func(name)}` could be throw undefined.

                    if(typeof(juicer.options._method[statement]) === 'function' || juicer.options._method.hasOwnProperty(statement)) {
                        method.push(statement);
                        return $;
                    }

                    buffer.push(statement); // fuck ie
                }

                return $;
            };

            tpl.replace(juicer.settings.forstart, variableAnalyze).
            replace(juicer.settings.interpolate, variableAnalyze).
            replace(juicer.settings.ifstart, variableAnalyze).
            replace(juicer.settings.elseifstart, variableAnalyze).
            replace(juicer.settings.include, variableAnalyze).
            replace(/[\+\-\*\/%!\?\|\^&~<>=,\(\)\[\]]\s*([A-Za-z_]+)/igm, variableAnalyze);

            for(var i = 0;i < buffer.length; i++) {
                prefix += 'var ' + buffer[i] + '=_.' + buffer[i] + ';';
            }

            for(var i = 0;i < method.length; i++) {
                prefix += 'var ' + method[i] + '=_method.' + method[i] + ';';
            }

            return '<% ' + prefix + ' %>';
        };

        this.__convert=function(tpl, strip) {
            var buffer = [].join('');

            buffer += "'use strict';"; // use strict mode
            buffer += "var _=_||{};";
            buffer += "var _out='';_out+='";

            if(strip !== false) {
                buffer += tpl
                        .replace(/\\/g, "\\\\")
                        .replace(/[\r\t\n]/g, " ")
                        .replace(/'(?=[^%]*%>)/g, "\t")
                        .split("'").join("\\'")
                        .split("\t").join("'")
                        .replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='")
                        .split("<%").join("';")
                        .split("%>").join("_out+='")+
                    "';return _out;";

                return buffer;
            }

            buffer += tpl
                    .replace(/\\/g, "\\\\")
                    .replace(/[\r]/g, "\\r")
                    .replace(/[\t]/g, "\\t")
                    .replace(/[\n]/g, "\\n")
                    .replace(/'(?=[^%]*%>)/g, "\t")
                    .split("'").join("\\'")
                    .split("\t").join("'")
                    .replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='")
                    .split("<%").join("';")
                    .split("%>").join("_out+='")+
                "';return _out.replace(/[\\r\\n]\\s+[\\r\\n]/g, '\\r\\n');";

            return buffer;
        };

        this.parse = function(tpl, options) {
            var _that = this;

            if(!options || options.loose !== false) {
                tpl = this.__lexicalAnalyze(tpl) + tpl;
            }

            tpl = this.__removeShell(tpl, options);
            tpl = this.__toNative(tpl, options);

            this._render = new Function('_, _method', tpl);

            this.render = function(_, _method) {
                if(!_method || _method !== that.options._method) {
                    _method = __creator(_method, that.options._method);
                }

                return _that._render.call(this, _, _method);
            };

            return this;
        };
    };

    juicer.compile = function(tpl, options) {
        if(!options || options !== this.options) {
            options = __creator(options, this.options);
        }

        try {
            var engine = this.__cache[tpl] ?
                this.__cache[tpl] :
                new this.template(this.options).parse(tpl, options);

            if(!options || options.cache !== false) {
                this.__cache[tpl] = engine;
            }

            return engine;

        } catch(e) {
            __throw('Juicer Compile Exception: ' + e.message);

            return {
                render: function() {} // noop
            };
        }
    };

    juicer.to_html = function(tpl, data, options) {
        if(!options || options !== this.options) {
            options = __creator(options, this.options);
        }

        return this.compile(tpl, options).render(data, options._method);
    };

    // avoid memory leak for node.js
    if(typeof(global) !== 'undefined' && typeof(window) === 'undefined') {
        juicer.set('cache', false);
    }
    $.tmpl=juicer;
})(ryui);
