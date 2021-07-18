<template>
  <!-- <ul class="nav nav-tabs" v-if="$root.orderData.type_order != 'electr'">
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
  </ul> -->
  <div>
    Выбор способа доставки
    <span
      @click="
        $root.orderData.delivery = null;
        $root.orderData.type_order = 'fiz';
      "
    >
      Доставка курьером
    </span>
    <span
      @click="
        $root.orderData.delivery = 'pickup';
        $root.orderData.priceDelivery = 0;
        $root.orderData.type_order = 'fiz';
        $root.orderData.user_data.b_address = 'Санкт-Петербург, пр Медиков'
      "
    >
      Самовывоз
    </span>
    <span @click="selOrderElectr"> Электронный сертификат </span>
  </div>
  <transition name="fadeDelivery">
    <div
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
        <input
          id="input_delivery_time"
          name="delivery_time"
          type="text"
          @blur="setData($event.target)"
          @keyup.enter="onEnter($event.target)"
          :value="$root.orderData.user_data.delivery_time"
        />
      </div>
      <div>
        3.Способ оплаты<br />
        <p v-for="(item, key) in $root.orderData.payment" :key="item.id">
          <input
            name="oplata"
            type="radio"
            @click="$root.orderData.paymentSel = key"
            :checked="key == $root.orderData.paymentSel"
          />
          {{ item.title }}
        </p>
      </div>
      <div>
        4.Электронная почта<br />
        <Email ref="emailDelivery"/>
      </div>
      <div>
        5.Телефон<br />
        <Phone ref="phoneDelivery"/>
        <Name ref="nameDelivery"/>
        Имя
      </div>
      <div>
        6.Комментарий<br />
        <Comment /> 
      </div>
    </div>
  </transition>
  <transition name="fadeDelivery">
    <div
      v-if="
        $root.orderData.type_order != 'electr' &&
        $root.orderData.delivery == 'pickup'
      "
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
            @click="$root.orderData.paymentSel = key"
            :checked="key == $root.orderData.paymentSel"
          />
          {{ item.title }}
        </p>
      </div>
      <div>
        3.Электронная почта<br />
        <Email ref="emailPickup"/>
      </div>
      <div>
        4.Телефон<br />
        <Phone ref="phonePickup"/>
        <Name ref="namePickup"/>
        Имя
      </div>
      <div>
        5.Комментарий<br />
        <Comment /> 
      </div>
    </div>
  </transition>
  <transition name="fadeDelivery">
    <div v-if="$root.orderData.type_order == 'electr'">
      <div>
        1.Способ оплаты<br />
        <p v-for="(item, key) in $root.orderData.payment" :key="item.id">
          <input
            name="oplata"
            v-if="item.title == 'Банковская карта'"
            type="radio"
            @click="$root.orderData.paymentSel = key"
            :checked="key == $root.orderData.paymentSel"
          />
          {{ item.title }}
        </p>
      </div>
      <div>
        2.Электронная почта<br />
        <Email ref="emailElectr"/>
        Ваша почта
        <Semail ref="semailElectr"/>

        почта получателя
      </div>
      <div>
        3.Телефон<br />
        <Phone ref="phoneElectr"/>
        <Name ref="nameElectr"/>
        Имя
      </div>
      <div>
        4.Комментарий<br />
        <Comment /> 
      </div>
    </div>
  </transition>
  <div>
    <button v-on:click="ordering()">Подтвердить заказ</button>
  </div>
</template>
<script>
import YandexMap from "@/components/YandexMap.vue";
import Email from "@/components/form/email.vue";
import Semail from "@/components/form/s_email.vue";
import Phone from "@/components/form/phone.vue";
import Name from "@/components/form/name.vue";
import Comment from "@/components/form/comment.vue";
import delivery from "@/assets/delivery/deleveryZone.json";

export default {
  name: "Ordering",
  components: {
    YandexMap,
    Email,
    Semail,
    Phone,
    Name,
    Comment
  },
  props: {
    sertificate: Object,
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
    if (this.$root.orderData.type_order == "electr") {
      this.payments("card");
    } else {
      this.payments("nal");
    }
  },
  methods: {
    ordering: function () {
      let emptyField = 0;
      if (
        this.$root.orderData.delivery != "electr" &&
        this.$root.orderData.delivery != "pickup"
      ) {
        if (
          this.$root.orderData.user_data.b_address == "" ||
          this.$root.orderData.delivery == null ||
          this.$root.orderData.delivery == "null"
        ) {
          document.getElementById("addressInput").classList.add("error")
          emptyField += 1
        } else {
          document.getElementById("addressInput").classList.remove("error")
        }

        if (this.$root.orderData.user_data.delivery_time == ""){
          document.getElementById("input_delivery_time").classList.add("error")
          emptyField += 1
        } else {
          document.getElementById("input_delivery_time").classList.remove("error")
        }

        emptyField += this.$refs.emailDelivery.validation()
        emptyField += this.$refs.phoneDelivery.validation()
        emptyField += this.$refs.nameDelivery.validation()
      }
      
      if(this.$root.orderData.delivery == 'pickup'){
        emptyField += this.$refs.emailPickup.validation()
        emptyField += this.$refs.phonePickup.validation()
        emptyField += this.$refs.namePickup.validation()
      }

      if(this.$root.orderData.delivery == 'electr'){
        emptyField += this.$refs.emailElectr.validation()
        emptyField += this.$refs.semailElectr.validation()
        emptyField += this.$refs.phoneElectr.validation()
        emptyField += this.$refs.nameElectr.validation()
      }

      
      if (emptyField == 0) {
        let dataSend = this.$root.orderData;
        if (dataSend.delivery == 'pickup'){
          dataSend.delivery = this.delivery[0].id
        }
        dataSend['payment_id'] = dataSend.paymentSel
        dataSend['shipping_id'] = dataSend.delivery

        //добавить всем товарам сертификат как опцию, если заказ electr
        let data = {
          params: {
            entity: "ordering",
            data: dataSend
          },
        };
        this.$root.loader = 'Оформление заказа'
        this.axios
          .get(`${this.$baseDir}/cart/custom-rest/index.php`, data)
          .then((response) => {
            console.log("Заказ оформлен!");
            console.log(response.data);
            if(response.data.paymentURL){
              document.location.href = response.data.paymentURL
            } else {
              document.location.href = this.$baseDir + '/zakaz-uspeshno-oformlen-1?Success=true&OrderId=' + response.data.orderId
            }
          });
      }
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
            this.$root.orderData.paymentSel = key;
          }
        }
      }
    },
    selOrderElectr() {
      for (let key in this.sertificate) {
        if (this.$root.orderData.sertSel == "") {
          this.$root.orderData.sertSel = this.sertificate[key].variant_id;
        }
        this.$root.orderData.priceDelivery = Number(
          this.sertificate[key].price
        );
        break;
      }
      this.$root.orderData.delivery = "electr";
      this.$root.orderData.type_order = "electr";
    },
    onEnter(event) {
      event.blur();
    },
    setData(event) {
      this.$root.orderData.user_data[event.name] = event.value;
    },
  },
};
</script>
<style scoped>
.fadeDelivery-enter-active,
.fadeDelivery-leave-active {
  transition: opacity .5s linear;
}

.fadeDelivery-enter-from,
.fadeDelivery-leave-to {
  opacity: 0;
}
</style>
