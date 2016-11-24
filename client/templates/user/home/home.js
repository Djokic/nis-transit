Template.home.onCreated(function() {
  homeRef = this;
  homeRef.linePickerActive = new ReactiveVar(false);

  homeRef.numberOfLines = new ReactiveVar(0);
  homeRef.numberOfStations = new ReactiveVar(0);
  homeRef.numberOfBuses = new ReactiveVar(0);

})
Template.home.onRendered(function() {})
Template.home.events({
  'click .line-picker__pick': () => {
    homeRef.linePickerActive.set(!homeRef.linePickerActive.get());
  }
});
Template.home.helpers({
  linePickerActive: () => {
    return homeRef.linePickerActive.get();
  },
  stats: () => {
    let lines = Lines.find().fetch();

    lines.forEach(line1 => {
      line1['complete'] = false;
      if(line1.direction === 'A') {
        lines.forEach(line2 => {
          if(line2.number === line1.number && line2.direction === 'B') {
            line1['complete'] = true;
          }
        })
      }
    });

    let stations = Stations.find().count();
    let buses = Buses.find().count()

    return {
      lines: lines.length / 2,
      stations,
      buses
    }
  }
});
