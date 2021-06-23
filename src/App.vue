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
    let orderData = new Object();
      orderData.user_id = 0;
      orderData.products = {};
      orderData.user_data = {};
      orderData.type_order = 'fiz';
      orderData.delivery = null;

      this.orderData = orderData
    }
}
</script>

<style>

</style>
