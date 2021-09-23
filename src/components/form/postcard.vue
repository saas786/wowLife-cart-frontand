<template>
  <div class="row">
    <p class="h5" v-if="$root.orderData.delivery != 'electr'">Открытка</p>
    <p class="h5" v-else>Текст поздравления</p>
    <div class="col-12 col-xl-6" v-if="$root.orderData.delivery != 'electr'">
      <div class="postcard">
        <img :src="$baseDir + '/images/logo.svg'" />
        <p class="text">РЕАЛИЗУЙ МЕЧТЫ</p>
      </div>
    </div>
    <div class="col-12 col-xl-6">
      <textarea
        class="postcard-text"
        maxlength="100"
        placeholder="Введите текст поздравления"
        name="comment_postcard"
        v-model='$root.orderData.user_data.comment_postcard'
      ></textarea>
    </div>
  </div>
  <div class="row" style="margin-top: 5px;">
    <div class="col-6" v-if="$root.orderData.delivery != 'electr'"></div>
    <div class="col-6">
      <p style="color: gray">Количество символо: {{100 - $root.orderData.user_data.comment_postcard.length}}</p>
    </div>
  </div>
</template>
<script>
export default {
    name: "Postcard",
};
</script>
<style scoped>
.h5{
  margin-bottom: 20px;
}
.row{
  margin-top: 35px;
}
.postcard {
  display: block;
  background: #1cbbb3;
  text-align: center;
  padding-top: 38px;
  padding-bottom: 28px;
  border-radius:15px;
}
.postcard img {
  width: 40%;
}
p.text{
  color: white;
  font-weight:400;
  letter-spacing: 1.5px;
  margin-bottom: 0;
  margin-top: 1rem;
}
textarea.postcard-text {
  border: 1px solid #e1e1e1;
  resize: none;
  min-height: 150px;
  width: 100%;
  height: 100%;
}
textarea.postcard-text::placeholder {
  color: black;
  font-size: 16px;
  padding: 15px;
}
</style>