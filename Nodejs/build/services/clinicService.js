"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _bingTranslateApi = require("bing-translate-api");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var db = require("../models");
function translateText(_x, _x2) {
  return _translateText.apply(this, arguments);
}
function _translateText() {
  _translateText = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(text, language) {
    var maxLength, translation, chunks, _iterator, _step, chunk, result;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          maxLength = 1000;
          translation = "";
          chunks = text.match(new RegExp(".{1," + maxLength + "}", "g"));
          _iterator = _createForOfIteratorHelper(chunks);
          _context4.prev = 4;
          _iterator.s();
        case 6:
          if ((_step = _iterator.n()).done) {
            _context4.next = 20;
            break;
          }
          chunk = _step.value;
          _context4.prev = 8;
          _context4.next = 11;
          return (0, _bingTranslateApi.translate)(chunk, null, language);
        case 11:
          result = _context4.sent;
          translation += result.translation;
          _context4.next = 18;
          break;
        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](8);
          console.error("Translation error:", _context4.t0);
        case 18:
          _context4.next = 6;
          break;
        case 20:
          _context4.next = 25;
          break;
        case 22:
          _context4.prev = 22;
          _context4.t1 = _context4["catch"](4);
          _iterator.e(_context4.t1);
        case 25:
          _context4.prev = 25;
          _iterator.f();
          return _context4.finish(25);
        case 28:
          return _context4.abrupt("return", translation);
        case 29:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[4, 22, 25, 28], [8, 15]]);
  }));
  return _translateText.apply(this, arguments);
}
var createClinic = function createClinic(data) {
  return new Promise( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve, reject) {
      var nameEn, nameJa, addressEn, addressJa, descriptionHTMLEn, descriptionHTMLJa, descriptionMarkdownEn, descriptionMarkdownJa;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            if (!(!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown)) {
              _context.next = 5;
              break;
            }
            resolve({
              errCode: 1,
              errMessage: "Missing parameter"
            });
            _context.next = 39;
            break;
          case 5:
            nameEn = "", nameJa = "", addressEn = "", addressJa = "", descriptionHTMLEn = "", descriptionHTMLJa = "", descriptionMarkdownEn = "", descriptionMarkdownJa = "";
            _context.prev = 6;
            _context.next = 9;
            return translateText(data.name, "en");
          case 9:
            nameEn = _context.sent;
            _context.next = 12;
            return translateText(data.name, "ja");
          case 12:
            nameJa = _context.sent;
            _context.next = 15;
            return translateText(data.address, "en");
          case 15:
            addressEn = _context.sent;
            _context.next = 18;
            return translateText(data.address, "ja");
          case 18:
            addressJa = _context.sent;
            _context.next = 21;
            return translateText(data.descriptionHTML, "en");
          case 21:
            descriptionHTMLEn = _context.sent;
            _context.next = 24;
            return translateText(data.descriptionHTML, "ja");
          case 24:
            descriptionHTMLJa = _context.sent;
            _context.next = 27;
            return translateText(data.descriptionMarkdown, "en");
          case 27:
            descriptionMarkdownEn = _context.sent;
            _context.next = 30;
            return translateText(data.descriptionMarkdown, "ja");
          case 30:
            descriptionMarkdownJa = _context.sent;
            _context.next = 36;
            break;
          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](6);
            console.error(_context.t0);
          case 36:
            _context.next = 38;
            return db.Clinic.create({
              name: data.name,
              nameEn: nameEn,
              nameJa: nameJa,
              address: data.address,
              addressEn: addressEn,
              addressJa: addressJa,
              image: data.imageBase64,
              descriptionHTML: data.descriptionHTML,
              descriptionHTMLEn: descriptionHTMLEn,
              descriptionHTMLJa: descriptionHTMLJa,
              descriptionMarkdown: data.descriptionMarkdown,
              descriptionMarkdownEn: descriptionMarkdownEn,
              descriptionMarkdownJa: descriptionMarkdownJa
            });
          case 38:
            resolve({
              errCode: 0,
              errMessage: "OK"
            });
          case 39:
            _context.next = 44;
            break;
          case 41:
            _context.prev = 41;
            _context.t1 = _context["catch"](0);
            reject(_context.t1);
          case 44:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 41], [6, 33]]);
    }));
    return function (_x3, _x4) {
      return _ref.apply(this, arguments);
    };
  }());
};
var getAllClinic = function getAllClinic() {
  return new Promise( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(resolve, reject) {
      var data;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return db.Clinic.findAll();
          case 3:
            data = _context2.sent;
            if (data && data.length > 0) {
              data.map(function (item) {
                item.image = new Buffer(item.image, "base64").toString("binary");
                return item;
              });
            }
            resolve({
              errCode: 0,
              errMessage: "ok",
              data: data
            });
            _context2.next = 11;
            break;
          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            reject(_context2.t0);
          case 11:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[0, 8]]);
    }));
    return function (_x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }());
};
var getDetailClinicById = function getDetailClinicById(inputId) {
  return new Promise( /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(resolve, reject) {
      var data, doctorClinic;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            if (inputId) {
              _context3.next = 5;
              break;
            }
            resolve({
              errCode: 1,
              errMessage: "Missing parameter"
            });
            _context3.next = 18;
            break;
          case 5:
            _context3.next = 7;
            return db.Clinic.findOne({
              where: {
                id: inputId
              },
              attributes: ["name", "nameEn", "nameJa", "address", "addressEn", "addressJa", "descriptionHTML", "descriptionHTMLEn", "descriptionHTMLJa", "descriptionMarkdown", "descriptionMarkdownEn", "descriptionMarkdownJa"]
            });
          case 7:
            data = _context3.sent;
            if (!data) {
              _context3.next = 16;
              break;
            }
            doctorClinic = [];
            _context3.next = 12;
            return db.Doctor_Infor.findAll({
              where: {
                clinicId: inputId
              },
              attributes: ["doctorId", "provinceId"]
            });
          case 12:
            doctorClinic = _context3.sent;
            data.doctorClinic = doctorClinic;
            _context3.next = 17;
            break;
          case 16:
            data = {};
          case 17:
            resolve({
              errMessage: "Ok",
              errCode: 0,
              data: data
            });
          case 18:
            _context3.next = 23;
            break;
          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3["catch"](0);
            reject(_context3.t0);
          case 23:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 20]]);
    }));
    return function (_x7, _x8) {
      return _ref3.apply(this, arguments);
    };
  }());
};
module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById
};