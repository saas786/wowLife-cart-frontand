<template>
<div class='placeholder'>
  <input
    id="b_firstname"
    name="b_firstname"
    type="text"
    v-on:blur="setData($event.target)"
    v-on:keyup.enter="onEnter($event.target)"
    :value="$root.orderData.user_data.b_firstname"
    :class="{error: error}"
    placeholder = " "
  />
  <label for="b_firstname"> 
      <span>Имя</span>  
      <span class="star">*</span>        
  </label>
</div>
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
<style scoped>
    div.placeholder {
        position: relative;
        display: inline-block;
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