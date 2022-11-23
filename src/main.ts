import { createApp, markRaw } from "vue";
import router from "./routes";
import App from "./App.vue";
import { createPinia } from "pinia";
import { Router } from "vue-router";
const pinia = createPinia();

pinia.use(({ store }) => {
    store.router = markRaw(router);
});

declare module "pinia" {
    export interface PiniaCustomProperties {
      // by using a setter we can allow both strings and refs
    //   set router(value: string | Ref<string>)
      router: Router 
  
      // you can define simpler values too
    //   simpleNumber: number
    }
  }

createApp(App)
    .use(pinia)
    .use(router)
    .mount("#app");

