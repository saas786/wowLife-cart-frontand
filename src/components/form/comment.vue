<template>
    <textarea
    name="comment"
    type="text"
    v-on:blur="setData($event.target)"
    v-on:keyup.enter="onEnter($event.target)"
    :value="$root.orderData.user_data.comment"
    placeholder="Комментарий к заказу"
    ></textarea>
</template>
<script>
export default {
    name: "Comment",
};
</script>
<style scoped>
    textarea{
        width:100%;
        height: 90px;
        border: 1px solid #e1e1e1;
        resize: none;
    }
    textarea::placeholder {
    color: black;
    font-size: 16px;
    padding: 15px;
    }
</style>