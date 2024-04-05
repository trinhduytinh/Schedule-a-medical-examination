"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _nodemailer = _interopRequireDefault(require("nodemailer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
require("dotenv").config();
var sendSimpleEmail = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(dataSend) {
    var transporter, info;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          transporter = _nodemailer["default"].createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: process.env.EMAIL_APP,
              pass: process.env.EMAIL_APP_PASSWORD
            }
          }); // send mail with defined transport object
          _context.next = 3;
          return transporter.sendMail({
            from: '"Trịnh Duy Tính 👻" <tinhtrinh54@gmail.com>',
            // sender address
            to: dataSend.receiverEmail,
            // list of receivers
            subject: "Thông tin đặt lịch khám bệnh",
            // Subject line
            // text: "Hello world?", // plain text body
            html: getBodyHTMLEmail(dataSend) // html body
          });
        case 3:
          info = _context.sent;
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function sendSimpleEmail(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getBodyHTMLEmail = function getBodyHTMLEmail(dataSend) {
  var result = "";
  if (dataSend.language === "vi") {
    result = "\n    <h3>Xin ch\xE0o ".concat(dataSend.patientName, "<h3/>\n    <p>B\u1EA1n nh\u1EADn \u0111\u01B0\u1EE3c email n\xE0y v\xEC \u0111\xE3 \u0111\u1EB7t l\u1ECBch kh\xE1m b\u1EC7nh online tr\xEAn wed c\u1EE7a Tr\u1ECBnh Duy T\xEDnh</p>\n    <p>Th\xF4ng tin \u0111\u1EB7t l\u1ECBch kh\xE1m b\u1EC7nh nh\u01B0 sau:<p>\n    <div><b>Th\u1EDDi gian: ").concat(dataSend.time, "</b></div>\n    <div><b>B\xE1c s\u0129: ").concat(dataSend.doctorName, "</div>\n    <p>N\u1EBFu c\xE1c th\xF4ng tin tr\xEAn l\xE0 ch\xEDnh x\xE1c , vui l\xF2ng click v\xE0o \u0111\u01B0\u1EDDng link b\xEAn d\u01B0\u1EDBi \u0111\u1EC3 x\xE1c nh\u1EADn v\xE0 ho\xE0n t\u1EA5t th\u1EE7 t\u1EE5c \u0111\u1EB7t l\u1ECBch kh\xE1m b\u1EC7nh</p>\n    <div><a href=").concat(dataSend.redirectLink, " target=\"_blank\">Click here</a></div>\n    <div>Xin ch\xE2n th\xE0nh c\u1EA3m \u01A1n</div>\n    <div>Ch\xFAc b\u1EA1n m\u1ED9t ng\xE0y t\u1ED1t l\xE0nh</div>\n\n");
  }
  if (dataSend.language === "en") {
    result = "\n  <h3>Hello ".concat(dataSend.patientName, "<h3/>\n  <p>You are receiving this email because you have scheduled an online medical appointment on Trinh Duy Tinh's website</p>\n  <p>The details of the medical appointment are as follows:<p>\n  <div><b>Time: ").concat(dataSend.time, "</b></div>\n  <div><b>Doctor: ").concat(dataSend.doctorName, "</b></div>\n  <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment booking process</p>\n  <div><a href=").concat(dataSend.redirectLink, " target=\"_blank\">Click here</a></div>\n  <div>Thank you sincerely</div>\n  <div>Wishing you a wonderful day</div>\n   ");
  }
  if (dataSend.language === "ja") {
    result = "\n  <h3>\u3053\u3093\u306B\u3061\u306F ".concat(dataSend.patientName, "<h3/>\n  <p>\u3042\u306A\u305F\u304CTrinh Duy Tinh\u306E\u30A6\u30A7\u30D6\u30B5\u30A4\u30C8\u3067\u30AA\u30F3\u30E9\u30A4\u30F3\u533B\u7642\u4E88\u7D04\u3092\u884C\u3063\u305F\u305F\u3081\u3001\u3053\u306E\u30E1\u30FC\u30EB\u3092\u53D7\u3051\u53D6\u3063\u3066\u3044\u307E\u3059</p>\n  <p>\u533B\u7642\u4E88\u7D04\u306E\u8A73\u7D30\u306F\u6B21\u306E\u901A\u308A\u3067\u3059:<p>\n  <div><b>\u6642\u9593: ").concat(dataSend.time, "</b></div>\n  <div><b>\u533B\u5E2B: ").concat(dataSend.doctorName, "</b></div>\n  <p>\u4E0A\u8A18\u306E\u60C5\u5831\u304C\u6B63\u3057\u3044\u5834\u5408\u3001\u4EE5\u4E0B\u306E\u30EA\u30F3\u30AF\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u533B\u7642\u4E88\u7D04\u306E\u624B\u7D9A\u304D\u3092\u78BA\u8A8D\u304A\u3088\u3073\u5B8C\u4E86\u3057\u3066\u304F\u3060\u3055\u3044</p>\n  <div><a href=").concat(dataSend.redirectLink, " target=\"_blank\">\u3053\u3061\u3089\u3092\u30AF\u30EA\u30C3\u30AF</a></div>\n  <div>\u5FC3\u304B\u3089\u611F\u8B1D\u3044\u305F\u3057\u307E\u3059</div>\n  <div>\u7D20\u6674\u3089\u3057\u3044\u4E00\u65E5\u3092\u304A\u904E\u3054\u3057\u304F\u3060\u3055\u3044</div>\n   ");
  }
  return result;
};
var sendAttachment = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(dataSend) {
    var transporter, info;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          transporter = _nodemailer["default"].createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: process.env.EMAIL_APP,
              pass: process.env.EMAIL_APP_PASSWORD
            }
          }); // send mail with defined transport object
          _context2.next = 3;
          return transporter.sendMail({
            from: '"Trịnh Duy Tính 👻" <tinhtrinh54@gmail.com>',
            // sender address
            to: dataSend.email,
            // list of receivers
            subject: "Hóa đơn khám bệnh",
            // Subject line
            // text: "Hello world?", // plain text body
            html: getBodyHTMLEmailRemedy(dataSend),
            // html body
            attachments: [
            //gui file
            {
              filename: "remedy-".concat(dataSend.patientId, "-").concat(new Date().getTime(), ".png"),
              content: dataSend.imgBase64.split("base64,")[1],
              encoding: "base64"
            }]
          });
        case 3:
          info = _context2.sent;
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function sendAttachment(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var getBodyHTMLEmailRemedy = function getBodyHTMLEmailRemedy(dataSend) {
  var result = "";
  if (dataSend.language === "vi") {
    result = "\n    <h3>Xin ch\xE0o ".concat(dataSend.patientName, "!<h3/>\n    <p>B\u1EA1n nh\u1EADn \u0111\u01B0\u1EE3c email n\xE0y v\xEC \u0111\xE3 \u0111\u1EB7t l\u1ECBch kh\xE1m b\u1EC7nh online tr\xEAn wed c\u1EE7a Tr\u1ECBnh Duy T\xEDnh</p>\n    <p>C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 tin t\u01B0\u1EDFng v\xE0 s\u1EED d\u1EE5ng d\u1ECBch v\u1EE5 c\u1EA3u ch\xFAng t\xF4i.</p>\n    <p>Th\xF4ng tin \u0111\u01A1n thu\u1ED1c/h\xF3a \u0111\u01A1n \u0111\u01B0\u1EE3c g\u1EEDi \u0111\u1EBFn b\u1EA1n trong file \u0111\xEDnh k\xE8m d\u01B0\u1EDBi:<p>\n    <div>Xin ch\xE2n th\xE0nh c\u1EA3m \u01A1n.</div>\n    <div>Ch\xFAc b\u1EA1n m\u1ED9t ng\xE0y t\u1ED1t l\xE0nh.</div>\n\n");
  }
  if (dataSend.language === "en") {
    result = "\n    <h3>Hello ".concat(dataSend.patientName, "!<h3/>\n    <p>You are receiving this email because you have scheduled an online medical appointment on Trinh Duy Tinh's website</p>\n    <p>Thank you for your trust and using our services.</p>\n    <p>The prescription/invoice information has been sent to you in the attached file below:<p>\n    <div>Thank you sincerely.</div>\n    <div>Wishing you a wonderful day.</div>\n");
  }
  if (dataSend.language === "ja") {
    result = "\n    <h3>".concat(dataSend.patientName, "\u3055\u3093\u3001\u3053\u3093\u306B\u3061\u306F\uFF01<h3/>\n    <p>Trinh Duy Tinh\u306E\u30A6\u30A7\u30D6\u30B5\u30A4\u30C8\u3067\u30AA\u30F3\u30E9\u30A4\u30F3\u533B\u7642\u4E88\u7D04\u3092\u3055\u308C\u305F\u305F\u3081\u3001\u3053\u306E\u30E1\u30FC\u30EB\u3092\u53D7\u4FE1\u3057\u3066\u3044\u307E\u3059</p>\n    <p>\u304A\u4FE1\u983C\u3044\u305F\u3060\u304D\u3001\u5F53\u30B5\u30FC\u30D3\u30B9\u3092\u3054\u5229\u7528\u3044\u305F\u3060\u304D\u3001\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059\u3002</p>\n    <p>\u51E6\u65B9\u7B8B/\u8ACB\u6C42\u66F8\u306E\u60C5\u5831\u306F\u3001\u4EE5\u4E0B\u306E\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u306B\u6DFB\u4ED8\u3055\u308C\u3066\u3044\u307E\u3059:<p>\n    <div>\u5FC3\u304B\u3089\u611F\u8B1D\u3044\u305F\u3057\u307E\u3059\u3002</div>\n    <div>\u7D20\u6674\u3089\u3057\u3044\u4E00\u65E5\u3092\u304A\u904E\u3054\u3057\u304F\u3060\u3055\u3044\u3002</div>\n");
  }
  return result;
};
module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment
};