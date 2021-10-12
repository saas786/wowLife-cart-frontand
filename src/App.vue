<template>
  <div id="sessionId" v-if="!$isProduction">cd5bb983ad0dd48af716ee536091d6c3</div>
  <!--<div class="container beta text-danger h6">
    Старая версия корзины находится <a :href="$baseDir + '/korzina/?old=y'">здесь</a> 
  </div>-->    
  <transition name="fadeLoad">
    <div v-if="$root.orderData" v-show="is_show"> <Cart /></div>
  </transition>
</template>

<script>
import Cart from './components/Cart.vue'
import delivery from "@/assets/delivery/deleveryZone.json";

export default {
  name: 'Apps',
  components: {
    Cart
  },
  data(){
    return {
      delivery: delivery,
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
        //this.loadPayments()
        //this.loadProductsAdd()
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
          comment: "",
          comment_postcard: ""
        },
        subtotal_discount: 0,
        promotions: {},
        promotion_ids: "",
        type_order: 'fiz',
        payment:{},
        paymentSel: 0,
        delivery: null,
        priceDelivery: 0,
        priceDeliveryZone: 0,
        priceDeliveryAdd: 0,
        amount: 0,
        sertSel: 0,
        ymId:""
      }
    },
    loadProducts(){
      let params = {
        entity: 'carts',
        sessionId: this.sessionId
      }; 
      let headers = {
        'Cache-Control': 'no-cache'
      }
      this.axios.get(`${this.$baseDir}/cart/custom-rest/index.php`, {params: params, headers: headers}).then((response) => {
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
              checked: "N",
              image: item['img'],
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
            if(item != null){
              this.$root.orderData.payment[item['payment_id']] = {
                id: item['payment_id'],
                title: item['payment'],
              }
            }
            this.selPayments()
          })
        }
      })
    },
    selPayments() {
      let key = null;
      let typePayments = "";
      if (this.$root.orderData.type_order == "electr") {
        typePayments = "card";
      } else {
        if(this.$root.orderData.paymentSel == ''){
          typePayments = "nal";
        }
      }
      for (key in this.$root.orderData.payment) {        
        if (
          this.$root.orderData.payment[key].title.includes(
            "Банковская карта"
          ) &&
          typePayments == "card"
        ) {
          this.$root.orderData.paymentSel = key;
        }
        if (
          this.$root.orderData.payment[key].title.includes("Наличными") &&
          typePayments == "nal"
        ) {
          this.$root.orderData.paymentSel = key;
        }
      }  
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

      //**********Promotion**************
      for(key in this.$root.orderData.promotions){
        let type = this.$root.orderData.promotions[key]['bonuses'][0]['discount_bonus']
        let value = this.$root.orderData.promotions[key]['bonuses'][0]['discount_value']
        if(type == 'by_percentage'){
          this.$root.orderData.subtotal_discount = Math.round(amount * Number(value) / 100)
        }
        if(type == 'by_fixed'){
          this.$root.orderData.subtotal_discount = Number(value)
        }
        amount -= this.$root.orderData.subtotal_discount
      }

      if(amount < 0){
        amount = 0
      }

      this.$root.orderData.amount = amount
    },
    calcDelivery(deliveryId, deliveryPriceZone){
      let freePrice = 5500
      let priceDeliveryAdd = this.delivery[6].price //Сколько добавлять в день заказа
      let deliverySpbId = this.delivery[2].id

      let amount = 0 
      for (let key in this.$root.orderData.products) {
        amount += this.$root.orderData.products[key].amount * this.$root.orderData.products[key].price
      }

      if( this.$root.orderData.delivery != 'pickup' && this.$root.orderData.delivery != 'electr'){

        this.$root.orderData.delivery = deliveryId
        this.$root.orderData.priceDeliveryZone = deliveryPriceZone

        let deliveryDate = this.$root.orderData.user_data.delivery_time.split(' ')[0]
        let dateParts = deliveryDate.split(".");
        deliveryDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
        deliveryDate.setHours(0,0,0,0)

        let nowData = new Date()
        nowData.setHours(0,0,0,0)
        
        //Доставка в день заказа
        if( (deliveryDate.toString() === nowData.toString()) && (deliveryPriceZone > 0) ){
          this.$root.orderData.priceDeliveryAdd = priceDeliveryAdd 
        } else {
          this.$root.orderData.priceDeliveryAdd = 0
        }
        //Бесплатная доставка
        if(amount >= freePrice && this.$root.orderData.delivery == deliverySpbId){
          this.$root.orderData.priceDelivery = -1
        } else {
          this.$root.orderData.priceDelivery = this.$root.orderData.priceDeliveryZone + this.$root.orderData.priceDeliveryAdd
        }
      } else {
        this.$root.orderData.priceDelivery = 0
      }
    }
  },
  watch: {
    orderData: {
      handler: function(val) {
        // let params = {
        //   params: {
        //     entity: 'cartInfoSave',
        //     sessionId: this.sessionId,
        //     data: val
        //   }
        // }; 
        let data = new FormData();
        data.append('entity','cartInfoSave');
        data.append('sessionId',this.sessionId);
        data.append('data',JSON.stringify(val));
        this.axios.post(`${this.$baseDir}/cart/custom-rest/index.php`, data).then((response) => {
          console.log('save: ' + response.data)
        })
        this.calcPrice() // Функция пересчёта общей стоимости
      },
      deep: true
    },
    "orderData.amount": function () {
      this.calcDelivery(this.$root.orderData.delivery, this.$root.orderData.priceDeliveryZone)
    }
  },
}
</script>

<style lang="scss">
.cart-content-grid {
  min-width: auto !important;
}
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
div.placeholder {
    position: relative;
    display: inline-block;
    margin-top:20px;
}
div.placeholder > input{
    width: 270px;
    height: 40px;
    padding: 5px 15px;
    border: 1px solid #E1E1E1;
}
div.placeholder > label {
    position: absolute;
    left: 0.5em;
    top: 50%;
    margin-top: -0.9em;    
}
div.placeholder > input[type=text]:focus + label {
    display: none;
}
div.placeholder > label > span {
    color: #000;
    display: inline-block;
    vertical-align: middle;
}
div.placeholder > label > span.star {
    font-size: 18px; color: #1CBBB3
}
div.placeholder input:not(:placeholder-shown) ~ label {
  display: none;
}
.fadeLoad-enter-active,
.fadeLoad-leave-active {
  transition: opacity .7s linear;
}

.fadeLoad-enter-from,
.fadeLoad-leave-to {
  opacity: 0;
}

.beta{
  text-align: center;
  font-weight: 600;
  border: 2px solid #1cbbb3;
  background: rgb(28, 187, 179, .4);
  padding: 10px;
  margin-bottom: 35px !important;
}
</style>
