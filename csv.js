// Generated by CoffeeScript 1.7.1
(function() {
  var CSV, confirm, format,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  confirm = {
    number: function(possible) {
      return !isNaN(Number(possible));
    },
    "function": function(possible) {
      return !!(possible && possible.constructor && possible.call && possible.apply);
    }
  };

  format = {
    decode: function(string) {
      if (string === "") {
        return string;
      } else if (confirm.number(string)) {
        return Number(string);
      } else {
        return string.replace(/\"/gi, '').trim();
      }
    },
    encode: function(array) {
      var element, line;
      line = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          element = array[_i];
          if (confirm.number(element)) {
            _results.push("\"" + element + "\"");
          } else {
            _results.push(element);
          }
        }
        return _results;
      })();
      return line.join(",") + "\n";
    },
    split: function(text, delimiter) {
      var item, _i, _len, _ref, _results;
      _ref = text.split(delimiter);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(format.decode(item));
      }
      return _results;
    }
  };

  CSV = (function() {
    function CSV(options) {
      var _base, _base1, _base2, _base3;
      this.options = options != null ? options : {};
      this.parse = __bind(this.parse, this);
      this.encode = __bind(this.encode, this);
      this.done = __bind(this.done, this);
      this.stream = __bind(this.stream, this);
      this.set = __bind(this.set, this);
      (_base = this.options).delimiter || (_base.delimiter = ",");
      (_base1 = this.options).header || (_base1.header = false);
      (_base2 = this.options).stream || (_base2.stream = void 0);
      (_base3 = this.options).done || (_base3.done = void 0);
    }

    CSV.prototype.set = function(setting, value) {
      return this.options[setting] = value;
    };

    CSV.prototype.stream = function(method) {
      if (confirm["function"](method)) {
        return this.options.stream = method;
      } else {
        return "No function provided.";
      }
    };

    CSV.prototype.done = function(method) {
      if (confirm["function"](method)) {
        return this.options.done = method;
      } else {
        return "No function provided.";
      }
    };

    CSV.prototype.encode = function(array) {
      var data, encoded, k, object, v, values, _, _i, _len;
      if (this.options.header) {
        encoded = format.encode((function() {
          var _ref, _results;
          _ref = array[0];
          _results = [];
          for (k in _ref) {
            _ = _ref[k];
            _results.push(k);
          }
          return _results;
        })());
        data = array.slice(1);
      } else {
        encoded = "";
        data = array;
      }
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        object = data[_i];
        values = (function() {
          var _results;
          _results = [];
          for (_ in object) {
            v = object[_];
            _results.push(v);
          }
          return _results;
        })();
        encoded += format.encode(values);
      }
      return encoded;
    };

    CSV.prototype.parse = function(text) {
      var complete, data, fields, header, index, object, response, row, rows, stream, supplied, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2;
      complete = this.options.complete;
      stream = this.options.stream;
      header = this.options.header;
      supplied = header instanceof Array;
      data = [];
      rows = text.split("\n").filter(function(item) {
        return item.length > 1 && item[0] !== "";
      });
      if (this.options.header) {
        fields = supplied ? header : format.split(rows[0], this.options.delimiter);
        _ref = (supplied ? rows : rows.slice(1));
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          row = _ref[_i];
          object = {};
          _ref1 = format.split(row, this.options.delimiter);
          for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {
            value = _ref1[index];
            object[fields[index]] = format.decode(value);
          }
          if (confirm["function"](stream)) {
            stream.call(this, object);
          } else {
            data.push(object);
          }
        }
        response = {
          fields: fields,
          data: data
        };
      } else {
        for (_k = 0, _len2 = rows.length; _k < _len2; _k++) {
          row = rows[_k];
          object = [];
          _ref2 = format.split(row, this.options.delimiter);
          for (index = _l = 0, _len3 = _ref2.length; _l < _len3; index = ++_l) {
            value = _ref2[index];
            object.push(format.decode(value));
          }
          if (confirm["function"](stream)) {
            stream.call(this, object);
          } else {
            data.push(object);
          }
        }
        response = {
          data: data
        };
      }
      if (confirm["function"](complete)) {
        complete.call(this, response);
      }
      return response;
    };

    return CSV;

  })();

  window.CSV = CSV;

}).call(this);
