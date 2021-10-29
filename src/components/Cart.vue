<template>
  <div id="cart" class="container">
    <div v-if="(Object.keys($root.orderData.products).length != 0) && typeof $root.orderData.products === 'object'" class="row">
      <div class="col-12 order-2 col-xl-7 order-xl-1" style="padding: 0;">
        <Ordering :sertificate="sertificate" />
      </div>
      <div class="col-12 order-1 col-xl-5 order-xl-2" style="position: relative; padding: 0;">
        <div class="list-order">
          <p class="h5">Ваш заказ</p>
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
                <td style="padding-top: 18px; width:50%">
                  <a :href="$baseDir + item.link" class="title">{{
                    item.product
                  }}</a>

                  <div
                    v-for="(option, index) in item.options_sel"
                    :key="index"
                    class="options-select"
                  >
                    <div v-if="typeof option!== 'object' && index != 'Электронный сертификат' && index != 'Аренда GoPro'">{{ index }}: {{ option }} {{  }}</div>
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
                <td v-if="$root.orderData.type_order == 'fiz'" class="price">
                  <div class="base-price">
                    <span v-if="item.priceFull > 0"
                      >{{ Number(item.priceFull).toLocaleString("ru") }} ₽</span
                    >
                  </div>
                  {{ (item.amount * item.price).toLocaleString("ru") }} ₽
                </td>
                <td v-else class="price">
                  <div class="base-price">
                    <span v-if="item.priceFull > 0"
                      >{{ Number(item.priceFull).toLocaleString("ru") }} ₽</span
                    >
                  </div>
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
                ><span>{{ Math.round($root.orderData.priceDelivery) }} ₽</span>
              </div>
            </transition>
            <transition name="fadeAdd">
              <div class="add-price" v-if="additionalPrice > 0 && $root.orderData.delivery != 'electr'">
                <span>Дополнительные услуги</span><span></span><span>{{additionalPrice}} ₽</span>
              </div>
             </transition>
             <transition name="fadeAdd">
              <div class="add-price-discount" v-if="discountPrice < 0">
                <span>Скидка</span><span></span><span>{{discountPrice}} ₽</span>
              </div>
            </transition>
            <transition name="fadeAdd">
              <div class="add-price-discount" v-if="$root.orderData.amount > 7000">
                <span>WOW-впечатления</span><span></span><span>В подарок</span>
              </div>
            </transition>
          </div>
          <Promotions/>
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
import Promotions from "../components/Promotions.vue";
import { gsap } from "gsap";

export default {
  name: "Cart",
  components: {
    Ordering,
    Promotions
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
      this.axios
        .get(`${this.$baseDir}/index.php?dispatch=checkout.delete&cart_id=${product_id}&redirect_mode=cart`)
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
      this.discountPrice -= this.$root.orderData.subtotal_discount
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
    position: sticky;
    top: 0;
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
      text-align: right;
      padding-top: 0px;
      font-size: 14px;
      text-decoration: line-through;
      color: #adadad;
    }
    .price {
      text-align: right;
      padding-left: 0;
      padding-top: 20px;
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
  }
  .fadeAdd-enter-active,
  .fadeAdd-leave-active {
    transition: opacity .8s linear;
  }

  .fadeAdd-enter-from,
  .fadeAdd-leave-to {
    opacity: 0;
  }
}

@media screen and (max-width: 1200px) {
  .list-order {
    position: relative !important;
  }
}
</style>
