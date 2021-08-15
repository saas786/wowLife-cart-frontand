<template>
  <v-date-picker class="col-12 col-xl-4" v-model="date" :min-date='new Date()' @dayclick="setTimeDelivery" color="teal">
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
  <select v-model="selectedTime" class="col-12 col-xl-5 time" @change="setTimeDelivery">
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
                selectedTime: 'Выберите время',
                timezone: '',
            };
        },
        mounted(){
          this.setTimeDelivery()
        },
        methods:{
          setTimeDelivery(){
            let day = String(this.date.getDate())
            let month = String(this.date.getMonth() + 1)
            let year = this.date.getFullYear()
            if(day.length == 1){
              day = '0' + day
            }
            if(month.length == 1){
              month = '0' + month
            }

            this.$root.orderData.user_data.delivery_time = `${day}.${month}.${year}`
            if(this.selectedTime != 'Выберите время'){
              this.$root.orderData.user_data.delivery_time = this.$root.orderData.user_data.delivery_time + ' ' + this.selectedTime
            }

            let addPrice = 100
            this.$root.orderData.priceDeliveryAdd = 0
            if(this.$root.orderData.delivery != 'pickup' && this.$root.orderData.delivery != 'electr'){
              let deliveryDate = this.$root.orderData.user_data.delivery_time.split(' ')[0]
              let dateParts = deliveryDate.split(".");
              deliveryDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
              deliveryDate.setHours(0,0,0,0)

              let nowData = new Date()
              nowData.setHours(0,0,0,0)
              
              if(deliveryDate.toString() === nowData.toString()){
                this.$root.orderData.priceDeliveryAdd = addPrice
                this.$root.orderData.priceDelivery = this.$root.orderData.priceDeliveryZone + addPrice
              } else {
                this.$root.orderData.priceDelivery = this.$root.orderData.priceDeliveryZone
              }
            }
          }
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
      width: 100%;
    }
    .placeholder{
      width:70%;
    }
    .time{
      width: auto;
      height: 40px;
      padding: 5px 15px;
      border: 1px solid #E1E1E1;
      margin-top:20px;
    }
</style>