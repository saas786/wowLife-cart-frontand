<template>
  <div class="col-5">
    <div class="postcard">
      <img :src="$baseDir + '/images/logo.svg'" />
    </div>
  </div>
  <textarea
    class="col-7 postcard-text"
    placeholder="Введите текст поздравления"
    name="comment_postcard"
    @blur="setData($event.target)"
    @keyup.enter="onEnter($event.target)"
    :value='$root.orderData.user_data.comment_postcard'
  ></textarea>
</template>
<script>
export default {
    name: "Postcard",
    methods: {
        onEnter(event) {
            event.blur();
        },
        setData(event) {
            this.$root.orderData.user_data[event.name] = event.value
        },
    }
};
</script>
<style scoped>
.postcard {
  display: block;
  background: #1cbbb3;
  text-align: center;
  padding-top: 38px;
  padding-bottom: 38px;
  margin-top: 20px;
}
.postcard img {
  width: 40%;
}
textarea.postcard-text {
  border: 1px solid #e1e1e1;
  resize: none;
  margin-top: 20px;
}
textarea.postcard-text::placeholder {
  color: black;
  font-size: 16px;
  padding: 15px;
}
</style>