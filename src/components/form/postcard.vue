<template>
  <div class="row" style="padding-right: 15px;">
    <p class="h5">Открытка</p>
    <div class="col-5">
      <div class="postcard">
        <img :src="$baseDir + '/images/logo.svg'" />
      </div>
    </div>
    <textarea
      class="col-7 postcard-text"
      maxlength="100"
      placeholder="Введите текст поздравления"
      name="comment_postcard"
      v-model='$root.orderData.user_data.comment_postcard'
    ></textarea>
  </div>
  <div class="row" style="margin-top: 5px;">
    <div class="col-5"></div>
    <div class="col-7" style="padding-left: 0; color: gray">Количество символо: {{100 - $root.orderData.user_data.comment_postcard.length}}</div>
  </div>
</template>
<script>
export default {
    name: "Postcard",
};
</script>
<style scoped>
.row{
  margin-top: 35px;
}
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