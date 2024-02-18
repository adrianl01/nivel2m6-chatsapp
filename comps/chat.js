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
customElements.define("chatr-el", /** @class */ (function (_super) {
    __extends(ChatRoom, _super);
    function ChatRoom() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messages = [];
        return _this;
    }
    ChatRoom.prototype.connectedCallback = function () {
        var _this = this;
        if (state_1.state.data.rtdbRoomId !== " ") {
            console.log("RENDERR");
            this.render();
        }
        if (this.messages.length == 0) {
            var currentState = state_1.state.getState();
            this.messages = currentState.messages;
            this.addMessage();
        }
        state_1.state.subscribe(function () {
            console.log("SUBSCRIBE");
            var currentState = state_1.state.getState();
            _this.messages = currentState.messages;
            console.log("antes del addMessage:", _this.messages);
            _this.addMessage();
        });
    };
    ChatRoom.prototype.addlisteners = function () {
        var form = this.querySelector(".form");
        form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (e) {
            e.preventDefault();
            var target = e.target;
            var formInput = target.input.value;
            console.log("formInput:", formInput);
            state_1.state.pushMessage(formInput);
        });
    };
    ChatRoom.prototype.addMessage = function () {
        var _this = this;
        console.log("addMessage");
        var feedEl = this.querySelector(".feed").childNodes;
        console.log(feedEl.length);
        if (feedEl.length == 1) {
            this.messages.map(function (m) {
                var div = document.createElement("div");
                div.innerHTML =
                    "<div class=\"message-from\">From:".concat(m.from, "</div>\n                         <div class=\"message-message\">").concat(m.message, "</div>\n                        ");
                if (state_1.state.data.fullName == m.from) {
                    div.classList.add("message2");
                }
                if (state_1.state.data.fullName !== m.from) {
                    div.classList.add("message");
                }
                var feedEl = _this.querySelector(".feed").childNodes;
                if (feedEl.length > 0) {
                    feedEl.forEach(function (c) {
                        var _a;
                        var message = (_a = c.childNodes[2]) === null || _a === void 0 ? void 0 : _a.textContent;
                        console.log(message, "//", m.message);
                        if (message !== m.message) { }
                    });
                }
                return _this.querySelector(".feed").appendChild(div);
            });
        }
        else {
            var m_1 = this.messages.slice(-1);
            console.log();
            var div = document.createElement("div");
            div.innerHTML =
                "<div class=\"message-from\">From:".concat(m_1[0].from, "</div>\n                     <div class=\"message-message\">").concat(m_1[0].message, "</div>\n                    ");
            if (state_1.state.data.fullName == m_1[0].from) {
                div.classList.add("message2");
            }
            if (state_1.state.data.fullName !== m_1[0].from) {
                div.classList.add("message");
            }
            var feedEl_1 = this.querySelector(".feed").childNodes;
            var feedChildren = [];
            if (feedEl_1.length > 0) {
                feedEl_1.forEach(function (c) {
                    var _a;
                    var message = (_a = c.childNodes[2]) === null || _a === void 0 ? void 0 : _a.textContent;
                    if (message !== m_1[0].message) { }
                });
            }
            return this.querySelector(".feed").appendChild(div);
        }
    };
    ChatRoom.prototype.render = function () {
        console.log("EL RENDER RENDERIZZA");
        setTimeout(function () {
            // console.log(this.messages)
        }, 2000);
        var roomId = state_1.state.getState().roomId;
        var div = document.createElement("div");
        div.innerHTML = "\n            <div class=\"absolute\">\n            <header class=\"header\">Id del Room:".concat(roomId, "</header>\n            <h2 class=\"title\">Chat</h2>        \n            </div>\n            <div class=\"feed\">\n           </div>\n           <form class=\"form\">    \n               <fieldset>              \n                <input class=\"class-input\" type=\"text\" name=\"input\">\n               <fieldset/>    \n                   <button type=\"submit\" class=\"button\">Enviar</button>\n           </form>\n                ");
        var style = document.createElement("style");
        style.textContent = "       \n            *{box-sizing:border-box;}\n            body {margin:0}\n                .root {\n                    width: 100%;\n                    font-family: 'Roboto', sans-serif;\n                    min-height: 667px;\n                    display: flex;\n                    flex-direction: column;\n                    align-items: center;\n                }            \n                .absolute{\n                    position: sticky;    \n                    top:0;   \n                    z-index:1;\n                }            \n                .header {\n                    padding-left:10px;\n                    width: 375px;\n                    height: 60px;\n                    background-color: palegreen;\n                    display:flex;\n                    justify-content: start;\n                    align-items: center;\n                }\n                .title {\n                    font-family: 'Roboto', sans-serif;\n                    text-align: center;\n                    font-size: 80;\n                    background-color: white;\n                }\n                .feed{\n                    display: flex;\n                    flex-direction: column;\n                    height: 100%;\n                    width: 375px;\n                    background-color:green;\n                    z-index: 0;\n                }\n            .form {\n                display: flex;\n                flex-direction: column;\n                gap: 7px;\n                background-color: aquamarine;\n                padding: 10px 5px;\n                position:sticky;\n                display: flex;\n                flex-direction: column;\n                align-items: end;\n                text-align:center;\n                bottom: 0;\n                z-index:1;\n            }\n            .label {\n                font-size: 25;\n            }\n            .class-input {\n                width: 312px;\n                height: 55px;\n                border-radius: 5px;\n                font-size: 20px;\n                border: solid black 3px;\n            }\n            .button {\n                width: 312px;\n                height: 55px;\n                border-radius: 5px;\n                font-size: 20px;\n                border: solid black 3px;\n            }\n            .button:active {\n                background-color: aqua;\n            }\n            .message {\n                border: solid black 3px;\n                display:flex;\n                flex-direction:column;\n                text-align:start;\n            }\n            .message2 {\n                border: solid black 3px;\n                display:flex;\n                flex-direction:column;\n                text-align:end;\n            }\n            ";
        div.classList.add("root");
        this.appendChild(style);
        this.appendChild(div);
        this.addlisteners();
    };
    return ChatRoom;
}(HTMLElement)));
