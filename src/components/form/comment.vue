<template>
    <input
    name="comment"
    type="text"
    v-on:blur="setData($event.target)"
    v-on:keyup.enter="onEnter($event.target)"
    :value="$root.orderData.user_data.comment"
    />
</template>
<script>
export default {
    name: "Comment",
};
</script>
