import { onValue, ref } from "firebase/database"
import { rtdb } from "./db"
import * as map from "lodash/map"
const API_BASE_URL = "http://localhost:3000"
import { Router } from "@vaadin/router";
const state = {
    data: {
        email: "",
        fullName: "",
        userId: "",
        roomId: "",
        rtdbRoomId: "",
        messages: [],
    },
    listeners: [],
    init() {
        if (this.data.rtdbRoomId !== " ") {
            this.listenRoom()
        }

    },
    getState() {
        return this.data;
    },
    setState(newState) {
        this.data = newState;
        for (const cb of this.listeners) {
            cb();
        }
        // --------------------------
        console.log("State Changed", this.data)
    },
    subscribe(callback: (any) => any) {
        this.listeners.push(callback)
    },
    setEmailAndFullName(email: string, fullName: string) {
        const cs = this.getState();
        cs.email = email;
        cs.fullName = fullName;
        this.setState(cs);
    },
    signUp() {
        console.log("esto es el signUp")
        const cs = this.getState();
        fetch(API_BASE_URL + "/signup", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ email: cs.email, name: cs.fullName })
        }).then((res) => {
            return res.json();
        }).then(data => {
            console.log(data)
            if (data.message == "user already exist") {
                state.singIn();
            } else {
                cs.userId = data.id;
                this.setState(cs);
                this.signIn();
            }
        })
    },
    singIn() {
        console.log("singIn")
        const cs = this.getState()
        if (cs.email) {
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ email: cs.email })
            }).then((res) => {
                return res.json();
            }).then(data => {
                if (data.id == undefined) {
                    this.signUp();
                } else {
                    cs.userId = data.id;
                    this.setState(cs);
                    if (state.data.roomId == "") { this.roomId(); } else { this.accessToRoom(); }
                }
            })
        } else {
            console.error("No hay un email en el state");
        }
        // lunes 9/10/2023 19:16, agregar el endpoint signUp. Update: lunes 30/10/2023, ya estan todos los enpoints listos hace una semana.
    },
    roomId() {
        console.log("roomId");
        const cs = this.getState()
        if (cs.email) {
            fetch(API_BASE_URL + "/roomId", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: cs.userId })
            }).then((res) => {
                return res.json();
            }).then(data => {
                cs.roomId = data.id;
                this.setState(cs);
                state.accessToRoom();
            })
        } else {
            console.error("No hay un email en el state");
        }
    },
    askNewRoom() {
        console.log("askNewRoom");
        const cs = this.getState();
        if (cs.userId) {
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: cs.userId })
            }).then((res) => {
                return res.json();
            }).then(data => {
                cs.roomId = data.id;
                this.setState(cs);
                state.accessToRoom();
            })
        } else {
            console.error("No hay userId")
        }
    },
    accessToRoom() {
        console.log("accessToRoom");
        const cs = this.getState();
        const roomIdState = cs.roomId;
        const userIdState = cs.userId;
        fetch(API_BASE_URL + "/rooms/" + roomIdState + "?userId=" + userIdState)
            .then((res) => {
                return res.json();
            }).then(data => {
                cs.rtdbRoomId = data.rtdbRoomId;
                this.setState(cs);
                this.listenRoom();
            })
    },
    listenRoom() {
        console.log("listenRoom")
        const cs = this.getState();
        const db = rtdb;
        const chatroomsRef = ref(db, "/rooms/" + cs.rtdbRoomId);
        onValue(chatroomsRef, (snapshot => {
            const val = snapshot.val();
            console.log(val)
            const messagesList = map(val.messages);
            console.log(messagesList)
            cs.messages = messagesList
            this.setState(cs);
            if (location.pathname !== "/chat") { Router.go("/chat") };
        }))
    },
    pushMessage(message: string) {
        console.log("mensaje del pushMessage:", message)
        const rtdbRoom = this.data.rtdbRoomId;
        const nombreDelState = this.data.fullName;
        const messagePack = { from: nombreDelState, message: message }
        const messages = state.data.messages
        messages.push(messagePack)
        fetch(API_BASE_URL + "/messages", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                rtdbRoom: rtdbRoom,
                messages
            }),
        })
    },
}

export { state }