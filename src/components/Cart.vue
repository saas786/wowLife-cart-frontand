<template>
  <div class="container cart" v-if="isOrdering === false">
    <div  v-if="$root.orderData.products">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link" 
            aria-current="page" 
            href="#"
            v-on:click="$root.orderData.type_order = 'fiz'"
            :class="[$root.orderData.type_order == 'fiz' ? 'active' : '' ]">
            Физический
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" 
            href="#" 
            v-on:click="$root.orderData.type_order = 'electr'"
            :class="[$root.orderData.type_order != 'fiz' ? 'active' : '' ]">
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
          <tr v-for="(item) in $root.orderData.products" :key="item.product_id">
            <th scope="row">#</th>
            <td> {{item['product_id']}}</td>
            <td> {{item['title']}}</td>
            <td>{{item['price']}}</td>
            <td style="text-align: right"><a href="#" v-on:click="delFromCart(item['product_id'])">Удалить</a></td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <div class="col">
          <div class="d-flex justify-content-start">
            <div>
              <h6>Дополнительные услуги</h6>
              <div v-if="$root.orderData.type_order == 'fiz' && productsAdd">
                <p v-for="item in productsAdd" :key="item.product_id">
                  <input data-id="{{item.product_id}}" type="checkbox" name="prAdd" value="{{item.price}}">{{item.title}} {{item.price}}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="d-flex justify-content-end">
            <div>
              <p v-if="$root.orderData.type_order == 'fiz'">
                <input name="dostavka" type="radio" value="1" v-on:click="$root.orderData.delivery = null" checked> Доставка
              </p>
              <p v-if="$root.orderData.type_order == 'fiz'">
                <input name="dostavka" type="radio" value="2" v-on:click="$root.orderData.delivery = 'pickup'"> Самовывоз
              </p>
              <button v-on:click="isOrdering = true">Оформить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-else>
      <h2 style='text-align: center'>В корзине нет товаров</h2>
    </div>
  </div>
  <Ordering v-else/>
</template>
<script>
import Ordering from '../components/Ordering.vue'

export default {
  name: 'Cart',
  components:{
    Ordering
  },
  data() {
    return {
      productsAdd: null,
      isOrdering: false,
    }
  },
  mounted(){
    let cookie = this.$cookies
    let sessionIds = []
    let cookieArr = cookie.keys()
    cookieArr.forEach(function(item) {
      if(item.includes('sid_customer')){
        sessionIds.push(cookie.get(item))
      }
    });

    let params = {
      params: {
        entity: 'carts',
        sessionId: sessionIds
      }
    }; 
    
    this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
      if(response.data){
        response.data.forEach(item => {
          this.$root.orderData.products[item['product_id']] = {
            product_id: item['product_id'],
            title: item.extra['product'],
            amount: item['amount'],
            price: item['price']
          }
        })
      } 
    })

    params = {
      params: {
        entity: 'additional',
      }
    }; 
    
    this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
      this.productsAdd = response.data
    })

  },
  methods: {
    delFromCart(product_id){
      
      let params = {
        params: {
          entity: 'delete',
          sessionId: this.sessionId,
          product_id: product_id
        }
      }; 
      this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
        console.log(response);
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
