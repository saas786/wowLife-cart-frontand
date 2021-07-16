<template>
  <input
    name="b_phone"
    type="text"
    v-on:blur="setData($event.target)"
    v-on:keyup.enter="onEnter($event.target)"
    :value="$root.orderData.user_data.b_phone"
    :class="{error: error}"
  />
</template>
<script>
export default {
  name: "b_phone",
  data() {
    return {
      error: false,
    };
  },
  methods: {
    onEnter(event) {
      event.blur();
    },
    setData(event) {
      this.$root.orderData.user_data[event.name] = event.value;
    },
    validation() {
      if (this.$root.orderData.user_data.b_phone == "") {
        this.error = true;
        return 1;
      } else {
        this.error = false;
        return 0;
      }
    },
  },
};
</script>
