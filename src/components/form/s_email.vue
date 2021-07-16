<template>
<input
    name="s_email"
    type="text"
    v-on:blur="setData($event.target)"
    v-on:keyup.enter="onEnter($event.target)"
    :value="$root.orderData.user_data.s_email"
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
            if(this.$root.orderData.user_data.s_email == ''){
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