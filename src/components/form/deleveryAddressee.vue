<template>
  <div class="row" style="margin-top: 40px; margin-bottom: 0px;">
    <p>
      <input type="checkbox" @click="s_delivery = !s_delivery" /><span class="text"
        >Отправить получателю</span
      >
    </p>
    <transition name="fadeDelivery">
      <div v-if="s_delivery">
        <div class='placeholder' style="margin-right:10px">
          <input
            name="s_firstname"
            type="text"
            v-model="$root.orderData.user_data.s_firstname"
            placeholder = "Имя получателя"
          />
        </div>
        <div class='placeholder'>
          <input
            name="s_phone"
            type="text"
            placeholder = "+7(___)___-__-__"
            v-model="$root.orderData.user_data.s_phone"
            v-maska="'+7(###)###-##-##'"
          />
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "DeliveryAddresse",
  data() {
    return {
      error: false,
      s_delivery: false,
    };
  },
  methods: {
    // onEnter(event) {
    //   event.blur();
    // },
    // setData(event) {
    //   this.$root.orderData.user_data[event.name] = event.value;
    // },
    // validation() {
    //   if (this.$root.orderData.user_data.s_email == "") {
    //     this.error = true;
    //     return true;
    //   } else {
    //     this.error = false;
    //     return false;
    //   }
    // },
  },
};
</script>
<style scoped>
p {
  margin-bottom: 0;
}
.text {
  margin-left: 10px;
}
input[type="text"] {
  width: 270px;
  height: 40px;
  padding: 5px 15px;
  border: 1px solid #e1e1e1;
  margin-top: 20px;
}
input[type="text"]::placeholder {
  color: #000;
}
.fadeDelivery-enter-active,
.fadeDelivery-leave-active {
  transition: opacity 0.5s linear;
}

.fadeDelivery-enter-from,
.fadeDelivery-leave-to {
  opacity: 0;
}
.placeholder{margin-top: 0}
</style>