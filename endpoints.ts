import express from "express";
import { rtdb, fsdb } from "./src/db";
import { get, ref, set } from "firebase/database"
import { doc, collection, addDoc, getDoc, getDocs, where, query, setDoc, Timestamp, QuerySnapshot, QueryDocumentSnapshot } from "firebase/firestore"
import cors from "cors"
require("dotenv").config()
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

const usersRef = collection(fsdb, "users")
const roomsRef = collection(fsdb, "rooms")
const roomShortId = 1000 + Math.floor(Math.random() * 999)
const createDocRoomsRef = doc(fsdb, "rooms/" + roomShortId.toString())

// -----------------------------------------------



app.post("/signup", function (req, res) {
    const email = req.body.email; const name = req.body.name;
    console.log("datos en el sign up:" + email, name)
    const q = query(usersRef, where("email", "==", email))
    getDocs(q).then(searchRes => {
        if (searchRes.empty) {
            console.log("vacio")
            addDoc(usersRef, { email, name }).then(newUserRef => {
                res.json({ id: newUserRef.id, new: true })
            })
        } else { console.log("no está vacio"); res.status(400).json({ message: "user already exist" }) }
    })
});

// -----------------------------------------------

app.post("/signin", (req, res) => {
    const { email } = req.body
    console.log("---------------------------")
    console.log("email en el sign in:", email);
    const q = query(usersRef, where("email", "==", email))
    getDocs(q).then(searchRes => {
        if (searchRes.empty) {
            res.status(404).json({
                message: "not found"
            })
        } else {
            res.json({
                id: searchRes.docs[0].id
            })
        }
    })
})

// -----------------------------------------------

app.post("/roomid", (req, res) => {
    const userId = req.body.userId
    console.log("---------------------------")
    console.log("nombre en el roomId:", userId);
    const q = query(roomsRef, where("userId", "==", userId));
    getDocs(q).then(searchRes => {
        // if (searchRes.empty) {
        //     res.status(404).json({
        //         message: "not found"
        //     })
        // } else {
        res.json(
            {
                id: searchRes.docs[0].id
            }
        )
        // }
    })
})

// -----------------------------------------------

app.post("/messages", (req, res) => {
    console.log("---------------------------")
    console.log("esto es el endpoint message")
    const { rtdbRoom } = req.body
    console.log("RTDB:", rtdbRoom)
    const { from } = req.body
    console.log("FROM:", from)
    const { messages } = req.body
    console.log("MESSAGE:", messages)

    const rtdbRoomsRef = ref(rtdb, "rooms/" + rtdbRoom)
    set(rtdbRoomsRef, {
        messages: messages,
    }).then(() => { res.json({ resMessage: "Message sent" }) })
})

// -----------------------------------------------

app.get("/rooms/:roomId", function (req, res) {
    const { userId } = req.query;
    const { roomId } = req.params;
    console.log(userId, roomId)

    const docRoomsRef = doc(fsdb, "rooms/", roomId)
    getDoc(doc(usersRef, userId.toString())).then(doc => {
        if (doc.exists()) {
            getDoc(docRoomsRef).then((snap) => {
                const data = snap.data();
                console.log("---------------------------")
                console.log("roomData:", data)
                res.json(data)
            });
        } else {
            res.status(401).json({ message: "Necesitas crear una cuenta para crear una room" });
        };
    });
});

app.get("*", () => { __dirname + "/dist/index.html" })


app.listen(port, () => {
    console.log(`Example app listening at http://prochats.onrender.com:${port}`)
})