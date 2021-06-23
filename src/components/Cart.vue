<template>
  <div class="container cart" v-if="isOrdering === false">
    <div  v-if="products != ''">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link" 
            aria-current="page" 
            href="#"
            v-on:click="selSert('fiz')"
            :class="{ active: isActiveFiz}">
            Физический
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" 
            href="#" 
            v-on:click="selSert('electr')"
            :class="{ active: isActiveElectr}">
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
          <tr v-for="(item, index) in products" :key="item.product_id">
            <th scope="row">{{index + 1}}</th>
            <td> {{item.extra['product_id']}}</td>
            <td> {{item.extra['product']}}</td>
            <td>{{item.extra['price']}}</td>
            <td style="text-align: right"><a href="#" v-on:click="delFromCart(item.extra['product_id'])">Удалить</a></td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <div class="col">
          <div class="d-flex justify-content-start">
            <div>
              <h6>Дополнительные услуги</h6>
              <ul v-if="isActiveFiz">
                <li>Цветы</li>
                <li>Рафаэло</li>
                <li>Цветы 1</li>
                <li>Цветы 23</li>
                <li>Цветы 4</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="d-flex justify-content-end">
            <div>
              <p v-if="isActiveFiz"><input name="dostavka" type="radio" value="1" v-on:click="pickup=false" checked> Доставка</p>
              <p v-if="isActiveFiz"><input name="dostavka" type="radio" value="2" v-on:click="pickup=true"> Самовывоз</p>
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
  <Ordering :delivery="isActiveFiz" :pickup="pickup" v-else/>
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
      products: null,
      isActiveFiz: true,
      isActiveElectr: false,
      isOrdering: false,
      pickup: false,
    }
  },
  mounted(){
    let cookie = this.$cookies
    let sessionIds = []
    let cookieArr = cookie.keys()
    cookieArr.forEach(function(item) {
      if(item.includes('sid_customer')){
        console.log(item);
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
      this.products = response.data
    })

  },
  methods: {
    selSert(typeSert){
      if(typeSert == 'fiz'){
        this.isActiveFiz = true;
        this.isActiveElectr = false;
      } else {
        this.isActiveFiz = false;
        this.isActiveElectr = true;
      }
    },
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
