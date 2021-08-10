<template>
  <v-date-picker class="col-5" v-model="date" color="teal">
    <template v-slot="{ inputValue, togglePopover }">
      <div class="flex items-center">
        <button
          class="p-2 bg-blue-100 border border-blue-200 hover:bg-blue-200 text-blue-600 rounded-l focus:bg-blue-500 focus:text-white focus:border-blue-500 focus:outline-none"
          @click="togglePopover()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            class="w-4 h-4 fill-current"
          >
            <path
              d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"
            ></path>
          </svg>
        </button>
        <div class='placeholder'>
            <input
            name="delivery_time"
            :value="inputValue"
            class="bg-white text-gray-700 w-full py-1 px-2 appearance-none border rounded-r focus:outline-none focus:border-blue-500"
            readonly
            @click="togglePopover()"
            />
        </div>
      </div>
    </template>
  </v-date-picker>
  <select class="col-6 time">
   <option>Выберите время</option>
   <option value="09:00-11:00">09:00 - 11:00</option>
   <option value="11:00-13:00">11:00 - 13:00</option>
   <option value="13:00-15:00">13:00 - 15:00</option>
   <option value="15:00-17:00">15:00 - 17:00</option>
   <option value="17:00-19:00">17:00 - 19:00</option>
   <option value="19:00-21:00">19:00 - 21:00</option>
   <option value="21:00-23:00">21:00 - 23:00</option>
   </select>
</template>
<script>
    export default {
        data() {
            return {
                date: new Date(),
                timezone: '',
            };
        }
    };
</script>
<style scoped>
    button{
        width: 40px;
        height: 40px;
    }
    button .fill-current{
        fill: #1CBBB3;
    }
    input[name='delivery_time']{
      width: auto;
    }
    .time{
      width: auto;
      height: 40px;
      padding: 5px 15px;
      border: 1px solid #E1E1E1;
      margin-top:20px;
    }
</style>