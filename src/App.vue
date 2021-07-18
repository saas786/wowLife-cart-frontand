<template>
  <div id="sessionId" v-if="!$isProduction">e4u2s6cd8sv4g5q9s3hi6cf2n3</div>    
  <transition name="fadeLoad">
    <div v-if="$root.orderData" v-show="is_show"> <Cart /></div>
  </transition>
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
      sessionId: '',
      is_show: false,
      loader: '',
    }
  },
  mounted() {
    this.sessionId = document.getElementById("sessionId").innerHTML

    let params = {
      params: {
        entity: 'cartInfoGet',
        sessionId: this.sessionId
      }
    };
    this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
      this.is_show = true 
      if( response.data === false || response.data[0] == 'No' ){
        console.log('init')
        this.init_orderData()
        this.loadProducts()
        this.loadProductsAdd()
        this.loadPayments()
      } else {
        console.log('DB'); 
        this.orderData = response.data
        this.loadProducts()
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
        priceDelivery: 0,
        amount: 0,
        sertSel: 0
      }
    },
    loadProducts(){
      let params = {
        params: {
          entity: 'carts',
          sessionId: this.sessionId
        }
      }; 
      
      this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
        if(response.data){
          this.$root.orderData.products = response.data
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
    },
    calcPrice(){
      let amount = 0 
      let key = 0
      let total_count = 0
      for (key in this.$root.orderData.products) {
        amount += this.$root.orderData.products[key].amount * this.$root.orderData.products[key].price
        total_count += this.$root.orderData.products[key].amount
      }
      if(this.$root.orderData.type_order == 'fiz'){
        for (key in this.$root.orderData.productsAdd) {
            if(this.$root.orderData.productsAdd[key].checked == 'Y'){
              amount += Number(this.$root.orderData.productsAdd[key].price)
            }
        }
      }

      if(this.$root.orderData.type_order != 'electr'){
        // console.log(priceDelivery)
        // console.log(countProducts)
        // priceDelivery = priceDelivery * countProducts
        amount += this.$root.orderData.priceDelivery
      } else {
        amount += this.$root.orderData.priceDelivery * total_count
      }
      this.$root.orderData.amount = amount
    }
  },
  watch: {
    orderData: {
      handler: function(val) {
        let params = {
          params: {
            entity: 'cartInfoSave',
            sessionId: this.sessionId,
            data: val
          }
        }; 
        this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
          console.log('save: ' + response.data)
        })
        this.calcPrice() // Функция пересчёта общей стоимости
      },
      deep: true
    }
  },
}
</script>

<style lang="scss">
#cart-vue{
  .error{
  border:1px solid red;
  }
  .popup-wrapper {
    z-index: 9999999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .popup {
    padding: 56px 120px;
    border-radius: 32px;
    position: relative;
    text-align: center;
    width: auto;
    box-sizing: border-box;
  }
  .popup .text{
    font-size: 36px;
    color: white;
  }
}
.fadeLoad-enter-active,
.fadeLoad-leave-active {
  transition: opacity .7s linear;
}

.fadeLoad-enter-from,
.fadeLoad-leave-to {
  opacity: 0;
}
</style>
