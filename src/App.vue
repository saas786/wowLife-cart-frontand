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
      productsAdd: {},
      user_data: {
        email: "",
        b_firstname: "",
        b_lastname: "",
        b_address: "",
        b_city: "",
        b_state: "",
        b_country: "RU",
        b_zipcode: "",
        b_phone: "",
        s_email: "",
        s_firstname: "",
        s_lastname: "",
        s_address: "",
        s_city: "",
        s_state: "",
        s_country: "",
        s_zipcode: "",
        s_phone: "",
        delivery_time: "",
        comment: ""
      },
      type_order: 'fiz',
      payment:{},
      paymentSel: 0,
      delivery: null,
      priceDelivery: 0
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

    params = {
      params: {
        entity: 'additional',
      }
    }; 
    
    this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
      if(response.data){
        response.data.forEach(item => {
          this.$root.orderData.productsAdd[item['id']] = {
            id: item['id'],
            title: item['title'],
            price: item['price'],
            checked: "N"
          }
        })
      }
    })
    
    params = {
      params: {
        entity: 'payment',
      }
    }; 
    this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
      if(response.data){
        response.data.forEach(item => {
          this.$root.orderData.payment[item['payment_id']] = {
            id: item['payment_id'],
            title: item['payment'],
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
