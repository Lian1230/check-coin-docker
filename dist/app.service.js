"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const lib_1 = require("./lib");
const config_1 = require("./config");
let render;
const getData = () => lib_1.getPrice()
    .then(lib_1.formatData)
    .then(dat => render = dat)
    .then(() => lib_1.sendAlert(render, lib_1.checkLimit(render)))
    .catch(e => render = e);
getData();
setInterval(() => getData(), config_1.interval * 60 * 1000);
let AppService = class AppService {
    check() {
        return render;
    }
    setLimit(query) {
        const newLimit = lib_1.formatQuery(query);
        return newLimit
            ? lib_1.setLimit(newLimit)
            : 'Invalid Query Format.';
    }
};
AppService = __decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map