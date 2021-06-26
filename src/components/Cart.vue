<template>
  <div class="container cart" v-if="isOrdering === false">
    <div v-if="$root.orderData.products">
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
            <th scope="col">Цена</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in $root.orderData.products" :key="item.product_id">
            <th scope="row">#</th>
            <td>{{ item["product_id"] }}</td>
            <td>{{ item["title"] }}</td>
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
    };
  },
  mounted() {},
  methods: {
    delFromCart(product_id) {
      console.log(this.$root.orderData.products[product_id])
      delete this.$root.orderData.products[product_id]

      let params = {
        params: {
          entity: "delete",
          sessionId: this.$root.sessionIds,
          product_id: product_id,
        },
      };
      this.axios
        .get(`${this.$baseDir}/cart/custom-rest/index.php`, params)
        .then((response) => {
          console.log(response);
        });
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
