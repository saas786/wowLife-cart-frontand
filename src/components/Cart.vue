<template>
  <div id='cart' class="container" v-if="isOrdering === false">
    <div v-if="Object.keys($root.orderData.products).length != 0">
      <ul class="nav nav-tabs">
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
      </ul>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Товар</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Опции</th>
            <th scope="col">Цена</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in $root.orderData.products" :key="item.product_id">
            <th scope="row"><img :src="`https://wowlife.club/images/${item.main_pair.detailed.relative_path}`"/></th>
            <td>{{ item["product_id"] }}</td>
            <td>
              {{ item["title"] }}
              <div class="number">
                <input
                  type="number"
                  :value="item['amount']"
                  v-on:click="amountProduct($event.target, item['product_id'])"
                />
              </div>
            </td>
            <td>
              <div v-if="$root.orderData.type_order == 'electr'">
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
              </div>
            </td>
            <td>{{ item["price"] }}</td>
            <td style="text-align: right">
              <a href="#" v-on:click="delFromCart(item['product_id'])"
                >Удалить</a
              >
            </td>
          </tr>
        </tbody>
      </table>
      <div class="row">
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
              <p>
                К оплате {{$root.orderData.amount}}
              </p>
              <button v-on:click="isOrdering = true">Оформить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-else>
      <h2 style="text-align: center">В корзине нет товаров</h2>
    </div>
  </div>
  <Ordering v-else />
</template>
<script>
import Ordering from "../components/Ordering.vue";

export default {
  name: "Cart",
  components: {
    Ordering,
  },
  data() {
    return {
      isOrdering: false,
      sertificate: {},
      imageSert: "",
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
          response.data.forEach((item, index) => {
            this.sertificate[item["variant_id"]] = {
              variant_id: item["variant_id"],
              option_id: item["option_id"],
              title: item["variant_name"],
              path: item["path"],
            };
            if(index == 0){
              var productIds = Object.keys(this.$root.orderData.products)
              productIds.forEach((productId) =>{
                if (
                  "product_options" in this.$root.orderData.products[productId] === false
                ) {
                  this.$root.orderData.products[productId]["product_options"] = {};
                }

                this.$root.orderData.products[productId].product_options[item["option_id"]] = item["variant_id"]
                this.$root.orderData.products[productId]["sertImg"] = item["path"];
              })
            }
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
          sessionId: this.$root.sessionIds,
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
      if (event.value < 0) {
        event.value = 0;
      }
      this.$root.orderData.products[id].amount = event.value;
    },
    changeSert(event) {
      let value = event.value.split(":");
      let productId = value[0];
      let sertId = value[1];
      let optionId = this.sertificate[sertId].option_id;

      if (
        "product_options" in this.$root.orderData.products[productId] ===
        false
      ) {
        this.$root.orderData.products[productId]["product_options"] = {};
      }

      this.$root.orderData.products[productId].product_options[optionId] =
        sertId;
      this.$root.orderData.products[productId]["sertImg"] =
        this.sertificate[sertId].path;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  #cart{
    img{width: 120px}
  }
</style>
