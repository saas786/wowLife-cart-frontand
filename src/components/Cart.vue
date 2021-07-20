<template>
  <div id="cart" class="container">
    <div v-if="Object.keys($root.orderData.products).length != 0" class="row">
      <div class="col-7">
        <Ordering :sertificate="sertificate" />
      </div>
      <div class="col-5" style="position: relative">
        <div class="list-order">
          <h5>Ваш заказ</h5>
          <table class="table">
            <tbody>
              <tr
                v-for="(item, index) in $root.orderData.products"
                :key="index"
              >
                <td v-if="item.main_pair" class="img-product">
                  <img
                    :src="`https://wowlife.club/images/${item.main_pair.detailed.relative_path}`"
                  />
                </td>
                <td v-else style="background: #e1e1e1"></td>
                <td style="padding-top: 18px;">
                  <a :href="$baseDir + item.link" class="title">{{
                    item.product
                  }}</a>

                  <div
                    v-for="(option, index) in item.options_sel"
                    :key="index"
                    class="options-select"
                  >
                    <div v-if="index!='Электронный сертификат'">{{ index }}: {{ option }}</div>
                  </div>

                  <div class="number">
                    <span @click="amountProduct('minus', index)" class="amount"
                      >-</span
                    >
                    {{ item.amount }}
                    <span @click="amountProduct('plus', index)" class="amount"
                      >+</span
                    >
                  </div>
                  <a href="#" class="btn-delete" v-on:click="delFromCart(index)"
                    >Удалить</a
                  >
                </td>
                <td class="base-price">
                  <span v-if="item.priceFull > 0"
                    >{{ Number(item.priceFull).toLocaleString("ru") }} ₽</span
                  >
                </td>
                <td v-if="$root.orderData.type_order == 'fiz'" class="price">
                  {{ (item.amount * item.price).toLocaleString("ru") }} ₽
                </td>
                <td v-else class="price">
                  {{
                    (
                      item.amount *
                      (item.price + $root.orderData.priceDelivery)
                    ).toLocaleString("ru")
                  }}
                  ₽
                </td>
              </tr>
            </tbody>
          </table>
          <div class="row">
            <transition name="fadeAdd">
              <div
                class="add-price"
                v-if="
                  $root.orderData != 'electr' &&
                  $root.orderData.priceDelivery > 0
                "
              >
                <span>Доставка</span><span></span
                ><span>{{ $root.orderData.priceDelivery }} ₽</span>
              </div>
            </transition>
            <transition name="fadeAdd">
              <div class="add-price" v-if="additionalPrice > 0">
                <span>Дополнительные услуги</span><span></span><span>{{additionalPrice}} ₽</span>
              </div>
             </transition>
             <transition name="fadeAdd">
              <div class="add-price-discount" v-if="discountPrice < 0">
                <span>Скидка</span><span></span><span>{{discountPrice}} ₽</span>
              </div>
            </transition>
          </div>
          <div class="row" style="position: relative;">
            <input type="text" placeholder="введите промокод" class="promo">
            <div class="circleBase type2"></div>
          </div>
          <div class="row amount-price">
            <p><span>ИТОГО</span><br> {{ animatedTotal }} ₽</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-else>
      <h2 style="text-align: center">В корзине нет товаров</h2>
    </div>
  </div>
  <div class="popup-wrapper" v-if="$root.loader != ''">
    <div class="popup">
      <div
        class="spinner-border text-light"
        style="width: 3rem; height: 3rem; vertical-align: 1rem"
        role="status"
      >
        <span class="sr-only"></span>
      </div>
      <br />
      <span class="text">{{ $root.loader }}</span>
    </div>
  </div>
</template>
<script>
import Ordering from "../components/Ordering.vue";
import { gsap } from "gsap";

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
      additionalPrice: 0,
      discountPrice: 0
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
            if (item["variant_name"] != "Нет") {
              this.sertificate[item["variant_id"]] = {
                variant_id: item["variant_id"],
                option_id: item["option_id"],
                title: item["variant_name"],
                path: item["path"],
                price: item["modifier"],
              };
            }
          });
        }
      });
    this.additionalPriceCalc();
    this.discountPriceCalc();
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
    amountProduct(event, id) {
      if (event == "minus") {
        this.$root.orderData.products[id].amount =
          this.$root.orderData.products[id].amount - 1;
        if (this.$root.orderData.products[id].amount < 1) {
          this.$root.orderData.products[id].amount = 1;
        }
      } else {
        this.$root.orderData.products[id].amount =
          this.$root.orderData.products[id].amount + 1;
      }
    },
    additionalPriceCalc(){
      this.additionalPrice = 0
      for (let key in this.$root.orderData.productsAdd){
        if(this.$root.orderData.productsAdd[key].checked == 'Y'){
          this.additionalPrice += Number(this.$root.orderData.productsAdd[key].price)
        }
      }
    },
    discountPriceCalc(){
      this.discountPrice = 0
      if(this.$root.orderData.delivery == 'electr'){
        for(let key in this.$root.orderData.products){
          this.discountPrice += this.$root.orderData.products[key].amount * this.$root.orderData.priceDelivery
        }
      }
    }
  },
  computed: {
    animatedTotal() {
      return this.tweenedNumber.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  },
  watch: {
    "$root.orderData.amount": function (newVal) {
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: newVal });
      this.additionalPriceCalc()
      this.discountPriceCalc()
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#cart {
  .list-order {
    background: #f8f8f8;
    position: fixed;
    padding: 45px 35px;
    tr {
      border-style: hidden;
    }
    .img-product {
      padding-left: 0;

      img {
        width: 80px;
        height: 80px;
      }
    }
    a.title {
      color: black;
      font-weight: 600;
      font-size: 16px;
      letter-spacing: -0.01em;
      text-decoration-line: underline;
    }
    .options-select {
      font-size: 14px;
    }
    .number {
      display: inline-block;
    }
    .amount {
      cursor: pointer;
      width: 15px;
      text-align: center;
      display: inline-block;
    }
    a.btn-delete {
      color: #a7a7a7;
      text-decoration-line: none;
      margin-left: 20px;
    }
    .base-price {
      padding-top: 30px;
      font-size: 16px;
      text-decoration: line-through;
      color: #adadad;
    }
    .price {
      padding-left: 0;
      padding-top: 30px;
      font-weight: 600;
      font-size: 16px;
    }
    .add-price {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      padding-top: 15px;
      span:nth-child(2) {
        flex: 1 0;
        border-bottom: 1px dotted #000;
        height: 1.2em;
        margin: 0 0.4em;
      }
    }
    .add-price-discount {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      padding-top: 15px;
      color: #1cbbb3;
      span:nth-child(2) {
        flex: 1 0;
        border-bottom: 1px dotted #1cbbb3;
        height: 1.2em;
        margin: 0 0.4em;
      }
    }
    .promo{
      border: 1px solid #1CBBB3;
      width: 275px;
      height: 40px;
      margin-top: 45px;
      margin-left:10px;
    }
    .amount-price{
      text-align: right;
      margin-top:10px;
      p{
        font-weight: 600;
        font-size: 35px;
        span{
          font-size: 18px;
          color: #9E9E9E;
          line-height: 21px;
        }
      }
    }
    .circleBase {
      border-radius: 50%;
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
    }
    .type2 {
        width: 25px;
        height: 25px;
        top: 52px;
        left: 250px;
        background: #E1E1E1;
        position: absolute;
    }
    .type2:before {
      content:"";
      position: absolute;
      right:50%;
      width:100%;
      height:100%;
      border:2px solid white;
      transform:rotate(45deg) ;
    }
    .type2:hover:before {
      background: #1CBBB3;
    }

  }
  .fadeAdd-enter-active,
  .fadeAdd-leave-active {
    transition: opacity .5s linear;
  }

  .fadeAdd-enter-from,
  .fadeAdd-leave-to {
    opacity: 0;
  }
}
</style>
