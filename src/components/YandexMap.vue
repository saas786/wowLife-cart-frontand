<template>
  <input
    id="addressInput"
    name = "b_address"
    type="text"
    :value='$root.orderData.user_data.b_address'
    v-on:blur="getMarker($event.target)"
    v-on:keyup.enter="onEnter($event.target)"
  />
  <GMapMap
    :center="center"
    :zoom="9"
    map-type-id="roadmap"
    style="width: 500px; height: 300px"
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
  <p>Зелёный - 300 р. | Жёлтый - 500р.</p>
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
            this.$root.orderData.priceDelivery = item.price;
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
                this.$root.orderData.priceDelivery = this.deliveryZone[key].deliveryPrice;
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