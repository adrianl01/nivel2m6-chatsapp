import { state } from "../src/state";
type Message = {
    from: string,
    message: string
}
customElements.define("chatr-el",
    class ChatRoom extends HTMLElement {
        messages: Message[] = [];
        connectedCallback() {
            if (state.data.rtdbRoomId !== " ") {
                console.log("RENDERR")
                this.render();
            }
            if (this.messages.length == 0) {
                const currentState = state.getState();
                this.messages = currentState.messages;
                this.addMessage();
            }
            state.subscribe(() => {
                console.log("SUBSCRIBE")
                const currentState = state.getState();
                this.messages = currentState.messages;
                this.addMessage()
            })
        }
        addlisteners() {
            const form = this.querySelector(".form");
            form?.addEventListener("submit", function (e) {
                e.preventDefault()
                const target = e.target as any;
                const formInput = target.input.value;
                console.log("formInput:", formInput)
                state.pushMessage(formInput);

            });
        }
        addMessage() {
            console.log("addMessage")
            const feedEl = this.querySelector(".feed").childNodes
            console.log(feedEl.length)
            if (feedEl.length == 1) {
                this.messages.map((m) => {
                    const div = document.createElement("div")
                    div.innerHTML =
                        `<div class="message-from">From:${m.from}</div>
                         <div class="message-message">${m.message}</div>
                        `;
                    if (state.data.fullName == m.from) { div.classList.add("message2"); }
                    if (state.data.fullName !== m.from) { div.classList.add("message"); }
                    const feedEl = this.querySelector(".feed").childNodes
                    // if (feedEl.length > 0) {
                    //     feedEl.forEach((c) => {
                    //         const message = c.childNodes[2]?.textContent
                    //         if (message !== m.message) { }
                    //     })
                    // }
                    if (m.from == "") { } else {
                        return this.querySelector(".feed").appendChild(div);
                    }
                })
            } else {
                const m = this.messages.slice(-1);
                const div = document.createElement("div")
                div.innerHTML =
                    `<div class="message-from">From:${m[0].from}</div>
                     <div class="message-message">${m[0].message}</div>
                    `;
                if (state.data.fullName == m[0].from) { div.classList.add("message2"); }
                if (state.data.fullName !== m[0].from) { div.classList.add("message"); }
                const feedEl = this.querySelector(".feed").childNodes
                if (feedEl.length > 0) {
                    feedEl.forEach((c) => {
                        const message = c.childNodes[2]?.textContent
                        if (message !== m[0].message) { }
                    })
                }
                return this.querySelector(".feed").appendChild(div);
            }
        }
        render() {
            console.log("EL RENDER RENDERIZZA")
            const roomId = state.getState().roomId;
            const div = document.createElement("div");
            div.innerHTML = `
            <div class="absolute">
            <header class="header">Id del Room:${roomId}</header>
            <h2 class="title">Chat</h2>        
            </div>
            <div class="feed">
           </div>
           <form class="form">    
               <fieldset>              
                <input class="class-input" type="text" name="input">
               <fieldset/>    
                   <button type="submit" class="button">Enviar</button>
           </form>
                `;
            const style = document.createElement("style")
            style.textContent = `       
            *{box-sizing:border-box;}
            body {margin:0}
                .root {
                    width: 100%;
                    font-family: 'Roboto', sans-serif;
                    min-height: 667px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }            
                .absolute{
                    position: sticky;    
                    top:0;   
                    z-index:1;
                }            
                .header {
                    padding-left:10px;
                    width: 375px;
                    height: 60px;
                    background-color: palegreen;
                    display:flex;
                    justify-content: start;
                    align-items: center;
                }
                .title {
                    font-family: 'Roboto', sans-serif;
                    text-align: center;
                    font-size: 80;
                    background-color: aquamarine;
                    margin: 0;
                }
                .feed{
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    width: 375px;
                    background-color:green;
                    z-index: 0;
                }
            .form {
                display: flex;
                flex-direction: column;
                gap: 7px;
                background-color: aquamarine;
                padding: 10px 5px;
                position:sticky;
                display: flex;
                flex-direction: column;
                align-items: end;
                text-align:center;
                bottom: 0;
                z-index:1;
            }
            .label {
                font-size: 25;
            }
            .class-input {
                width: 312px;
                height: 55px;
                border-radius: 5px;
                font-size: 20px;
                border: solid black 3px;
            }
            .button {
                width: 312px;
                height: 55px;
                border-radius: 5px;
                font-size: 20px;
                border: solid black 3px;
            }
            .button:active {
                background-color: aqua;
            }
            .message {
                border: solid black 3px;
                display:flex;
                flex-direction:column;
                text-align:start;
                gap:4px;
            }
            .message2 {
                border: solid black 3px;
                display:flex;
                flex-direction:column;
                text-align:end;
                gap:4px;
            }
            .message-from {
                color: aquamarine;
            } 
            .message-message {
                color: white;
            }
            `;
            div.classList.add("root")
            this.appendChild(style);
            this.appendChild(div);
            this.addlisteners();
        }
    }
)


