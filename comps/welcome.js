"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("../src/state");
customElements.define("welc-el", /** @class */ (function (_super) {
    __extends(Welcome, _super);
    function Welcome() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Welcome.prototype.connectedCallback = function () {
        this.render();
        this.listeners();
    };
    Welcome.prototype.listeners = function () {
        var _this = this;
        var roomOption = {
            room: {}
        };
        var buttonExistantRoom = this.querySelector(".existant-room");
        buttonExistantRoom.addEventListener("click", function (e) {
            e.preventDefault();
            roomOption.room = "existant";
            console.log(roomOption);
            var newRoomId = _this.querySelector(".form-room-id");
            newRoomId.style.display = "flex";
        });
        var buttonNewRoom = this.querySelector(".new-room");
        buttonNewRoom.addEventListener("click", function (e) {
            e.preventDefault();
            roomOption.room = "new";
            console.log(roomOption);
            var newRoomId = _this.querySelector(".form-room-id");
            newRoomId.style.display = "none";
        });
        var form = this.querySelector(".form");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var form = e.target;
            var email = form.email.value;
            var name = form.name.value;
            var roomId = form.room.value;
            state_1.state.setEmailAndFullName(email, name);
            state_1.state.data.roomId = roomId;
            if (roomOption.room === "existant") {
                console.log("adentro del existant");
                state_1.state.singIn();
            }
            else if (roomOption.room === "new") {
                state_1.state.signUp();
            }
        });
    };
    Welcome.prototype.render = function () {
        var div = document.createElement("div");
        div.innerHTML = "\n        <div class=\"header\"></div>\n        <h2 class=\"title\">Bienvenidos</h2>\n        <form class=\"form\" method=\"post\">\n        <fieldset>\n            <label for=\"email\" class=\"form-email__label\">\n                Email\n                <input type=\"email\" class=\"email\" name=\"email\" id=\"email\">\n            </label>\n            <label for=\"name\" class=\"form-name__label\">\n                Tu Nombre\n                <input type=\"text\" class=\"name\" name=\"name\" id=\"name\">\n            </label>\n\n            <div class=\"form-div\">\n            <button class=\"text\">Seleccionar Room</button>\n            <div for=\"room\" class=\"form__room\">\n                <button class=\"new-room\">Nuevo Room</button>\n                <button class=\"existant-room\">Room Existente</button>\n            </div>\n            </div>\n            \n            <div class=\"form-room-id\">\n             Room Id\n             <input type=\"text\" class=\"room-id\" name=\"room\">\n            </div>\n        </fieldset>\n            <button type=\"submit\" class=\"form-button\">Comenzar</button>\n            </form>\n";
        var style = document.createElement("style");
        style.textContent = "\n        *{\n            box-sizing:border-box;\n        }\n        body{\n            margin:0\n        }\n        .header{\n            background-color: rgba(255, 130, 130, 1);\n            width:375px;\n            height:60px;\n        }\n        .title{\n            text-align: center;\n            width:375px;\n        }\n        .email, .name, .room-id {\n            border: solid 2px; \n            border-radius: 6px;\n        }    \n        .form{\n            display: flex;\n            flex-direction: column;\n            gap:10px;\n            width:375px;\n            padding: 30px;\n        }\n        .form-email__label,\n        .form-name__label {\n            display: flex;\n            flex-direction: column;\n            gap:10px;            \n        }\n        .form-div{\n            border: solid 3px yellow;\n        }\n        .form__room {\n            display:flex;\n            flex-direction: column;\n            padding: 0;\n            z-index:999;\n            list-style: none;\n            background-color: rgba(255, 130, 130, 1);            \n        }\n        .new-room, .existant-room {\n           display: flex;\n           width: 100%;\n           flex-grow: 1;\n          position: relative;                            \n            text-decoration: none;\n            text-align: center;\n            background:transparent;\n            border:solid yellow 2px;\n        }      \n        .text{\n            display: flex;\n            width: 100%;\n            flex-grow: 1;\n            background:transparent;\n            text-decoration: none;\n            border: none;\n        }\n      \n        .existant-room:hover {\n            background-color: green;\n        }\n        .new-room:hover{\n            background-color: green;\n        }\n     \n        .form-room-id {\n            display: none;\n            flex-direction: column;\n        }\n\n        .existant-room:focus + .form-room-id {\n            display:flex;\n        }\n";
        this.appendChild(div);
        this.appendChild(style);
    };
    ;
    return Welcome;
}(HTMLElement)));
