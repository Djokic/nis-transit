Template.adminMap.onCreated(function () {
  this.stations = new ReactiveVar({});
});

Template.adminMap.onRendered(function () {
  GoogleMaps.load();
  const _this = this;

  GoogleMaps.ready('adminMap', map => {
    map.instance.addListener('dblclick', event => {
      Session.set('newStation',
        {
          name: "",
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          lines: []
        }
      )
    });

    Stations.find().observe({
      added: document => {

        //Create a marker for this station
        let station = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
          icon: MAP_MARKER.DEFAULT,
          // We store the document _id on the marker in order
          // to update the document within the 'dragend' event below.
          id: document._id,
          document: document
        });

        // This listener lets us drag markers on the map and update their corresponding document.
        google.maps.event.addListener(station, 'dragend', event => {
          Stations.update(station.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
        });

        google.maps.event.addListener(station, 'click', event => {
          Session.set('selectedStation', station.document);
        });

        let stations = _this.stations.get();
        stations[document._id] = station;
        _this.stations.set(stations);
      },
      changed: (newDocument, oldDocument) => {
        let stations = _this.stations.get();
        stations[newDocument._id].document = newDocument;
        stations[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
        _this.stations.set(stations);

        let selectedStation = Session.get('selectedStation');
        selectedStation = stations[selectedStation._id].document;
        Session.set('selectedStation', selectedStation);
      },
      removed: document => {
        let stations = _this.stations.get();
        stations[document._id].setMap(null);
        delete stations[document._id];
        _this.stations.set(stations);
        Session.set('selectedStation', {});
      }
    });

    Tracker.autorun(() => {
      let stations = _this.stations.get();
      let selectedStation = Session.get('selectedStation');
      let newLine = Session.get('newLine');

      Object.keys(stations).forEach(id => {
        const station = stations[id];
        station.setIcon(MAP_MARKER.DEFAULT);

        if(station.document.lines.length) {
          station.setDraggable(false);
          station.setIcon(MAP_MARKER.LOCKED);
        } else {
          station.setDraggable(true);
        }
      });

      newLine.forEach(station => {
        Object.keys(stations).forEach(id => {
          if(station._id === id)
            stations[id].setIcon(MAP_MARKER.IN_LINE)
        })
      })

      if(selectedStation._id) {
        stations[selectedStation._id].setIcon(MAP_MARKER.SELECTED)
      }

      // Causes circular dependency and infinite loop of Tracker.autorun
      //_this.stations.set(stations);
    });
  });
});

Template.adminMap.helpers({
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
