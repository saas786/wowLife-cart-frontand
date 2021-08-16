<template>
  <div class="row" style="position: relative">
    <input
      type="text"
      placeholder="введите промокод"
      v-model="code"
      class="promo"
    />
    <div class="circleBase type2" @click="getPromoution"></div>
  </div>
</template>
<script>
export default {
  name: "Propmotion",
  data() {
    return {
      code: "",
    };
  },
  methods: {
    getPromoution() {
      let params = {
        params: {
          entity: "promotion",
          code: this.code,
        },
      };
      this.axios
        .get(`${this.$baseDir}/cart/custom-rest/index.php`, params).then((response) => {
          for(let key in response.data){
            this.$root.orderData.promotion_ids = key
            this.$root.orderData.promotions = {
              [key]:{
                'bonuses':{
                  0:response.data[key]
                }
              }
            }
          }
        });
    },
  },
};
</script>

<style scoped>
.promo {
  border: 1px solid #1cbbb3;
  width: 275px;
  height: 40px;
  margin-top: 45px;
  margin-left: 10px;
}
.circleBase {
  border-radius: 50%;
  overflow: hidden;
  box-sizing: border-box;
  cursor: pointer;
}
.type2 {
  width: 25px;
  height: 25px;
  top: 52px;
  left: 250px;
  background: #e1e1e1;
  position: absolute;
}
.type2:before {
  content: "";
  position: absolute;
  right: 50%;
  width: 100%;
  height: 100%;
  border: 2px solid white;
  transform: rotate(45deg);
}
.type2:hover:before {
  background: #1cbbb3;
}
</style>