<template>
  <input id="addressInput" type="text" v-on:blur="handleBlur($event.target)" v-on:keyup.enter="onEnter($event.target)"/>
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
</template>
<script>

export default {
  name: "YandexMap",
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
      deliverySPb: null,
      paths: [
        { lat: 60.058895218404, lng: 30.145536396425484 },
        { lat: 60.03901197481374, lng: 30.15514943353486 },
        { lat: 60.014999005565905, lng: 30.23205373040986 },
        { lat: 59.91946082258761, lng: 30.205961201112984 },
        { lat: 59.90087107005044, lng: 30.211454365175484 },
        { lat: 59.87606853768708, lng: 30.29247853509736 },
        { lat: 59.830549127116264, lng: 30.280118915956734 },
        { lat: 59.809147299315285, lng: 30.31719777337861 },
        { lat: 59.824337109328354, lng: 30.43530080072236 },
        { lat: 59.84917823061003, lng: 30.466886494081734 },
        { lat: 59.856075253600785, lng: 30.52044484369111 },
        { lat: 59.8705543493996, lng: 30.532804462831734 },
        { lat: 59.909822991000844, lng: 30.527311298769234 },
        { lat: 59.95660910997794, lng: 30.549283955019234 },
        { lat: 59.97035717693071, lng: 30.55340382806611 },
        { lat: 59.98135152313281, lng: 30.53143117181611 },
        { lat: 59.986847327391295, lng: 30.48473927728486 },
        { lat: 60.04518391814351, lng: 30.436674091737984 },
        { lat: 60.069174956576035, lng: 30.37487599603486 },
        { lat: 60.09657193722919, lng: 30.38036916009736 },
        { lat: 60.102048601740016, lng: 30.25677296869111 },
      ],
      deliveryObl: null,
      pathsObl: [
        { lat: 59.983627236219185, lng: 30.200326199173276 },
        { lat: 60.03030928569356, lng: 30.082223171829526 },
        { lat: 60.083775239820866, lng: 30.093209499954526 },
        { lat: 60.10979138991192, lng: 30.153634304642026 },
        { lat: 60.123475851469216, lng: 30.214059109329526 },
        { lat: 60.12894804366613, lng: 30.312936062454526 },
        { lat: 60.11526585706646, lng: 30.406319851517026 },
        { lat: 60.08240539970748, lng: 30.477730984329526 },
        { lat: 60.00697649797236, lng: 30.568368191360776 },
        { lat: 59.93963096667718, lng: 30.639779324173276 },
        { lat: 59.848704003688994, lng: 30.579354519485776 },
        { lat: 59.799002516313024, lng: 30.499703640579526 },
        { lat: 59.779654129744145, lng: 30.370614285110776 },
        { lat: 59.78932972570504, lng: 30.216805691360776 },
        { lat: 59.844565044723744, lng: 30.175606960892026 },
        { lat: 59.88317531781153, lng: 30.172860378860776 },
        { lat: 59.90934962847772, lng: 30.208565945267026 },
      ],
      deliveryKolpino: null,
      pathsKolpino: [
        { lat: 59.76663867269137, lng: 30.601860583076473 },
        { lat: 59.76093344445086, lng: 30.56272178913116 },
        { lat: 59.737237678678554, lng: 30.55722862506866 },
        { lat: 59.729277667446844, lng: 30.568901598701473 },
        { lat: 59.73014297785538, lng: 30.627953112373348 },
        { lat: 59.73689163063722, lng: 30.64511925006866 },
        { lat: 59.75903148510325, lng: 30.62417656208038 },
      ],
    };
  },
  mounted() {
    this.$refs.myMapRef.$mapPromise.then((map) => {
      this.deliverySPb = new window.google.maps.Polygon({
        paths: this.paths,
        strokeColor: "#00ab15",
        strokeOpacity: 0.9,
        strokeWeight: 3,
        fillColor: "#00ab15",
        fillOpacity: 0.35,
      });
      this.deliverySPb.setMap(map);

      this.deliveryObl = new window.google.maps.Polygon({
        paths: [this.paths, this.pathsObl],
        strokeColor: "#fbff00",
        strokeOpacity: 0.9,
        strokeWeight: 3,
        fillColor: "#fbff00",
        fillOpacity: 0.35,
      });
      this.deliveryObl.setMap(map);

      this.deliveryKolpino = new window.google.maps.Polygon({
        paths: this.pathsKolpino,
        strokeColor: "#fbff00",
        strokeOpacity: 0.9,
        strokeWeight: 3,
        fillColor: "#fbff00",
        fillOpacity: 0.35,
      });
      this.deliveryKolpino.setMap(map);

      const geocoder = new window.google.maps.Geocoder();
      const infowindow = new window.google.maps.InfoWindow();
      this.deliverySPb.addListener("click", (mapsMouseEvent) => {
        document.getElementById("regionDelivery").value = 'spb'
        this.geocodeLatLng(map, geocoder, infowindow, mapsMouseEvent.latLng);
      });

      this.deliveryObl.addListener("click", (mapsMouseEvent) => {
        document.getElementById("regionDelivery").value = 'obl'
        this.geocodeLatLng(map, geocoder, infowindow, mapsMouseEvent.latLng);
      });

      this.deliveryKolpino.addListener("click", (mapsMouseEvent) => {
        document.getElementById("regionDelivery").value = 'obl'
        this.geocodeLatLng(map, geocoder, infowindow, mapsMouseEvent.latLng);
      });
    })
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
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      });
    },
    onEnter(event){
        event.blur();
    },
    handleBlur(event) {
        let address = event.value
        this.$refs.myMapRef.$mapPromise.then(() => {
            let geocoderAddress = new window.google.maps.Geocoder();

            geocoderAddress.geocode({ address: address }, (results, status) => {
                if (status === "OK") {
                    this.marker[0].position.lat = results[0].geometry.location.lat();
                    this.marker[0].position.lng = results[0].geometry.location.lng();
                    if (window.google.maps.geometry.poly.containsLocation(results[0].geometry.location, this.deliverySPb)) {
                        document.getElementById("regionDelivery").value = 'spb'
                    } else if(window.google.maps.geometry.poly.containsLocation(results[0].geometry.location, this.deliveryObl)) {
                        document.getElementById("regionDelivery").value = 'obl'
                    } else if(window.google.maps.geometry.poly.containsLocation(results[0].geometry.location, this.deliveryKolpino)) {
                        document.getElementById("regionDelivery").value = 'obl'
                    } else {
                        document.getElementById("regionDelivery").value = 'null'
                    }
                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });
        })
    }   
  },
};
</script>