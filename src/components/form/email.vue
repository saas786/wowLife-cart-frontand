<template>
<div class='placeholder'>
  <input
    id="email"
    name="email"
    type="text"
    @blur="setData($event.target)"
    @keyup.enter="onEnter($event.target)"
    :value="$root.orderData.user_data.email"
    :class="{error: error}"
    placeholder = " "
  />
    <label for="email"> 
        <span>Email</span>  
        <span class="star">*</span>        
    </label>
</div>
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
            let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            if (reg.test(event.value) === true) {
                this.$root.orderData.user_data[event.name] = event.value
            } else {
                event.value = ''
                this.$root.orderData.user_data[event.name] = ''
            }
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
<style scoped>
</style>