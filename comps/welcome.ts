import { state } from "../src/state";

customElements.define("welc-el", class Welcome extends HTMLElement {
    connectedCallback() {
        console.log("nodeEnv.env:", process.env.NODE_ENV)
        console.log("appSecret.env:", process.env.APP_SECRET)
        console.log("apibaseurl.env:", process.env.API_BASE_URL)
        fetch(process.env.API_BASE_URL + "/api/welcome", {}).then((res) => {
            res.json()
        }).then((data) => { console.log(data) })
        this.render();
        this.listeners();
    }
    listeners() {
        const roomOption = {
            room: {}
        };
        const buttonExistantRoom = this.querySelector(".existant-room");
        buttonExistantRoom.addEventListener("click", (e) => {
            e.preventDefault();
            roomOption.room = "existant";
            console.log(roomOption)
            const newRoomId = this.querySelector(".form-room-id") as HTMLElement;
            newRoomId.style.display = "flex";
        });

        const buttonNewRoom = this.querySelector(".new-room") as HTMLElement
        buttonNewRoom.addEventListener("click", (e) => {
            e.preventDefault();
            roomOption.room = "new";
            console.log(roomOption);
            const newRoomId = this.querySelector(".form-room-id") as HTMLElement;
            newRoomId.style.display = "none";
        });

        const form = this.querySelector(".form") as HTMLElement;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const form = e.target as any
            const email = form.email.value;
            const name = form.name.value;
            const roomId = form.room.value;
            state.setEmailAndFullName(email, name)
            state.data.roomId = roomId;
            if (roomOption.room === "existant") {
                console.log("adentro del existant")
                state.singIn()
            } else if (roomOption.room === "new") {
                state.signUp();
            }
        })
    }
    render() {
        const div = document.createElement("div")
        div.innerHTML = `
        <div class="header"></div>
        <h2 class="title">Bienvenidos</h2>
        <form class="form" method="post">
        <fieldset>
            <label for="email" class="form-email__label">
                Email
                <input type="email" class="email" name="email" id="email">
            </label>
            <label for="name" class="form-name__label">
                Tu Nombre
                <input type="text" class="name" name="name" id="name">
            </label>

            <div class="form-div">
            <button class="text">Seleccionar Room</button>
            <div for="room" class="form__room">
                <button class="new-room">Nuevo Room</button>
                <button class="existant-room">Room Existente</button>
            </div>
            </div>
            
            <div class="form-room-id">
             Room Id
             <input type="text" class="room-id" name="room">
            </div>
        </fieldset>
            <button type="submit" class="form-button">Comenzar</button>
            </form>
`;
        const style = document.createElement("style");
        style.textContent = `
        *{
            box-sizing:border-box;
        }
        body{
            margin:0
        }
        .header{
            background-color: rgba(255, 130, 130, 1);
            width:375px;
            height:60px;
        }
        .title{
            text-align: center;
            width:375px;
        }
        .email, .name, .room-id {
            border: solid 2px; 
            border-radius: 6px;
        }    
        .form{
            display: flex;
            flex-direction: column;
            gap:10px;
            width:375px;
            padding: 30px;
        }
        .form-email__label,
        .form-name__label {
            display: flex;
            flex-direction: column;
            gap:10px;            
        }
        .form-div{
            border: solid 3px yellow;
        }
        .form__room {
            display:flex;
            flex-direction: column;
            padding: 0;
            z-index:999;
            list-style: none;
            background-color: rgba(255, 130, 130, 1);            
        }
        .new-room, .existant-room {
           display: flex;
           width: 100%;
           flex-grow: 1;
          position: relative;                            
            text-decoration: none;
            text-align: center;
            background:transparent;
            border:solid yellow 2px;
        }      
        .text{
            display: flex;
            width: 100%;
            flex-grow: 1;
            background:transparent;
            text-decoration: none;
            border: none;
        }
      
        .existant-room:hover {
            background-color: green;
        }
        .new-room:hover{
            background-color: green;
        }
     
        .form-room-id {
            display: none;
            flex-direction: column;
        }

        .existant-room:focus + .form-room-id {
            display:flex;
        }
`;
        this.appendChild(div);
        this.appendChild(style);
    };

})