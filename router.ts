import "./comps/welcome.ts"
import "./comps/chat.ts"
import { Router } from "@vaadin/router";


const root = document.querySelector(".root")
const router = new Router(root);
router.setRoutes([
    { path: "/", component: "welc-el" },
    { path: "/chat", component: "chatr-el" },
]);