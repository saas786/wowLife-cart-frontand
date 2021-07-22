<template>
  <div class="row">
    <p class="h3 col-1">1 /</p>
    <div class="col-11">
      <p class="h3">Оформление заказа</p>
      <Name ref="nameDelivery" />
      <Phone ref="phoneDelivery" /><br />
      <Email ref="emailDelivery" />
    </div>
  </div>
  <div class="row" style="margin-top: 80px">
    <p class="h3 col-1">2 /</p>
    <div class="col-11">
      <p class="h3">Способ получения</p>
      <div class="method-delivery">
        <span
          @click="selDelivery('delivery')"
          :class="[
            isNaN($root.orderData.delivery) == false ||
            $root.orderData.delivery == null
              ? 'active'
              : '',
          ]"
        >
          Доставка курьером
        </span>
        <span
          @click="selDelivery('pickup')"
          :class="[$root.orderData.delivery == 'pickup' ? 'active' : '']"
        >
          Самовывоз
        </span>
        <span
          @click="selDelivery('electr')"
          :class="[$root.orderData.delivery == 'electr' ? 'active' : '']"
        >
          Электронный сертификат
        </span>
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
        <div class="row">
          <YandexMap :delivery="delivery" />
        </div>
        <div class="row">
          <p class="h5">Дата и время доставки</p>
          <Date />
        </div>
        <Postcard />
        <AddProductions/>
      </div>
    </div>
  </transition>
  <transition name="fadeDelivery">
    <div
      v-if="
        $root.orderData.type_order != 'electr' &&
        $root.orderData.delivery == 'pickup'
      "
      class="row"
    >
      <div class="col-1"></div>
      <div class="col-10">
        <p style="margin-top:35px;">Санкт-Петербург, пр Медиков, д. 3</p>
        <GMapMap
          :center="center"
          :zoom="13"
          :options="{ streetViewControl: false }"
          map-type-id="roadmap"
          style="width: 100%; height: 300px"
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
        <Postcard />
        <AddProductions/>
      </div>
    </div>
  </transition>
  <transition name="fadeDelivery">
    <div v-if="$root.orderData.type_order == 'electr'" class="row sertificate">
      <div class="col-1"></div>
      <div class="col-10">
          <p class="h5">Выберите дизайн сертификата</p>
          <div
            v-if="
              $root.orderData.type_order == 'electr' &&
              Object.keys($root.orderData.productsAdd).length != 0
            "
            class="row"
          >
            <div 
              v-for="(item, index) in sertificate" 
              :key="index" 
              class="col-3"
              
            >
              <div :class="{active:$root.orderData.sertSel == index}">
                <Sertificate :path="$baseDir + '/images/variant_image/7/' + item.path"/>               
                <button
                  @click="
                    $root.orderData.sertSel = index;
                    $root.orderData.priceDelivery = Number(item.price);
                  "
                >
                  Выбрать</button>
              </div>
            </div>
          </div>

          <Semail ref="semailElectr" />
      </div>
    </div>
  </transition>
  <div class="row" style="margin-top: 80px">
    <p class="h3 col-1">3 /</p>
    <div class="col-11">
      <p class="h3">Оплата</p>
      <div class="d-flex justify-content-start" v-if="$root.orderData.type_order != 'electr'">
        <div
          class="pay"
          v-for="(item, key) in $root.orderData.payment"
          :key="item.id"
          :class="{ active: $root.orderData.paymentSel == key }"
          @click="$root.orderData.paymentSel = key"
        >
          {{ item.title }}
        </div>
      </div>
      <div class="d-flex justify-content-start" v-else>
        <div
          v-for="(item, key) in $root.orderData.payment"
          :key="item.id"
        >
          <div
            class="pay"
            :class="{ active: $root.orderData.paymentSel == key }"
            @click="$root.orderData.paymentSel = key"
            v-if="item.title == 'Банковская карта'"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row" style="margin-top: 45px">
    <p class="h3 col-1"></p>
    <div class="col-10">
      <Comment />
      <button class="ordering" @click="ordering()">ОФОРМИТЬ ЗАКАЗ</button>
      <div :class="{orderingError:orderingError}" v-show="orderingError">Заполните все необходимые поля</div>
      <p class="personal-data">
        <span id="personal-data"><input type="checkbox" @click="personalData =! personalData"></span>
        <span >Согласен на <a href="#">обработку персональных данных</a> и <a href="#">правилами пользования
        сертификатом</a></span>
      </p>
    </div>
  </div>
  <div></div>
</template>
<script>
import YandexMap from "@/components/YandexMap.vue";
import Email from "@/components/form/email.vue";
import Semail from "@/components/form/s_email.vue";
import Phone from "@/components/form/phone.vue";
import Name from "@/components/form/name.vue";
import Comment from "@/components/form/comment.vue";
import Date from "@/components/form/date.vue";
import Postcard from "@/components/form/postcard.vue";
import AddProductions from "@/components/form/addProductions.vue";
import Sertificate from "@/components/form/sertImage.vue";
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
    Date,
    Postcard,
    AddProductions,
    Sertificate
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
      orderingError: false,
      personalData: false
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
          document.getElementById("addressInput").classList.add("error");
          emptyField += 1;
        } else {
          document.getElementById("addressInput").classList.remove("error");
        }
      }

      emptyField += this.$refs.emailDelivery.validation();
      emptyField += this.$refs.phoneDelivery.validation();
      emptyField += this.$refs.nameDelivery.validation();

      if(this.personalData === false){
        emptyField += 1;
        document.getElementById("personal-data").classList.add("error")
      } else {
        document.getElementById("personal-data").classList.remove("error")
      }

      if (emptyField == 0) {
        this.orderingError = false
        let dataSend = this.$root.orderData;
        if (dataSend.delivery == "pickup") {
          dataSend.delivery = this.delivery[0].id;
        }
        dataSend["payment_id"] = dataSend.paymentSel;
        dataSend["shipping_id"] = dataSend.delivery;

        /*** Добавляем всем продуктам вариант сертификата, если выбрана электронная доставка ***/
        let optionId = 0
        for(let key in this.sertificate){
          optionId = this.sertificate[key].option_id
          break
        }
        if(dataSend.delivery == "electr"){
          console.log(optionId)
          for(let key in dataSend.products){
            dataSend.products[key].product_options[optionId] = dataSend.sertSel
          }
        } else {
          for(let key in dataSend.products){
            delete dataSend.products[key].product_options[optionId]
          }
        }
        
        //На сервере объединяем продукты и выбранные доп услуги
        let data = {
          params: {
            entity: "ordering",
            data: dataSend,
          },
        };
        this.$root.loader = "Оформление заказа";
        this.axios
          .get(`${this.$baseDir}/cart/custom-rest/index.php`, data)
          .then((response) => {
            console.log("Заказ оформлен!");
            console.log(response.data);
            if (response.data.paymentURL) {
              document.location.href = response.data.paymentURL;
            } else {
              document.location.href =
                this.$baseDir +
                "/zakaz-uspeshno-oformlen-1?Success=true&OrderId=" +
                response.data.orderId;
            }
          });
      } else {
        this.orderingError = true
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
        if (this.$root.orderData.paymentSel == "") {
          for (key in this.$root.orderData.payment) {
            if (this.$root.orderData.payment[key].title.includes("Наличными")) {
              this.$root.orderData.paymentSel = key;
            }
          }
        }
      }
    },
    selDelivery(type) {
      if (type == "delivery") {
        this.$root.orderData.delivery = null;
        this.$root.orderData.type_order = "fiz";
      }
      if (type == "pickup") {
        this.$root.orderData.delivery = "pickup";
        this.$root.orderData.priceDelivery = 0;
        this.$root.orderData.type_order = "fiz";
        this.$root.orderData.user_data.b_address =
          "Санкт-Петербург, пр Медиков, д. 3";
      }
      if (type == "electr") {
        for (let key in this.sertificate) {
          if (this.$root.orderData.sertSel == "") {
            this.$root.orderData.sertSel = this.sertificate[key].variant_id;
          }
          this.$root.orderData.priceDelivery = Number(
            this.sertificate[key].price
          );
          break;
        }
        this.payments("card");
        this.$root.orderData.delivery = "electr";
        this.$root.orderData.type_order = "electr";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.method-delivery {
  margin-top: 30px;
  span {
    background: #efefef;
    padding: 10px 15px;
    margin-right: 20px;
    cursor: pointer;
  }
  span.active {
    background: #1cbbb3;
    color: white;
  }
}
p.h3 {
  padding-right: 0;
}
p.h5 {
  margin-top: 35px;
}
div.pay {
  background: #efefef;
  margin-right: 20px;
  margin-top: 20px;
  padding: 10px 15px;
  cursor: pointer;
}
div.pay.active {
  background: #1cbbb3;
  color: #fff;
}
button.ordering{
  width:100%;
  height: 50px;
  background: #1cbbb3;
  color: #fff;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  border: none;
  margin-top: 45px;
}
.orderingError{
  font-weight: 600;
  color: red;
}
p.personal-data{
  margin-top: 25px;
  input{
    width: 20px;
     height: 20px;
  }
  span{
    font-size: 14px;
    padding-left:15px;
  }
  a{
    color: #555555;
  }
}
div.sertificate{
  .row{
    margin-top: 20px;
    .col-3{
      position: relative;
    }
  }
  .active{
    outline: 2px solid #1cbbb3 !important;
  }
  button{
    position: absolute;
    width: 70%;
    left: 15%;
    bottom: 10%;
    border: none;
    background: #1cbbb3;
    color: #fff;
  }
}
#personal-data{
  display: inline-block;
  padding: 0;
}
#personal-data{
  margin: 0 !important;
}
.fadeDelivery-enter-active,
.fadeDelivery-leave-active {
  transition: opacity 0.5s linear;
}

.fadeDelivery-enter-from,
.fadeDelivery-leave-to {
  opacity: 0;
}
</style>
