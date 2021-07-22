<template>
  <div
    class="row addProduct"
    v-if="
      $root.orderData.type_order == 'fiz' &&
      Object.keys($root.orderData.productsAdd).length != 0
    "
  >
    <p class="h5">Добавьте к заказу</p>
    <div
      class="col-3"
      v-for="item in $root.orderData.productsAdd"
      :key="item.id"
    >
      <label :class="{ active: item.checked == 'Y' }">
        <img :src="$baseDir + '/images/detailed/' + item.image" />
        <input
          type="checkbox"
          :value="item.id"
          @click="checkAdditional($event.target)"
          :checked="item.checked == 'Y' ? true : false"
          v-show="false"
        />

        <p class="text-bottom">{{ item.title }}</p>
        <p class="text-bottom" style="font-weight: 600">
          {{ Number(item.price).toFixed(0) }} ₽
        </p>
        <p class="add"><span v-if="item.checked == 'N'">+</span><span v-else>-</span></p>
      </label>
    </div>
  </div>
</template> 
<script>
export default {
  name: "AddProductions",
  methods: {
    checkAdditional(event) {
      if (event.checked === true) {
        this.$root.orderData.productsAdd[event.value]["checked"] = "Y";
      } else {
        this.$root.orderData.productsAdd[event.value]["checked"] = "N";
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.addProduct {
  margin-top: 35px;
  label {
    margin-top: 20px;
    position: relative;
  }
  img {
    width: 100%;
    height: 120px;
  }
  .active {
    outline: 2px solid #1cbbb3 !important;
  }
  p.text-bottom {
    margin-top: 0.4rem;
    margin-bottom: 0;
  }
  p.add {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-bottom: 0;
    background: #c7c7c7;
    width: 20px;
    height: 20px;
    border-radius: 15px;
    text-align: center;
    font-size: 18px;
    color: white;
    font-weight: 600;
    line-height: 19px;
    padding: 0 !important;
  }
}
 </style>