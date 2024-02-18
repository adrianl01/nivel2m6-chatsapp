"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("./src/db");
var database_1 = require("firebase/database");
var firestore_1 = require("firebase/firestore");
var cors_1 = require("cors");
var port = 3000;
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static("dist"));
var usersRef = (0, firestore_1.collection)(db_1.fsdb, "users");
var roomsRef = (0, firestore_1.collection)(db_1.fsdb, "rooms");
var roomShortId = 1000 + Math.floor(Math.random() * 999);
var createDocRoomsRef = (0, firestore_1.doc)(db_1.fsdb, "rooms/" + roomShortId.toString());
// -----------------------------------------------
app.post("/signup", function (req, res) {
    var email = req.body.email;
    var name = req.body.name;
    console.log("datos en el sign up:" + email, name);
    var q = (0, firestore_1.query)(usersRef, (0, firestore_1.where)("email", "==", email));
    (0, firestore_1.getDocs)(q).then(function (searchRes) {
        if (searchRes.empty) {
            console.log("vacio");
            (0, firestore_1.addDoc)(usersRef, { email: email, name: name }).then(function (newUserRef) {
                res.json({ id: newUserRef.id, new: true });
            });
        }
        else {
            console.log("no está vacio");
            res.status(400).json({ message: "user already exist" });
        }
    });
});
// -----------------------------------------------
app.post("/signin", function (req, res) {
    var email = req.body.email;
    console.log("---------------------------");
    console.log("email en el sign in:", email);
    var q = (0, firestore_1.query)(usersRef, (0, firestore_1.where)("email", "==", email));
    (0, firestore_1.getDocs)(q).then(function (searchRes) {
        if (searchRes.empty) {
            res.status(404).json({
                message: "not found"
            });
        }
        else {
            res.json({
                id: searchRes.docs[0].id
            });
        }
    });
});
// -----------------------------------------------
app.post("/roomid", function (req, res) {
    var userId = req.body.userId;
    console.log("---------------------------");
    console.log("nombre en el roomId:", userId);
    var q = (0, firestore_1.query)(roomsRef, (0, firestore_1.where)("userId", "==", userId));
    (0, firestore_1.getDocs)(q).then(function (searchRes) {
        // if (searchRes.empty) {
        //     res.status(404).json({
        //         message: "not found"
        //     })
        // } else {
        res.json({
            id: searchRes.docs[0].id
        });
        // }
    });
});
// -----------------------------------------------
app.post("/messages", function (req, res) {
    console.log("---------------------------");
    console.log("esto es el endpoint message");
    var rtdbRoom = req.body.rtdbRoom;
    console.log("RTDB:", rtdbRoom);
    var from = req.body.from;
    console.log("FROM:", from);
    var messages = req.body.messages;
    console.log("MESSAGE:", messages);
    var rtdbRoomsRef = (0, database_1.ref)(db_1.rtdb, "rooms/" + rtdbRoom);
    (0, database_1.set)(rtdbRoomsRef, {
        messages: messages,
    }).then(function () { res.json({ resMessage: "Message sent" }); });
});
// -----------------------------------------------
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    console.log(userId, roomId);
    var docRoomsRef = (0, firestore_1.doc)(db_1.fsdb, "rooms/", roomId);
    (0, firestore_1.getDoc)((0, firestore_1.doc)(usersRef, userId.toString())).then(function (doc) {
        if (doc.exists()) {
            (0, firestore_1.getDoc)(docRoomsRef).then(function (snap) {
                var data = snap.data();
                console.log("---------------------------");
                console.log("roomData:", data);
                res.json(data);
            });
        }
        else {
            res.status(401).json({ message: "Necesitas crear una cuenta para crear una room" });
        }
        ;
    });
});
app.get("*", function () { __dirname + "/dist/index.html"; });
app.listen(port, function () {
    console.log("Example app listening at http://localhost:".concat(port));
});
