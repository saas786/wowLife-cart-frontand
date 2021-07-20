<template>
<div class='placeholder'>
  <input
    id="b_phone"
    name="b_phone"
    type="text"
    v-on:blur="setData($event.target)"
    v-on:keyup.enter="onEnter($event.target)"
    :value="$root.orderData.user_data.b_phone"
    :class="{error: error}"
    placeholder = " "
    v-maska="'+7(###)###-##-##'"
  />
  <label for="b_phone"> 
      <span>+7(___)___-__-__</span>  
      <span class="star">*</span>        
  </label>
</div>
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
<style scoped>
    div.placeholder {
        position: relative;
        display: inline-block;
        margin-left:20px;
        margin-top:35px;
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