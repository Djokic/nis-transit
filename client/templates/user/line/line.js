Template.line.onCreated(function() {
  LineRef = this;
  LineRef.buses = {};
  LineRef.activeBusId = new ReactiveVar(null);

  LineRef.nextStationETA = new ReactiveVar(-1);
  LineRef.nextStationName = new ReactiveVar('');
});

Template.line.onRendered(function () {
  LineRef.number = FlowRouter.getParam("lineNumber");
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images/';

  LineRef.map = L.map('line-map', {doubleClickZoom: false}).setView([MAP_CENTER_LAT,MAP_CENTER_LNG], MAP_ZOOM);
  LineRef.map.options.maxZoom = MAP_ZOOM + 3;
  L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png').addTo(LineRef.map);
  //L.tileLayer.provider('OpenStreetMap.BlackAndWhite').addTo(LineRef.map);

  LineRef.map.on('click', () => LineRef.activeBusId.set(null));

  const stations = Stations.find({ lines: { $in: [LineRef.number] } });
  stations.observe({
    added: (station) => {
      const stationIconSize = Math.ceil(20 * Math.pow(1.05, station.lines.length)); // Dynamic size of station marker based on number of lines
      const stationIcon = L.divIcon({ className: 'station-icon', iconSize: [stationIconSize, stationIconSize] });
      const stationMarker = L.marker([station.lat, station.lng], {icon: stationIcon}).addTo(LineRef.map);
      let stationPopup = document.createElement('div');
      Blaze.renderWithData(Template.stationPopup, {station}, stationPopup);
      stationMarker.bindPopup(stationPopup);
    }
  });

  const lines = Lines.find({ number: LineRef.number });
  lines.observe({
    added: (line) => {
      const lineRoute = line.route.points.map(point => { return [point.lat, point.lng]});
      const linePolyline = L.polyline(lineRoute, {color: 'white', weight: 8, className: 'line-polyline'}).addTo(LineRef.map);
      const linePopup = L.popup().setContent(`<p>${line.number} | ${line.direction}</p>`);
      linePolyline.bindPopup(linePopup);
      LineRef.map.fitBounds(linePolyline.getBounds())
    }
  });

  const buses = Buses.find({ line: LineRef.number });
  buses.observe({
    added: (bus) => {
      const busIcon = L.divIcon({ className: `bus-icon bus-icon--${bus._id}`, iconSize: [20, 20] });
      LineRef.buses[bus._id] = {};
      LineRef.buses[bus._id]['marker'] = L.marker([bus.route.points[bus.position].lat, bus.route.points[bus.position].lng], {icon: busIcon}).addTo(LineRef.map).on('click', () => LineRef.activeBusId.set(bus._id));
      $(`.bus-icon--${bus._id}`).css({ transitionDuration: `${bus.updateInterval * bus.speedCoeficient * 1.1}ms`, WebkitTransitionDuration: `${bus.updateInterval * bus.speedCoeficient * 1.1 }ms`});
      LineRef.buses[bus._id]['stations'] = bus.route.points.map((point, index) => { return { position: index, isStation: point.isStation, stationName: point['stationName'] }}).filter((point) => point.isStation);
    },
    changed: (bus, oldBus) => {
      LineRef.buses[bus._id]['marker'].setLatLng([bus.route.points[bus.position].lat, bus.route.points[bus.position].lng]).update();
      if(bus._id === LineRef.activeBusId.get()) {
        let distanceToStation = 100000;
        let index;
        LineRef.buses[bus._id]['stations'].forEach((station, i) => {
          let distance = station.position - bus.position;
          if(distance > 0 && distance < distanceToStation) {
            distanceToStation = distance;
            index = i;
          }
        })
        LineRef.nextStationETA.set(Math.floor(distanceToStation * bus.updateInterval * bus.speedCoeficient /1000));
        LineRef.nextStationName.set(LineRef.buses[bus._id]['stations'][index].stationName);
      }
    }
  })
});


Template.line.helpers({
  'activeBus': () => {
    $('.bus-icon').removeClass('active');
    $(`.bus-icon--${LineRef.activeBusId.get()}`).addClass('active');
    return Buses.findOne({_id: LineRef.activeBusId.get()});
  },
  'nextStation': ()=> {
    return {
      name: LineRef.nextStationName.get(),
      eta: LineRef.nextStationETA.get()
    }
  }
});

Template.line.events({

});
