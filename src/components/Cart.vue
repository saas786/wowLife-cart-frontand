<template>
  <div id='cart' class="container">
    <div v-if="Object.keys($root.orderData.products).length != 0" class="row">
      <!-- <ul class="nav nav-tabs">
        <li class="nav-item">
          <a
            class="nav-link"
            aria-current="page"
            href="#"
            v-on:click="$root.orderData.type_order = 'fiz'"
            :class="[$root.orderData.type_order == 'fiz' ? 'active' : '']"
          >
            Физический
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="#"
            v-on:click="$root.orderData.type_order = 'electr'"
            :class="[$root.orderData.type_order != 'fiz' ? 'active' : '']"
          >
            Электронный
          </a>
        </li>
      </ul> -->
      <div class="col-6">
        <table class="table">
          <!-- <thead>
            <tr>
              <th scope="col">Товар</th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col">Опции</th>
              <th scope="col">Цена</th>
              <th scope="col"></th>
            </tr>
          </thead> -->
          <tbody>
            <tr v-for="item, index in $root.orderData.products" :key="index">
              <th scope="row" v-if="item.main_pair"><img :src="`https://wowlife.club/images/${item.main_pair.detailed.relative_path}`"/></th>
              <td>
                {{ item.product }}
                <div class="number">
                  <input
                    type="number"
                    min="1"
                    :value="item.amount"
                    @click="amountProduct($event.target, index)"
                    @blur="amountProduct($event.target, index)"
                  />
                </div>
                <a href="#" v-on:click="delFromCart(index)"
                  >Удалить</a
                >
              </td>
              <td>
                <div v-for="option, index in item.options_sel" :key="index">
                  {{index}}: {{option}}
                </div>
                {{}}
                <!-- <div v-if="$root.orderData.type_order == 'electr'">
                  <img
                    v-if="item['sertImg']"
                    :src="$baseDir + '/images/variant_image/7/' + item['sertImg']"
                    width="100"
                  />
                  <select v-if="sertificate" @change="changeSert($event.target)">
                    <option
                      v-for="itemSert in sertificate"
                      :key="itemSert.variant_id"
                      :value="item['product_id'] + ':' + itemSert.variant_id"
                    >
                      {{ itemSert.title }}
                    </option>
                  </select>
                </div> -->
              </td>
              <td v-if="$root.orderData.type_order == 'fiz'">{{ item.amount * item.price }}</td>
              <td v-else>{{ item.amount * (item.price + $root.orderData.priceDelivery) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="row">
          <p>
            К оплате {{ animatedTotal }}
          </p>
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
      </div>
      <div class="col-6">
        <Ordering :sertificate = 'sertificate'/>
      </div>
      <!-- <div class="row">
        <div class="col">
          <div class="d-flex justify-content-end">
            <div>
              <p v-if="$root.orderData.type_order == 'fiz'">
                <input
                  name="dostavka"
                  type="radio"
                  value="1"
                  v-on:click="$root.orderData.delivery = null"
                  :checked="$root.orderData.delivery != 'pickup' ? true : false"
                />
                Доставка
              </p>
              <p v-if="$root.orderData.type_order == 'fiz'">
                <input
                  name="dostavka"
                  type="radio"
                  value="2"
                  v-on:click="$root.orderData.delivery = 'pickup'"
                  :checked="$root.orderData.delivery == 'pickup' ? true : false"
                />
                Самовывоз
              </p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="container" v-else>
      <h2 style="text-align: center">В корзине нет товаров</h2>
    </div>
  </div>
  <div class="popup-wrapper" v-if="$root.loader != ''">
    <div class="popup">
      <div class="spinner-border text-light" style="width: 3rem; height: 3rem; vertical-align: 1rem" role="status">
        <span class="sr-only"></span>
      </div><br>
      <span class="text">{{$root.loader}}</span>
    </div>
  </div>
</template>
<script>
import Ordering from "../components/Ordering.vue";
import { gsap } from 'gsap';

export default {
  name: "Cart",
  components: {
    Ordering,
  },
  data() {
    return {
      sertificate: {},
      number: 0,
      tweenedNumber: this.$root.orderData.amount,
      priceProduct: 0
    };
  },
  mounted() {
    let params = {
      params: {
        entity: "sertificate",
      },
    };
    this.axios
      .get(`${this.$baseDir}/cart/custom-rest/index.php`, params)
      .then((response) => {
        if (response.data) {
          response.data.forEach((item) => {
            if(item["variant_name"] != 'Нет'){
              this.sertificate[item["variant_id"]] = {
                variant_id: item["variant_id"],
                option_id: item["option_id"],
                title: item["variant_name"],
                path: item["path"],
                price: item["modifier"],
              };
            }
            // Инициализация сертификата у каждого продукта по умолчанию
            //  if(index == 0){
            //   var productIds = Object.keys(this.$root.orderData.products)
            //   productIds.forEach((productId) =>{
            //     if (
            //       "product_options" in this.$root.orderData.products[productId] === false
            //     ) {
            //       this.$root.orderData.products[productId]["product_options"] = {};
            //     }

            //     this.$root.orderData.products[productId].product_options[item["option_id"]] = item["variant_id"]
            //     this.$root.orderData.products[productId]["sertImg"] = item["path"];
            //   })
            // }
          });
        }
      });
  },
  methods: {
    delFromCart(product_id) {
      delete this.$root.orderData.products[product_id];

      let params = {
        params: {
          entity: "delete",
          sessionId: this.$root.sessionId,
          product_id: product_id,
        },
      };
      this.axios
        .get(`${this.$baseDir}/cart/custom-rest/index.php`, params)
        .then();
    },
    checkAdditional(event) {
      if (event.checked === true) {
        this.$root.orderData.productsAdd[event.value]["checked"] = "Y";
      } else {
        this.$root.orderData.productsAdd[event.value]["checked"] = "N";
      }
    },
    amountProduct(event, id) {
      if (event.value < 1) {
        event.value = 1;
      }
      this.$root.orderData.products[id].amount = Number(event.value);
    },
    //changeSert(event) {
      // let value = event.value.split(":");
      // let productId = value[0];
      // let sertId = value[1];
      // let optionId = this.sertificate[sertId].option_id;

      // if (
      //   "product_options" in this.$root.orderData.products[productId] ===
      //   false
      // ) {
      //   this.$root.orderData.products[productId]["product_options"] = {};
      // }

      // this.$root.orderData.products[productId].product_options[optionId] =
      //   sertId;
      // this.$root.orderData.products[productId]["sertImg"] =
      //   this.sertificate[sertId].path;
    //},
  },
  computed: {
    animatedTotal() {
      return this.tweenedNumber.toFixed(0)
    },
  },
  watch: {
    '$root.orderData.amount': function (newVal){
        gsap.to(this.$data, { duration: 0.5, tweenedNumber:  newVal})
     },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  #cart{
    img{width: 120px}
  }
</style>
