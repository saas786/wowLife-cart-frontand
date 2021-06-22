import { createApp } from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueCookies from 'vue3-cookies'

import VueGoogleMaps from '@fawmi/vue-google-maps'

const app = createApp(App)

app.config.globalProperties.$baseDir = process.env.NODE_ENV === 'development' ? 'https://wanderfull.ru' : 'https://wowlife.club';

app.use(VueAxios, axios)
app.use(VueCookies)

app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyDmneI1xkAU_auXN74RVUKfJ0KnXAQzZq4',
    },
}).mount('#cart-vue')


