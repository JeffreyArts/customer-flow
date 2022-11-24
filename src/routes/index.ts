// https://icon-sets.iconify.design/line-md/plus/
import { createWebHistory, createRouter } from "vue-router"
import NewFlow from "./new-flow.vue"
import flow from "./flow.vue"
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
    },
    {
        path: "/flow/:flowId",
        name: "Flow",
        component: flow,
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

