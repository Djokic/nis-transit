Template.line.onRendered(function () {
  LineRef = this;
  LineRef.number = FlowRouter.getParam("lineNumber");

  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images/';

  LineRef.map = L.map('line-map', {doubleClickZoom: false}).setView([MAP_CENTER_LAT,MAP_CENTER_LNG], MAP_ZOOM);
  LineRef.map.options.maxZoom = MAP_ZOOM + 3;
  L.tileLayer.provider('OpenStreetMap.BlackAndWhite').addTo(LineRef.map);


  const stations = Stations.find({ lines: { $in: [LineRef.number] } }).fetch();
  stations.forEach(station => {
    const stationMarker = L.marker([station.lat, station.lng]).addTo(LineRef.map);
    const stationPopup = L.popup().setContent(`<p>${station.name}</p> <strong>${station.lines}</strong>`);
    stationMarker.bindPopup(stationPopup);
  });

  const lines = Lines.find({ number: LineRef.number }).fetch();
  lines.forEach(line => {
    const lineRoute = line.route.points.map(point => { return [point.lat, point.lng]});
    const linePolyline = L.polyline(lineRoute, {color: 'red'}).addTo(LineRef.map);
    const linePopup = L.popup().setContent(`<p>${line.number}</p>`);
    linePolyline.bindPopup(linePopup);
  })

  /*GoogleMaps.ready('lineMap', map => {
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
  });*/
});


Template.line.helpers({
});
