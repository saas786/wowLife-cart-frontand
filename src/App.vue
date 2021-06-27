<template>
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
      orderData: null,
      sessionIds: []
    }
  },
  mounted() {
    let cookie = this.$cookies
    let cookieArr = cookie.keys()
    cookieArr.forEach(item => {
      if(item.includes('sid_customer')){
        this.sessionIds.push(cookie.get(item))
      }
    }); 

    let params = {
      params: {
        entity: 'cartInfoGet',
        sessionId: this.sessionIds
      }
    }; 
    
    this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
      if(response.data){
        if(Object.keys(response.data).length != 0){
          console.log('DB'); 
          this.orderData = response.data
          this.loadProducts()
          this.loadPayments()
        } else {
          console.log('init')
          this.init_orderData()
          this.loadProducts()
          this.loadProductsAdd()
          this.loadPayments()
        }
      } else {
        console.log('init')
        this.init_orderData()
        this.loadProducts()
        this.loadProductsAdd()
        this.loadPayments()
      }       
    })
  },
  methods: {
    init_orderData(){
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
    },
    loadProducts(){
      let params = {
        params: {
          entity: 'carts',
          sessionId: this.sessionIds
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
    loadProductsAdd(){
      let params = {
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
    },
    loadPayments(){ 
      let params = {
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
    }
  },
  watch: {
    orderData: {
      handler: function(val) {
        let params = {
          params: {
            entity: 'cartInfoSave',
            sessionId: this.sessionIds,
            data: val
          }
        }; 
        this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
          console.log(response.data)
        })
      },
      deep: true
    }
  },
}
</script>

<style>

</style>
