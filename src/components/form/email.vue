<template>
  <input
    name="email"
    type="text"
    @blur="setData($event.target)"
    @keyup.enter="onEnter($event.target)"
    :value="$root.orderData.user_data.email"
    :class="{error: error}"
  />
</template>
<script>
export default {
    name: "Email",
    data(){
        return{
            error: false
        }
    },
    methods: {
        onEnter(event) {
            event.blur();
        },
        setData(event) {
            this.$root.orderData.user_data[event.name] = event.value;
        },
        validation(){
            if(this.$root.orderData.user_data.email == ''){
                this.error = true
                return true
            } else {
                this.error = false
                return false
            }
        }
    }
};
</script>
