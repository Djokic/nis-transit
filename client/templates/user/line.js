Template.line.onRendered(function () {
  GoogleMaps.load();

  const _this = this;
  const lineNumber = FlowRouter.getParam("lineNumber");

  GoogleMaps.ready('lineMap', map => {
    /*Stations.find({ lines: { $in: [lineId] } }).observe({
      added: document => {
        console.log(document)

        //Create a marker for this station
        let station = new google.maps.Marker({
          draggable: false,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
          icon: MAP_MARKER.DEFAULT,
          // We store the document _id on the marker in order
          // to update the document within the 'dragend' event below.
          id: document._id,
          document: document
        });
      }
    });*/

    const stations = Stations.find({ lines: { $in: [lineNumber] } });
    stations.forEach(station => {
      const stationMarker = new google.maps.Marker({
        draggable: false,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(station.lat, station.lng),
        map: map.instance,
        icon: MAP_MARKER.DEFAULT,
        // We store the document _id on the marker in order
        // to update the document within the 'dragend' event below.
        id: station._id
      });
    })
    const lines = Lines.find({ number: lineNumber }).fetch();
    lines.forEach(line => {
      const polyline = new google.maps.Polyline({
        path: line.route.points,
        geodesic: true,
        strokeColor: '#e74c3c',
        strokeOpacity: 1.0,
        strokeWeight: 4
      });
      polyline.setMap(map.instance)
    })
  });
});


Template.line.helpers({
  mapOptions: () => {
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(MAP_CENTER_LAT, MAP_CENTER_LNG),
        zoom: MAP_ZOOM,
        styles: MAP_COLOR_SCHEME,
        disableDefaultUI: true,
        disableDoubleClickZoom: true
      };
    }
  }
});
