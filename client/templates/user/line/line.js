Template.line.onRendered(function () {
  LineRef = this;
  LineRef.number = FlowRouter.getParam("lineNumber");

  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images/';

  LineRef.map = L.map('line-map', {doubleClickZoom: false}).setView([MAP_CENTER_LAT,MAP_CENTER_LNG], MAP_ZOOM);
  LineRef.map.options.maxZoom = MAP_ZOOM + 3;
  L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png').addTo(LineRef.map);
  //L.tileLayer.provider('OpenStreetMap.BlackAndWhite').addTo(LineRef.map);

  LineRef.buses = {};


  const stations = Stations.find({ lines: { $in: [LineRef.number] } });
  stations.observe({
    added: (station) => {
      const stationIconSize = Math.ceil(20 * Math.pow(1.05, station.lines.length)); // Dynamic size of station marker based on number of lines
      const stationIcon = L.divIcon({ className: 'station-icon', iconSize: [stationIconSize, stationIconSize] });
      const stationMarker = L.marker([station.lat, station.lng], {icon: stationIcon}).addTo(LineRef.map);
      const stationPopup = L.popup().setContent(`<p>${station.name}</p> <strong>${station.lines}</strong>`);
      stationMarker.bindPopup(stationPopup);
    }
  });

  const lines = Lines.find({ number: LineRef.number });
  lines.observe({
    added: (line) => {
      const lineRoute = line.route.points.map(point => { return [point.lat, point.lng]});
      const linePolyline = L.polyline(lineRoute, {color: 'white', weight: 8, className: 'line-polyline'}).addTo(LineRef.map);
      const linePopup = L.popup().setContent(`<p>${line.number}${line.direction}</p>`);
      linePolyline.bindPopup(linePopup);
    }
  });

  const buses = Buses.find({ line: LineRef.number });
  buses.observe({
    added: (bus) => {
      const busIcon = L.divIcon({ className: 'bus-icon', iconSize: [20, 20] });
      LineRef.buses[bus._id] = L.marker([bus.coordinates.lat, bus.coordinates.lng], {icon: busIcon}).addTo(LineRef.map);
    },
    changed: (bus) => {
      LineRef.buses[bus._id].setLatLng([bus.coordinates.lat, bus.coordinates.lng]).update();
    }
  })
});


Template.line.helpers({
});
