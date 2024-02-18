"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
require("../router.ts");
(function () {
    state_1.state.init();
    // state.setEmailAndFullName("gustavo.adrian.leiva879@gmail.com", "Gustavo Adrián Leiva");
    // state.singIn((err) => {
    //     if (err) console.error("Hubo un error en el singIn")
    //     state.askNewRoom(() => {
    //         state.accessToRoom();
    //     })
    // })
})();
