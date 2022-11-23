// https://icon-sets.iconify.design/line-md/plus/
import { createWebHistory, createRouter } from "vue-router"
import NewFlow from "./new-flow.vue"
import UIElements from "./ui-elements.vue"

const routes = [
    {
        path: "/",
        name: "UI Elements",
        component: UIElements,
    },
    {
        path: "/new-flow",
        name: "New flow",
        component: NewFlow,
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

