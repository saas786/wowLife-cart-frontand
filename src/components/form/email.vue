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
    required
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
<style scoped>
    div.placeholder {
        position: relative;
        display: inline-block;
        margin-top:20px;
    }
    div.placeholder > input{
        width: 270px;
        height: 40px;
        padding: 5px 15px;
    }
    div.placeholder > label {
        position: absolute;
        left: 0.5em;
        top: 50%;
        margin-top: -0.9em;    
    }
    div.placeholder > input[type=text]:focus + label {
        display: none;
    }
    div.placeholder > label > span {
        color: #000;
        display: inline-block;
        vertical-align: middle;
    }
    div.placeholder > label > span.star {
        font-size: 18px; color: #1CBBB3
    }
    div.placeholder input:not(:placeholder-shown) ~ label {
      display: none;
    }
</style>