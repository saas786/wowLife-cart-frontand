<template>
<div class='placeholder'>
  <input
    id="addressInput"
    name = "b_address"
    type="text"
    :value='$root.orderData.user_data.b_address'
    v-on:blur="getMarker($event.target)"
    v-on:keyup.enter="onEnter($event.target)"
    placeholder = " "
  />
  <label for="addressInput"> 
    <span>Адрес</span>  
    <span class="star">*</span>        
  </label>
</div>
  <GMapMap
    :center="center"
    :zoom="9"
    :options="{streetViewControl: false}"
    map-type-id="roadmap"
    style="width: 100%; height: 300px"
    ref="myMapRef"
  >
    <GMapCluster>
      <GMapMarker
        :key="index"
        v-for="(m, index) in marker"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        @click="center = m.position"
      />
    </GMapCluster>
  </GMapMap>
  <p class="zone">Стоимость зон: <span class="zone-green">300 ₽</span> <span class="zone-yellow">500 ₽</span>
  <br><span class="zone-text">*В остальных случаях стоимость расчитывается менеджером после заказа</span></p>
</template>
<script>
export default {
  name: "YandexMap",
  props:{
    delivery: Array
  },
  data() {
    return {
      center: { lat: 59.939096, lng: 30.314121 },
      marker: [
        {
          position: {
            lat: 59.939096,
            lng: 30.314121,
          },
        },
      ],
      deliveryZone: [] 
    };
  },
  mounted() {
    if(document.getElementById("addressInput").value != ''){
      this.getMarker(document.getElementById("addressInput"))
    }
    this.$refs.myMapRef.$mapPromise.then((map) => {
      const geocoder = new window.google.maps.Geocoder();
      const infowindow = new window.google.maps.InfoWindow();
      this.delivery.forEach(item=>{
        if(item.paths){
          let area = item.paths
          this.deliveryZone[item.zone] = new window.google.maps.Polygon({
            paths: area,
            strokeColor: item.strokeColor,
            strokeOpacity: item.strokeOpacity,
            strokeWeight: item.strokeWeight,
            fillColor: item.fillColor,
            fillOpacity: item.fillOpacity,
            deliveryId: item.id,
            deliveryPrice: item.price,
            deliveryType: item.type
          });
          this.deliveryZone[item.zone].setMap(map)

          this.deliveryZone[item.zone].addListener("click", (mapsMouseEvent) => {
            this.$root.orderData.delivery = item.id;
            this.$root.orderData.priceDeliveryZone = item.price
            if(item.price == 0){
              this.$root.orderData.priceDelivery = 0
              this.$root.orderData.priceDeliveryAdd = 0
            } else{
              this.$root.orderData.priceDelivery = item.price + this.$root.orderData.priceDeliveryAdd
            }
            this.$root.orderData.user_data.b_city = item.type;
            this.$root.orderData.user_data.b_state = item.type;
            this.geocodeLatLng(map, geocoder, infowindow, mapsMouseEvent.latLng);
          });
        }
      })
    });
  },
  methods: {
    geocodeLatLng(map, geocoder, infowindow, coord) {
      const latlng = {
        lat: coord.lat(),
        lng: coord.lng(),
      };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            this.marker[0].position.lat = coord.lat();
            this.marker[0].position.lng = coord.lng();
            document.getElementById("addressInput").value =
              results[0].formatted_address;
            this.$root.orderData.user_data.b_address = results[0].formatted_address;
            document.getElementById("addressInput").classList.remove("error")
          } else {
            this.$root.orderData.delivery = null
            document.getElementById("addressInput").classList.add("error")
            console.log("No results found")
          }
        } else {
          this.$root.orderData.delivery = null
          document.getElementById("addressInput").classList.add("error")
          console.log("Geocoder failed due to: " + status)
        }
      });
    },
    onEnter(event) {
      event.blur();
    },
    getMarker(event) {
      let address = event.value;
      this.$root.orderData.user_data[event.name] = event.value

      this.$refs.myMapRef.$mapPromise.then(() => {
        let geocoderAddress = new window.google.maps.Geocoder();

        geocoderAddress.geocode({ address: address }, (results, status) => {
          if (status === "OK") {
            this.marker[0].position.lat = results[0].geometry.location.lat();
            this.marker[0].position.lng = results[0].geometry.location.lng();

            this.$root.orderData.delivery = null;
            this.$root.orderData.priceDelivery = 0;

            for(let key in this.deliveryZone){
              if (
                window.google.maps.geometry.poly.containsLocation(
                  results[0].geometry.location,
                  this.deliveryZone[key]
                )
              ) {
                this.$root.orderData.delivery = this.deliveryZone[key].deliveryId;
                this.$root.orderData.priceDeliveryZone = this.deliveryZone[key].deliveryPrice
                if(this.$root.orderData.priceDeliveryZone == 0){
                  this.$root.orderData.priceDelivery = 0
                  this.$root.orderData.priceDeliveryAdd = 0
                } else{
                  this.$root.orderData.priceDelivery = this.deliveryZone[key].deliveryPrice + this.$root.orderData.priceDeliveryAdd
                }
                this.$root.orderData.user_data.b_city = this.deliveryZone[key].deliveryType;
                this.$root.orderData.user_data.b_state = this.deliveryZone[key].deliveryType;

                document.getElementById("addressInput").classList.remove("error")
                break
              } else {
                document.getElementById("addressInput").classList.add("error")
              }
            }
            
          } else {
            this.$root.orderData.delivery = null
            document.getElementById("addressInput").classList.add("error")
            console.log("Адрес не входит в зону доставки")
          }
        })
      });
    },
  },
};
</script>
<style scoped>
  .placeholder{
    width:100%;
    margin-top: 35px;
    margin-bottom: 20px;
  }
  .placeholder > input{
    width:100%;
  }
  div.placeholder > label {
    left: 1.5em;
  }
  p.zone{
    margin-top: 10px;
  }
  p.zone span{
    padding: 0 10px;
    margin: 0 5px;
    border-radius: 15px;
  }
  p.zone span.zone-green{
    border: 1px solid #1cbbb3;
    background: rgb(28, 187, 179, .4);
  }
  p.zone span.zone-yellow{
    border: 1px solid #f4de40;
    background: rgb(244, 222, 64, .4);
  }
  p.zone span.zone-text{
    padding: 0;
    margin: 0;
    font-size: 14px;
  }
</style>