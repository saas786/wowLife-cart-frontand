<template>
  <div class="row">
    <p>
      <input type="checkbox" @click="s_email = !s_email" /><span class="text"
        >Отправить на email получателя</span
      >
    </p>
    <transition name="fadeDelivery">
      <div class="col" v-if="s_email">
        <input
          name="s_email"
          type="text"
          v-on:blur="setData($event.target)"
          v-on:keyup.enter="onEnter($event.target)"
          :value="$root.orderData.user_data.s_email"
          :class="{ error: error }"
          placeholder="Email получателя"
        />
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "Email",
  data() {
    return {
      error: false,
      s_email: false,
    };
  },
  methods: {
    onEnter(event) {
      event.blur();
    },
    setData(event) {
        let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (reg.test(event.value) === true) {
            this.$root.orderData.user_data[event.name] = event.value
        } else {
            event.value = ''
            this.$root.orderData.user_data[event.name] = ''
        }
    },
    validation() {
      if (this.$root.orderData.user_data.s_email == "") {
        this.error = true;
        return true;
      } else {
        this.error = false;
        return false;
      }
    },
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
</style>