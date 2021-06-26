<template>
  <div id="oredering" class="container">
    <ul class="nav nav-tabs" v-if="$root.orderData.type_order != 'electr'">
      <li class="nav-item">
        <a
          class="nav-link"
          aria-current="page"
          href="#"
          v-on:click="
            $root.orderData.delivery = null;
          "
          :class="[
            $root.orderData.delivery != 'pickup' ? 'active' : '',
          ]"
        >
          Доставка
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="#"
          v-on:click="
            $root.orderData.delivery = 'pickup';
            $root.orderData.priceDelivery = 0;
          "
          :class="[
            $root.orderData.delivery == 'pickup' ? 'active' : '',
          ]"
        >
          Самовывоз
        </a>
      </li>
    </ul>
    <div class="row">
      <div
        class="col-9"
        v-if="
          $root.orderData.type_order != 'electr' &&
          $root.orderData.delivery != 'pickup'
        "
      >
        <div>
          1.Адрес доставки<br />
          <YandexMap :delivery="delivery" />
        </div>
        <div>
          2.Время доставки<br />
          <input name="delivery_time" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.delivery_time"/>
        </div>
        <div>
          3.Способ оплаты<br />
          <p v-for="(item, key) in $root.orderData.payment" :key="item.id">
            <input
              name="oplata"
              type="radio"
              v-on:click="$root.orderData.paymentSel = key"
              :checked="key == $root.orderData.paymentSel"
            />
            {{ item.title }}
          </p>
        </div>
        <div>
          4.Электронная почта<br />
          <input name="email" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.email"/>
        </div>
        <div>
          5.Телефон<br />
          <input name="b_phone" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.b_phone"/>
          <input name="b_firstname" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.b_firstname"/> Имя
        </div>
        <div>
          6.Комментарий<br />
          <input name="comment" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.comment"/>
        </div>
        <div>
          Сумма заказа: 5000<br />
          <button v-on:click="ordering()">Подтвердить заказ</button>
        </div>
      </div>

      <div
        class="col-9"
        v-if="$root.orderData.type_order != 'electr' && $root.orderData.delivery == 'pickup'"
      >
        <div>
          1.Адрес самовывоза<br />
          <!-- <p><input name="address" type="radio" value="1" /> СПб</p> -->
          Санкт-Петербург, пр Медиков
          <GMapMap
            :center="center"
            :zoom="9"
            map-type-id="roadmap"
            style="width: 500px; height: 300px"
          >
            <GMapCluster>
              <GMapMarker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :clickable="false"
                :draggable="false"
                @click="center = m.position"
              />
            </GMapCluster>
          </GMapMap>
        </div>
        <div>
          2.Способ оплаты<br />
          <p v-for="(item, key) in $root.orderData.payment" :key="item.id">
            <input
              name="oplata"
              type="radio"
              v-on:click="$root.orderData.paymentSel = key"
              :checked="key == $root.orderData.paymentSel"
            />
            {{ item.title }}
          </p>
        </div>
        <div>
          3.Электронная почта<br />
          <input name="email" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.email"/>
        </div>
        <div>
          4.Телефон<br />
          <input name="b_phone" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.b_phone"/>
          <input name="b_firstname" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.b_firstname"/> Имя
        </div>
        <div>
          5.Комментарий<br />
          <input name="comment" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.comment"/>
        </div>
        <div>
          Сумма заказа: 5000<br />
          <button v-on:click="ordering()">Подтвердить заказ</button>
        </div>
      </div>

      <div class="col-9" v-if="$root.orderData.type_order == 'electr'">
        <div>
          1.Способ оплаты<br />
          <p v-for="(item, key) in $root.orderData.payment" :key="item.id">
            <input
              name="oplata"
              v-if="item.title == 'Банковская карта'"
              type="radio"
              v-on:click="$root.orderData.paymentSel = key"
              :checked="key == $root.orderData.paymentSel"
            />
            {{ item.title }}
          </p>
        </div>
        <div>
          2.Электронная почта<br />
          <input name="email" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.email"/> Ваша почта 
          <input name="s_email" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.s_email"/> почта получателя
        </div>
        <div>
          3.Телефон<br />
          <input name="b_phone" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.b_phone"/>
          <input name="b_firstname" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.b_firstname"/> Имя
        </div>
        <div>
          4.Комментарий<br />
         <input name="comment" type="text" v-on:blur="setData($event.target)" v-on:keyup.enter="onEnter($event.target)" :value="$root.orderData.user_data.comment"/>
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
import YandexMap from "../components/YandexMap.vue";
import delivery from "@/assets/delivery/deleverySPb.json";

export default {
  name: "Ordering",
  components: {
    YandexMap,
  },
  data() {
    return {
      delivery: delivery,
      center: { lat: 59.939096, lng: 30.314121 },
      markers: [
        {
          position: {
            lat: 59.939096,
            lng: 30.314121,
          },
        },
      ],
    };
  },
  mounted() {

    if (this.$root.orderData.type_order == 'electr'){
      this.payments("card")
    } else {
      this.payments("nal")
    }
  },
  methods: {
    ordering() {
      //не забыть pickup в id
      // if (this.$root.orderData.delivery == "pickup") {
      //   this.$root.orderData.delivery = this.delivery[0]["id"];
      // }
      let data = {
        params: {
          entity: "ordering",
          data: {
            products: {
              241: {
                amount: 1,
              },
            },
            user_id: 0,
          },
        },
      };
      this.axios
        .get(`${this.$baseDir}/cart/custom-rest/index.php`, data)
        .then((response) => {
          alert("Заказ оформлен!");
          console.log(response.data);
        });
    },
    payments(typePayments) {
      var key = null;
      if (typePayments == "card") {
        for (key in this.$root.orderData.payment) {
          if (
            this.$root.orderData.payment[key].title.includes("Банковская карта")
          ) {
            this.$root.orderData.paymentSel = key;
          }
        }
      }
      if (typePayments == "nal") {
        for (key in this.$root.orderData.payment) {
          if (this.$root.orderData.payment[key].title.includes("Наличными")) {
            this.$root.orderData.paymentSel = key
          }
        }
      }
    },
    onEnter(event) {
      event.blur();
    },
    setData(event){
      this.$root.orderData.user_data[event.name] = event.value
    }
  },
};
</script>
<style>
</style>
