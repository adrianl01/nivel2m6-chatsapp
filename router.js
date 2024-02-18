"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./comps/welcome.ts");
require("./comps/chat.ts");
var router_1 = require("@vaadin/router");
var root = document.querySelector(".root");
var router = new router_1.Router(root);
router.setRoutes([
    { path: "/", component: "welc-el" },
    { path: "/chat", component: "chatr-el" },
]);
