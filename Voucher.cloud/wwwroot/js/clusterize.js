// 26 is height of tr on table, currently hardcode need to canculate actual tr later on
// if we change value 26 to other here then MUST need to change in control.css file also, describe as below
//.s3tcloud-prefix table tr {
//    height: 26px;
//}
var S3TTableRowHeight = 26;
var S3TScrollBarWidth = 14;//scrollbar width define at ::-webkit-scrollbar control.css
var rows_in_block_clusterize = Math.floor(window.innerHeight / S3TTableRowHeight);
(function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
}('Clusterize', function () {
    "use strict"

    var ie = (function () {
        for (var v = 3,
            el = document.createElement('b'),
            all = el.all || [];
            el.innerHTML = '<!--[if gt IE ' + (++v) + ']><i><![endif]-->',
            all[0];
        ) { }
        return v > 4 ? v : document.documentMode;
    }()),
        is_mac = navigator.platform.toLowerCase().indexOf('mac') + 1;
    var Clusterize = function (data) {
        if (!(this instanceof Clusterize))
            return new Clusterize(data);
        var self = this;

        var defaults = {
            scrollId: null,
            rows_in_block: rows_in_block_clusterize,
            blocks_in_cluster: 4,
            tag: null,
            clusterize_data: null,
            clusterize_S3Table: null,
            show_no_data_row: false,
            no_data_class: 'clusterize-no-data',
            no_data_text: 'No data',
            keep_parity: true,
            callbacks: {}
        }

        // public parameters
        self.options = {};
        var options = ['scrollId', 'rows_in_block', 'blocks_in_cluster', 'show_no_data_row', 'no_data_class', 'no_data_text', 'keep_parity', 'tag', 'clusterize_data', 'clusterize_S3Table', 'callbacks'];
        for (var i = 0, option; option = options[i]; i++) {
            self.options[option] = typeof data[option] != 'undefined' && data[option] != null
                ? data[option]
                : defaults[option];
        }

        var elems = ['scroll', 'content'];
        for (var i = 0, elem; elem = elems[i]; i++) {
            self[elem + '_elem'] = data[elem + 'Id']
                ? document.getElementById(data[elem + 'Id'])
                : data[elem + 'Elem'];
            if (!self[elem + '_elem'])
                throw new Error("Error! Could not find " + elem + " element");
        }

        // tabindex forces the browser to keep focus on the scrolling list, fixes #11
        if (!self.content_elem.hasAttribute('tabindex'))
            self.content_elem.setAttribute('tabindex', 0);

        // private parameters
        var rows = isArray(data.rows)
            ? data.rows
            : self.fetchMarkup(),
            cache = {},
            scroll_top = self.scroll_elem.scrollTop;

        // append initial data
        self.loadToDOM(rows, cache, 'load');

        // restore the scroll position
        self.scroll_elem.scrollTop = scroll_top;

        // adding scroll handler
        var last_cluster = false,
            scroll_debounce = 0,
            pointer_events_set = false,
            prevLeft = 0,
            scrollEv = function (e) {
                var currentLeft = $(this).scrollLeft();
                if (prevLeft != currentLeft) {
                    prevLeft = currentLeft;
                    return;
                }

                if ($(self.content_elem).attr("event-trigger") == "Horizontal") {
                    $(self.content_elem).removeAttr("event-trigger", false);
                    return;
                }
                
                $(self.content_elem).attr("scroll_top", self.scroll_elem.scrollTop);
                let type = "scroll";
                if ($(self.content_elem).attr("scroll-type") == "search") {
                    $(self.content_elem).attr("scroll-type", "scroll");
                    type = "search";
                }
                if (!$(self.content_elem).attr("table_height_position")) {
                    let height = $(self.content_elem).closest(".clusterize-scroll").outerHeight() + $($(self.content_elem).closest(".clusterize-scroll")).offset().top;
                    $(self.content_elem).attr("table_height_position", height);
                }
                
                if (is_mac) {
                    if (!pointer_events_set) self.content_elem.style.pointerEvents = 'none';
                    pointer_events_set = true;
                    clearTimeout(scroll_debounce);
                    scroll_debounce = setTimeout(function () {
                        self.content_elem.style.pointerEvents = 'auto';
                        pointer_events_set = false;
                    }, 50);
                }
                let latest = Math.floor(self.content_elem.offsetHeight / (self.options.cluster_height - self.options.block_height));
                if ((last_cluster != (last_cluster = self.getClusterNum()) || last_cluster == latest || $(self.content_elem).attr("event-trigger") == "Update")) {
                    self.loadToDOM(rows, cache, type);
                }
                    

                if (self.options.callbacks.scrollingProgress)
                    self.options.callbacks.scrollingProgress(self.getScrollProgress());
                if ($(self.content_elem).attr("event-trigger")) {
                    $(self.content_elem).removeAttr("event-trigger");
                }
            },
            resize_debounce = 0,
            resizeEv = function () {
                clearTimeout(resize_debounce);
                resize_debounce = setTimeout(self.refresh, 100);
            }
        on('scroll', self.scroll_elem, scrollEv);
        on('resize', window, resizeEv);

        // public methods
        self.destroy = function (clean) {
            off('scroll', self.scroll_elem, scrollEv);
            off('resize', window, resizeEv);
            self.html((clean ? self.generateEmptyRow() : rows).join(''));
        }        
        self.update = function (new_rows) {
            rows = isArray(new_rows)
                ? new_rows
                : [];
            var scroll_top = self.scroll_elem.scrollTop;
            if (rows.length * self.options.item_height < scroll_top) {
                self.scroll_elem.scrollTop = 0;
                last_cluster = 0;
            }
            self.loadToDOM(rows, cache, 'scroll');
        }
        self.refreshView = function (new_rows, callDetail) {
            rows = isArray(new_rows)
                ? new_rows
                : [];
            var scroll_top = self.scroll_elem.scrollTop;

            if (rows.length * self.options.item_height < scroll_top) {
                self.scroll_elem.scrollTop = 0;
                last_cluster = 0;
            }
            self.loadToDOM(rows, cache, 're-load', null, null, callDetail);
            self.scroll_elem.scrollTop = scroll_top;
        }        
        self.forceUpdate = function (new_rows, index) {
            rows = isArray(new_rows)
                ? new_rows
                : [];

            self.loadToDOM(rows, cache, 'update', index);              
        }
        self.updateRow = function (new_row, element, index, idle) {            
            rows[index] = new_row;
            self.loadToDOM(rows, cache, 'update-row', index, idle, null, element);
        }
        self.clear = function () {
            self.update([]);
            self.scroll_elem.scrollTop = 0;
            self.scroll_elem.scrollLeft = 0;
            $(self.scroll_elem).find(".clusterize-content").attr("horizontal-trigger", "Horizontal");
        }
        self.add = function (_new_rows, index) {
            rows = isArray(_new_rows)
                ? _new_rows
                : [];
            self.loadToDOM(rows, cache, 'add', index);
        }
        self.delete = function (_new_rows) {
            rows = isArray(_new_rows)
                ? _new_rows
                : [];
            self.loadToDOM(rows, cache, 'delete');
        }
        self.getRowsAmount = function () {
            return rows.length;
        }
        self.getScrollProgress = function () {
            return this.options.scroll_top / (rows.length * this.options.item_height) * 100 || 0;
        }
        self.updateData = function(_new_rows){
            rows = isArray(_new_rows) ? _new_rows : rows;
        }
        var add = function (where, _new_rows) {
            var new_rows = isArray(_new_rows)
                ? _new_rows
                : [];
            if (!new_rows.length) return;
            rows = where == 'append'
                ? rows.concat(new_rows)
                : new_rows.concat(rows);
            self.loadToDOM(rows, cache);
        }
        self.append = function (rows) {
            add('append', rows);
        }
        self.prepend = function (rows) {
            add('prepend', rows);
        }
    }

    Clusterize.prototype = {
        constructor: Clusterize,
        // fetch existing markup
        fetchMarkup: function () {
            var rows = [], rows_nodes = this.getChildNodes(this.content_elem);
            while (rows_nodes.length) {
                rows.push(rows_nodes.shift().outerHTML);
            }
            return rows;
        },
        // get tag name, content tag name, tag height, calc cluster height
        exploreEnvironment: function (rows, cache) {
            var opts = this.options;
            opts.content_tag = this.content_elem.tagName.toLowerCase();
            if (!rows.length) return;
            if (ie && ie <= 9 && !opts.tag) opts.tag = rows[0].match(/<([^>\s/]*)/)[1].toLowerCase();
            if (this.content_elem.children.length <= 1) cache.data = this.html(rows[0] + rows[0] + rows[0]);
            if (!opts.tag) opts.tag = this.content_elem.children[0].tagName.toLowerCase();
            this.getRowsHeight(rows);
        },
        getRowsHeight: function (rows) {
            var opts = this.options,
                prev_item_height = opts.item_height;
            opts.cluster_height = 0;
            if (!rows.length) return;
            var nodes = this.content_elem.children;
            if (!nodes.length) return;
            var node = nodes[Math.floor(nodes.length / 2)];
            opts.item_height = node.offsetHeight;
            // consider table's border-spacing
            if (opts.tag == 'tr' && getStyle('borderCollapse', this.content_elem) != 'collapse')
                opts.item_height += parseInt(getStyle('borderSpacing', this.content_elem), 10) || 0;
            // consider margins (and margins collapsing)
            if (opts.tag != 'tr') {
                var marginTop = parseInt(getStyle('marginTop', node), 10) || 0;
                var marginBottom = parseInt(getStyle('marginBottom', node), 10) || 0;
                opts.item_height += Math.max(marginTop, marginBottom);
            }
            opts.block_height = opts.item_height * opts.rows_in_block;
            opts.rows_in_cluster = opts.blocks_in_cluster * opts.rows_in_block;
            opts.cluster_height = opts.blocks_in_cluster * opts.block_height;
            opts.prev_item_height = prev_item_height;
            return prev_item_height != opts.item_height;
        },
        // get current cluster number
        getClusterNum: function (index) {
            if (typeof index == 'number') {
                index += $(this.scroll_elem).find("table thead tr").length;

                return Math.floor((index) / this.options.rows_in_cluster);
            } else {
                this.options.scroll_top = parseInt($(this.content_elem).attr("scroll_top"));
                return Math.floor(this.options.scroll_top / (this.options.cluster_height - this.options.block_height)) || 0;
            }
        },
        // generate empty row if no data provided
        generateEmptyRow: function () {
            var opts = this.options;
            if (!opts.tag || !opts.show_no_data_row) return [];
            var empty_row = document.createElement(opts.tag),
                no_data_content = document.createTextNode(opts.no_data_text), td;
            empty_row.className = opts.no_data_class;
            if (opts.tag == 'tr') {
                td = document.createElement('td');
                // fixes #53
                td.colSpan = 100;
                td.appendChild(no_data_content);
            }
            empty_row.appendChild(td || no_data_content);
            return [empty_row.outerHTML];
        },
        // generate cluster for current scroll position
        generate: function (rows, cluster_num, type, index) {
            var opts = this.options,
                rows_len = rows.length;
            if (rows_len < opts.rows_in_block) {
                return {
                    top_offset: 0,
                    bottom_offset: 0,
                    rows_above: 0,
                    rows: rows_len ? rows : this.generateEmptyRow()
                }
            }

            let isEndBlock = false;
            if ($(this.content_elem).attr("row-index") == "" + index && (type == "update" || type == "update-row")) {
                if (parseFloat($(this.content_elem).attr("row-top")) + S3TScrollBarWidth < parseFloat($(this.content_elem).attr("table_height_position")) && index < rows_len) {
                    isEndBlock = true;
                }
            }
            
            var items_start = Math.max((opts.rows_in_cluster - opts.rows_in_block) * cluster_num, 0),
                items_end = items_start + opts.rows_in_cluster,            
                top_offset = Math.max(items_start * opts.item_height, 0),
                bottom_offset = Math.max((rows_len - items_end) * opts.item_height, 0),
                this_cluster_rows = [],
                rows_above = items_start;
            if (top_offset < 1) {
                rows_above++;
            }
            if (isEndBlock) {                
                cluster_num += 2;
                let items_start1 = Math.max((opts.rows_in_cluster - opts.rows_in_block) * cluster_num, 0);
                items_end = items_start1 + opts.rows_in_cluster;
                bottom_offset = Math.max((rows_len - items_end) * opts.item_height, 0);
                if (top_offset < 1) {
                    rows_above++;
                }
            } else {

            }
            for (var i = items_start; i < items_end; i++) {
                rows[i] && this_cluster_rows.push(rows[i]);
            }
            return {
                top_offset: top_offset,
                bottom_offset: bottom_offset,
                rows_above: rows_above,
                rows: this_cluster_rows
            }
        },
        renderExtraTag: function (class_name, height) {
            var tag = document.createElement(this.options.tag),
                clusterize_prefix = 'clusterize-';
            tag.className = [clusterize_prefix + 'extra-row', clusterize_prefix + class_name].join(' ');
            height && (tag.style.height = height + 'px');
            return tag.outerHTML;
        },
        // if necessary verify data changed and insert to DOM
        loadToDOM: function (rows, cache, type, index, idle, callDetail, element) {
            // explore row's height
            if (!this.options.cluster_height) {
                this.exploreEnvironment(rows, cache);
            }
            var data = this.generate(rows, this.getClusterNum(index), type, index),
                this_cluster_rows = data.rows.join(''),
                this_cluster_content_changed = this.checkChanges('data', this_cluster_rows, cache),
                top_offset_changed = this.checkChanges('top', data.top_offset, cache),
                only_bottom_offset_changed = this.checkChanges('bottom', data.bottom_offset, cache),
                callbacks = this.options.callbacks,
                layout = [];

            if (this_cluster_content_changed || top_offset_changed) {
                if (data.top_offset) {
                    this.options.keep_parity && layout.push(this.renderExtraTag('keep-parity'));
                    layout.push(this.renderExtraTag('top-space', data.top_offset));
                }
                layout.push(this_cluster_rows);
                data.bottom_offset && layout.push(this.renderExtraTag('bottom-space', data.bottom_offset));
                this.html(layout.join(''));
                this.options.content_tag == 'ol' && this.content_elem.setAttribute('start', data.rows_above);
                this.content_elem.style['counter-increment'] = 'clusterize-counter ' + (data.rows_above - 1);
            } else if (only_bottom_offset_changed) {
                this.content_elem.lastChild.style.height = data.bottom_offset + 'px';
            }

            switch (type) {
                case 're-load':
                    callbacks.ClusterRefresh && callbacks.ClusterRefresh(callDetail);
                    break;
                case 'load':
                    callbacks.ClusterLoaded && callbacks.ClusterLoaded();
                    break;
                case 'add':
                    callbacks.ClusterAdded && callbacks.ClusterAdded(index);
                    break;
                case 'update':
                    callbacks.ClusterUpdated && callbacks.ClusterUpdated(index);
                    break;
                case 'update-row':
                    callbacks.ClusterUpdateRow && callbacks.ClusterUpdateRow(element, idle);
                    break;
                case 'delete':
                    callbacks.ClusterDeleted && callbacks.ClusterDeleted();
                    break;
                case 'scroll':
                    callbacks.ClusterChanged && callbacks.ClusterChanged();
                    break;
                case 'search':                    
                    callbacks.ClusterSearch && callbacks.ClusterSearch();
                    break;
            }
        },        
        // unfortunately ie <= 9 does not allow to use innerHTML for table elements, so make a workaround
        html: function (data) {
            var content_elem = this.content_elem;
            if (ie && ie <= 9 && this.options.tag == 'tr') {
                var div = document.createElement('div'), last;
                div.innerHTML = '<table><tbody>' + data + '</tbody></table>';
                while ((last = content_elem.lastChild)) {
                    content_elem.removeChild(last);
                }
                var rows_nodes = this.getChildNodes(div.firstChild.firstChild);
                while (rows_nodes.length) {
                    content_elem.appendChild(rows_nodes.shift());
                }
            } else {
                content_elem.innerHTML = data;
            }
            this.options.clusterize_S3Table && this.options.clusterize_S3Table.TranslateRow();
        },
        getChildNodes: function (tag) {
            var child_nodes = tag.children, nodes = [];
            for (var i = 0, ii = child_nodes.length; i < ii; i++) {
                nodes.push(child_nodes[i]);
            }
            return nodes;
        },
        checkChanges: function (type, value, cache) {
            var changed = value != cache[type];
            cache[type] = value;
            return changed;
        }
    }

    // support functions
    function on(evt, element, fnc) {
        return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent("on" + evt, fnc);
    }
    function off(evt, element, fnc) {
        return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent("on" + evt, fnc);
    }
    function isArray(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }
    function getStyle(prop, elem) {
        return window.getComputedStyle ? window.getComputedStyle(elem)[prop] : elem.currentStyle[prop];
    }

    return Clusterize;
}));