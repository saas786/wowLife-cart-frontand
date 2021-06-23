<template>
  <div id="oredering" class="container">
    <ul class="nav nav-tabs" v-if="$root.orderData.type_order != 'electr'">
      <li class="nav-item">
        <a
          class="nav-link"
          aria-current="page"
          href="#"
          v-on:click="$root.orderData.delivery = null"
          :class="[$root.orderData.delivery != this.delivery[0]['id'] ? 'active' : '']"
        >
          Доставка
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="#"
          v-on:click="$root.orderData.delivery = this.delivery[0]['id']"
          :class="[$root.orderData.delivery == this.delivery[0]['id'] ? 'active' : '']"
        >
          Самовывоз
        </a>
      </li>
    </ul>
    <div class="row" >
      <div class="col-9" v-if="$root.orderData.type_order != 'electr' && $root.orderData.delivery != this.delivery[0]['id']">
        <div>
          1.Адрес доставки<br />
          <YandexMap :delivery="delivery"/>
        </div>
        <div>
          2.Время доставки<br />
          <input type="text" />
        </div>
        <div>
          3.Способ оплаты<br />
          <p><input name="oplata" type="radio" value="1" /> Наличными</p>
          <p>
            <input name="oplata" type="radio" value="2" /> Банковской картой
          </p>
        </div>
        <div>
          4.Электронная почта<br />
          <input type="text" />
        </div>
        <div>
          5.Телефон<br />
          <input type="text" />
        </div>
        <div>
          6.Комментарий<br />
          <input type="text" />
        </div>
        <div>
          Сумма заказа: 5000<br />
          <button v-on:click="ordering()">Подтвердить заказ</button>
        </div>
      </div>

      <div class="col-9" v-if="$root.orderData.delivery == this.delivery[0]['id']">
        <div>
          1.Адрес самовывоза<br />
          <p><input name="address" type="radio" value="1" /> СПб</p>
          <p><input name="address" type="radio" value="2" /> Сельцо</p>
        </div>
        <div>
          2.Способ оплаты<br />
          <p><input name="oplata" type="radio" value="1" /> Наличными</p>
          <p>
            <input name="oplata" type="radio" value="2" /> Банковской картой
          </p>
        </div>
        <div>
          3.Электронная почта<br />
          <input type="text" />
        </div>
        <div>
          4.Телефон<br />
          <input type="text" />
        </div>
        <div>
          5.Комментарий<br />
          <input type="text" />
        </div>
        <div>
          Сумма заказа: 5000<br />
          <button v-on:click="ordering()">Подтвердить заказ</button>
        </div>
      </div>

      <div class="col-9" v-if="$root.orderData.type_order == 'electr'">
        <div>
          1.Способ оплаты<br />
          Банковской картой
        </div>
        <div>
          2.Электронная почта<br />
          <input type="text" /> Ваша почта <input type="text" /> почта
          получателя
        </div>
        <div>
          3.Телефон<br />
          <input type="text" />
        </div>
        <div>
          4.Комментарий<br />
          <input type="text" />
        </div>
        <div>
          Сумма заказа: 5000<br />
          <button v-on:click="ordering()">Подтвердить заказ</button>
        </div>
      </div>
      <div class="col-3">
        <button v-on:click="ordering()">Подтвердить заказ</button>
      </div>
    </div>
  </div>
</template>
<script>
import YandexMap from '../components/YandexMap.vue'
import delivery from '@/assets/delivery/deleverySPb.json'

export default {
name: "Ordering",
components:{
    YandexMap
  },
  data() {
    return {
        delivery: delivery
    };
  },
  mounted() {
      if(this.$root.orderData.delivery == 'pickup'){
          this.$root.orderData.delivery = this.delivery[0]['id']
      }
  },
  methods: {
    ordering() {
      let data = {
        params: {
            "entity": "ordering",
            "data": {
                "products": {
                    "241": {
                        "amount": 1,
                    },
                },
                "user_id": 0,
            }
        }
      };
      this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, data).then((response) => {
        alert("Заказ оформлен!");
        console.log(response.data)
      })
    },
  },
};

</script>
<style>
</style>
