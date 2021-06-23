<template>
  <!--<img alt="Vue logo" src="./assets/logo.png">-->
  {{  $root.orderData }}
  <div v-if="$root.orderData"> <Cart /></div>
</template>

<script>
import Cart from './components/Cart.vue'

export default {
  name: 'Apps',
  components: {
    Cart
  },
  data(){
    return {
      orderData: null
    }
  },
  mounted() {
    this.orderData = {
      user_id: 0,
      products: {},
      user_data: {},
      type_order: 'fiz',
      delivery: null
    }
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
  },
  watch: {
    orderData: {
      handler: function(val) {
        console.log(val);
      },
      deep: true
    }
  },
}
</script>

<style>

</style>
