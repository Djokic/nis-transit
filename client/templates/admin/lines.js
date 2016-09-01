Template.lines.onCreated(function () {
  let polylines = {};

  GoogleMaps.ready('adminMap', map => {

    Tracker.autorun(() => {
      const number = Session.get('selectedLine');
      if(! isNaN(number)) {
        // Remove all polylines from map
        Object.keys(polylines).forEach(id => {
          polylines[id].setMap(null);
        })

        // Draw selected line
        const lines = Lines.find({ number }).fetch();
        lines.forEach(line => {
          const polyline = new google.maps.Polyline({
            path: line.route.points,
            geodesic: true,
            strokeColor: '#e74c3c',
            strokeOpacity: 1.0,
            strokeWeight: 4
          });
          polyline.setMap(map.instance)
          polylines[line._id] = polyline;
        });
      }
    });
  });
});

Template.lines.helpers({
  lines: () => {
    const lines = Lines.find({}).fetch().map(line => line.number);
    return _.uniq(lines);
  },
  selectedLine: () => Session.get('selectedLine')
})

Template.lines.events({
  'click .selected-line-delete:not(.disabled)': () => {
    const number = Session.get('selectedLine');

    //FIXME auto update selectedLine in tracker when line is deleted
    Session.set('selectedLine', false);
    Meteor.call('deleteLine', number);
  },
  'click .lines li': (event, template) => {
    const number = $(event.target).text();
    Session.set('selectedLine', number);
  }
})
