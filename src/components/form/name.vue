<template>
  <input
    name="b_firstname"
    type="text"
    v-on:blur="setData($event.target)"
    v-on:keyup.enter="onEnter($event.target)"
    :value="$root.orderData.user_data.b_firstname"
    :class="{error: error}"
  />
</template>
<script>
export default {
  name: "Name",
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
      if (this.$root.orderData.user_data.b_firstname == "") {
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
