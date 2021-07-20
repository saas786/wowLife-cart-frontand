<template>
  <div class="row">
    <p class="h3 col-1">1 /</p>
    <div class="col-11">
      <p class="h3">Оформление заказа</p>
      <Name ref="nameDelivery"/>
      <Phone ref="phoneDelivery"/><br>
      <Email ref="emailDelivery"/>
    </div>
  </div>
  <div class="row" style="margin-top:80px">
    <p class="h3 col-1">2 /</p>
    <div class="col-11">
      <p class="h3">Способ получения</p>
      <div class="method-delivery">
        <span
          @click="
            $root.orderData.delivery = null;
            $root.orderData.type_order = 'fiz';
          "
          :class="[
            isNaN($root.orderData.delivery) == false || $root.orderData.delivery == null ? 'active' : '',
          ]"
        >
          Доставка курьером
        </span>
        <span
          @click="
            $root.orderData.delivery = 'pickup';
            $root.orderData.priceDelivery = 0;
            $root.orderData.type_order = 'fiz';
            $root.orderData.user_data.b_address = 'Санкт-Петербург, пр Медиков, д. 3'
          "
          :class="[
            $root.orderData.delivery == 'pickup' ? 'active' : '',
          ]"
        >
          Самовывоз
        </span>
        <span 
          @click="selOrderElectr"
          :class="[
            $root.orderData.delivery == 'electr' ? 'active' : '',
          ]"> Электронный сертификат </span>
      </div>
    </div>
  </div>
  <transition name="fadeDelivery">
    <div
      v-if="
        $root.orderData.type_order != 'electr' &&
        $root.orderData.delivery != 'pickup'
      "
      class="row"
    >
      <div class="col-1"></div>
      <div class="col-10">
        <div>
          <YandexMap :delivery="delivery" />
        </div>
        <div>
          <p class="h5">Дата и время доставки</p>
          <Date/>
        </div>
        <div class="col">
          <div class="d-flex justify-content-start">
            <div>
              <h6>Дополнительные услуги</h6>
              <div
                v-if="
                  $root.orderData.type_order == 'fiz' &&
                  Object.keys($root.orderData.productsAdd).length != 0
                "
              >
                <p v-for="item in $root.orderData.productsAdd" :key="item.id">
                  <input
                    type="checkbox"
                    :value="item.id"
                    v-on:click="checkAdditional($event.target)"
                    :checked="item.checked == 'Y' ? true : false"
                  />

                  {{ item.title }} {{ item.price }} 
                </p>
              </div>
            </div>             
          </div>
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
  
        </div>
        <div>

          Имя
        </div>
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
        Санкт-Петербург, пр Медиков, д. 3
        <GMapMap
          :center="center"
          :zoom="13"
          :options="{streetViewControl: false}"
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

        Ваша почта
        <Semail ref="semailElectr"/>

        почта получателя
      </div>
      <div class="col">
        <div class="d-flex justify-content-start">           
          <div
            v-if="
              $root.orderData.type_order == 'electr' &&
              Object.keys($root.orderData.productsAdd).length != 0
            "
          >
            <h6>Электронный сертификат</h6>
            <div v-for="item, index in sertificate" :key="index">
              <img :src='$baseDir + "/images/variant_image/7/" + item.path' 
                    @click="$root.orderData.sertSel=index; $root.orderData.priceDelivery = Number(item.price);"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <div>
    Комментарий<br />
    <Comment /> 
  </div>
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
import Date from "@/components/form/date.vue";
import delivery from "@/assets/delivery/deleveryZone.json";

export default {
  name: "Ordering",
  components: {
    YandexMap,
    Email,
    Semail,
    Phone,
    Name,
    Comment,
    Date
  },
  props: {
    sertificate: Object,
  },
  data() {
    return {
      delivery: delivery, 
      center: { lat: 59.96972758369692, lng: 30.315531657449316 },
      markers: [
        {
          position: {
            lat: 59.96972758369692,
            lng: 30.315531657449316,
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

        // if (this.$root.orderData.user_data.delivery_time == ""){
        //   document.getElementById("input_delivery_time").classList.add("error")
        //   emptyField += 1
        // } else {
        //   document.getElementById("input_delivery_time").classList.remove("error")
        // }

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
    checkAdditional(event) {
      if (event.checked === true) {
        this.$root.orderData.productsAdd[event.value]["checked"] = "Y";
      } else {
        this.$root.orderData.productsAdd[event.value]["checked"] = "N";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.method-delivery{
  margin-top: 30px;
  span{
    background: #EFEFEF;
    padding:10px 15px;
    margin-right: 20px;
    cursor: pointer;
  }
  span.active{
    background: #1CBBB3;
    color: white;
  }
}
p.h3{
  padding-right: 0;
}
p.h5{
  margin-top:35px;
}
.fadeDelivery-enter-active,
.fadeDelivery-leave-active {
  transition: opacity .5s linear;
}

.fadeDelivery-enter-from,
.fadeDelivery-leave-to {
  opacity: 0;
}
</style>
