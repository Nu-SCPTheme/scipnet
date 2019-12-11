"use strict";
/*
 * utils/index.ts
 *
 * scipnet - Frontend scripts for mekhane
 * Copyright (C) 2019 not_a_seagull
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var BluebirdPromise = require("bluebird");
// async version of setTimeout
function timeout(ms) {
    return __awaiter(this, void 0, BluebirdPromise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new BluebirdPromise(function (resolve) {
                    setTimeout(resolve, ms);
                })];
        });
    });
}
exports.timeout = timeout;
// potentially compromised object- e.g. bad data may be put into it
var PotentiallyCompromised = /** @class */ (function () {
    function PotentiallyCompromised() {
        this.isCompromised = false;
        this.continueIfCompromised = false;
    }
    PotentiallyCompromised.prototype.deserializeProperty = function (propName, input, converter, constraint) {
        if (converter === void 0) { converter = function (x) { return x; }; }
        if (constraint === void 0) { constraint = function (x) { return true; }; }
        if (!this.continueIfCompromised && this.isCompromised) {
            return;
        }
        // attempt to get a property
        try {
            var val = converter(input);
            if (!val || !constraint(val)) {
                throw new Error("Value " + val + " does not meet constraints");
            }
            this[propName] = val;
        }
        catch (err) {
            console.error("An error occurred during deserialization: " + err);
            this.isCompromised = true;
        }
    };
    return PotentiallyCompromised;
}());
exports.PotentiallyCompromised = PotentiallyCompromised;
// make a closure out of a class method
function classMethodToClosure(obj, methodName) {
    return (function (instance) {
        var func = obj.prototype[methodName];
        return function () {
            return func.apply(obj, arguments);
        };
    })(obj);
}
exports.classMethodToClosure = classMethodToClosure;
