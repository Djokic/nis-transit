Template.line.onRendered(function () {
  GoogleMaps.load();

  const _this = this;
  const lineNumber = FlowRouter.getParam("lineNumber");

  GoogleMaps.ready('lineMap', map => {
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

    // This needs to be dynamic so it's auto updated when bus position changes
    let BusMarkers = {};
    Buses.find({line: lineNumber}).observe({
  		added: function (bus) {
        BusMarkers[bus._id] = new google.maps.Marker({
          draggable: false,
          position: new google.maps.LatLng(bus.coordinates.lat, bus.coordinates.lng),
          map: map.instance,
          icon: MAP_MARKER.LOCKED,
          id: bus._id
        });
  		},
  		changed: function (bus) {
        BusMarkers[bus._id].setPosition(new google.maps.LatLng(bus.coordinates.lat, bus.coordinates.lng))
  		}
  	});
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
