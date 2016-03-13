Template.newLine.onCreated(function () {
  const _this = this;
  GoogleMaps.ready('adminMap', map => {
    _this.map = map.instance;
    _this.directionsService = new google.maps.DirectionsService;
  });
});

Template.newLine.onRendered(function () {
  $('[type="radio"]').radiocheck();
  $('.new-line').on('shown.bs.modal', () => {
    $('#new-line-number').focus();
  });

  Tracker.autorun(() => {
    const newLine = Session.get('newLine');
    if(newLine.length === 0) {
      $('.new-line').modal('hide');
      $('.new-line')[0].reset();
    }
  })
});

Template.newLine.events({
  'click .radio .icons': event => {
    $(event.currentTarget).closest('.form-group').find('[type="radio"]').removeAttr('checked');
    $(event.currentTarget).closest('.radio').find('[type="radio"]').attr('checked', true);
  },
  'submit .new-line': (event, template) => {
    event.preventDefault();
    const number = $('#new-line-number').val();
    const direction = $('[name="new-line-direction"]').val();
    const stations = Session.get('newLine');
    calculateRoute(template.map, template.directionsService, stations);
    Session.set('newLine', []);
  }
});


function calculateRoute(map, directionsService, points) {
  points = points.map(point => {
    return {
      location: new google.maps.LatLng(point.lat, point.lng),
      stopover: false
    }
  })

  const start = points.shift().location;
  const finish = points.pop().location;

  console.log(points)

  directionsService.route({
    origin: start,
    destination: finish,
    waypoints: points,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC
  }, (response, status) => {
    console.log(response, status)
    var route = new google.maps.Polyline({
      path: response.routes[0].overview_path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    route.setMap(map)
  })
}
