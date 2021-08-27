<template>
  <img id="myImg" :src="path" class="thumb"/>
  <span class="zoom" @click="zoom(path)">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" preserveAspectRatio="none" class="bi bi-zoom-in" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
      <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
      <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
    </svg>
  </span>
  <!-- The Modal -->
  <div id="myModal" class="modal">
    <!-- The Close Button -->
    <span class="close" @click="close">&times;</span>

    <!-- Modal Content (The Image) -->
    <img class="modal-content" id="img01" />

    <!-- Modal Caption (Image Text) -->
    <div id="caption"></div>
  </div>
</template>
<script>
export default {
  props: {
    path: String,
  },
   methods: {
     zoom(path){
      let modal = document.getElementById("myModal");
      let modalImg = document.getElementById("img01");
      //let captionText = document.getElementById("caption");
      modal.style.display = "block";
      modalImg.src = path;
      //captionText.innerHTML = this.alt;
     },
     close(){
      let modal = document.getElementById("myModal");
      modal.style.display = "none";
     }
   }
};
</script>
<style scoped>
.thumb {
  width: 100%;
}
span.zoom{
  position: absolute;
  bottom: 50%;
  left: 40%;
  width: 20%;
  cursor: pointer;
}
span.zoom svg{
  fill: #929292;
}


/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
}

/* Modal Content (Image) */
.modal-content {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
}

/* Caption of Modal Image (Image Text) - Same Width as the Image */
#caption {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
  text-align: center;
  color: #ccc;
  padding: 10px 0;
  height: 150px;
}

/* Add Animation - Zoom in the Modal */
.modal-content, #caption {
  animation-name: zoom;
  animation-duration: 0.6s;
}

@keyframes zoom {
  from {transform:scale(0)}
  to {transform:scale(1)}
}

/* The Close Button */
.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px){
  .modal-content {
    width: 100%;
  }
}
</style>