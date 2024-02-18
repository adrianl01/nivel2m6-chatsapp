"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
var database_1 = require("firebase/database");
var db_1 = require("./db");
var map = require("lodash/map");
var API_BASE_URL = "http://localhost:3000";
var router_1 = require("@vaadin/router");
var state = {
    data: {
        email: "",
        fullName: "",
        userId: "",
        roomId: "",
        rtdbRoomId: "",
        messages: [],
    },
    listeners: [],
    init: function () {
        if (this.data.rtdbRoomId !== " ") {
            this.listenRoom();
        }
    },
    getState: function () {
        return this.data;
    },
    setState: function (newState) {
        this.data = newState;
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var cb = _a[_i];
            cb();
        }
        // --------------------------
        console.log("State Changed", this.data);
    },
    subscribe: function (callback) {
        this.listeners.push(callback);
    },
    setEmailAndFullName: function (email, fullName) {
        var cs = this.getState();
        cs.email = email;
        cs.fullName = fullName;
        this.setState(cs);
    },
    signUp: function () {
        var _this = this;
        console.log("esto es el signUp");
        var cs = this.getState();
        fetch(API_BASE_URL + "/signup", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ email: cs.email, name: cs.fullName })
        }).then(function (res) {
            return res.json();
        }).then(function (data) {
            console.log(data);
            if (data.message == "user already exist") {
                state.singIn();
            }
            else {
                cs.userId = data.id;
                _this.setState(cs);
                _this.signIn();
            }
        });
    },
    singIn: function () {
        var _this = this;
        console.log("singIn");
        var cs = this.getState();
        if (cs.email) {
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ email: cs.email })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                if (data.id == undefined) {
                    _this.signUp();
                }
                else {
                    cs.userId = data.id;
                    _this.setState(cs);
                    if (state.data.roomId == "") {
                        _this.roomId();
                    }
                    else {
                        _this.accessToRoom();
                    }
                }
            });
        }
        else {
            console.error("No hay un email en el state");
        }
        // lunes 9/10/2023 19:16, agregar el endpoint signUp. Update: lunes 30/10/2023, ya estan todos los enpoints listos hace una semana.
    },
    roomId: function () {
        var _this = this;
        console.log("roomId");
        var cs = this.getState();
        if (cs.email) {
            fetch(API_BASE_URL + "/roomId", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: cs.userId })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                cs.roomId = data.id;
                _this.setState(cs);
                state.accessToRoom();
            });
        }
        else {
            console.error("No hay un email en el state");
        }
    },
    askNewRoom: function () {
        var _this = this;
        console.log("askNewRoom");
        var cs = this.getState();
        if (cs.userId) {
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: cs.userId })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                cs.roomId = data.id;
                _this.setState(cs);
                state.accessToRoom();
            });
        }
        else {
            console.error("No hay userId");
        }
    },
    accessToRoom: function () {
        var _this = this;
        console.log("accessToRoom");
        var cs = this.getState();
        var roomIdState = cs.roomId;
        var userIdState = cs.userId;
        fetch(API_BASE_URL + "/rooms/" + roomIdState + "?userId=" + userIdState)
            .then(function (res) {
            return res.json();
        }).then(function (data) {
            cs.rtdbRoomId = data.rtdbRoomId;
            _this.setState(cs);
            _this.listenRoom();
        });
    },
    listenRoom: function () {
        var _this = this;
        console.log("listenRoom");
        var cs = this.getState();
        var db = db_1.rtdb;
        var chatroomsRef = (0, database_1.ref)(db, "/rooms/" + cs.rtdbRoomId);
        (0, database_1.onValue)(chatroomsRef, (function (snapshot) {
            var val = snapshot.val();
            console.log(val);
            var messagesList = map(val.messages);
            console.log(messagesList);
            cs.messages = messagesList;
            _this.setState(cs);
            if (location.pathname !== "/chat") {
                router_1.Router.go("/chat");
            }
            ;
        }));
    },
    pushMessage: function (message) {
        console.log("mensaje del pushMessage:", message);
        var rtdbRoom = this.data.rtdbRoomId;
        var nombreDelState = this.data.fullName;
        var messagePack = { from: nombreDelState, message: message };
        var messages = state.data.messages;
        messages.push(messagePack);
        fetch(API_BASE_URL + "/messages", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                rtdbRoom: rtdbRoom,
                messages: messages
            }),
        });
    },
};
exports.state = state;
