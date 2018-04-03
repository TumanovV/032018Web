var GoogleMapsloader = require("google-map");

module.exports = mapSelector => {
  let el = document.querySelector ("#" + mapSelector);
  if (el){
    var ufa ={
      lat: 54.814602,
      lng: 56.886682
    };
    var zoomVal = 15;

    var screenWidth = document.body.clientWidth;
    if (screenWidth <= 1024) zoomval = 14;
    if (screenWidth <= 480) zoomval = 13;


    GoogleMapsloader.load(function(google){
      var map = new google.maps.Map(el,{
        zoom: zoomVal,
        center: ufa,
        mapTypeControl: false,
        disableDefaultUI: true,
      })
    })
  }
};
