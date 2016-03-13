Template.selectedStation.helpers({
  selectedStation: function() {
    return Session.get('selectedStation');
  },
  isInNewLine: function() {
    const newLine = Session.get('newLine');
    const selectedStation = Session.get('selectedStation');
    return newLine.find(station => {
      return station._id == selectedStation._id
    })
  }
})

Template.selectedStation.events({
  'keyup, paste #selected-station-name': function() {
    const name = $('#selected-station-name').val();
    if(name.length) {
      Stations.update(Session.get('selectedStation')._id, {$set: {name: name}});
    }
  },
  'click .selected-station-delete:not(.disabled)': function() {
    Stations.remove(Session.get('selectedStation')._id);
  },
  'click .selected-station-add-to-line:not(.disabled)':function() {
    let newLine = Session.get('newLine');
    newLine.push(Session.get('selectedStation'));
    Session.set('newLine', newLine);
  },
  'click .selected-station-remove-from-line:not(.disabled)':function() {
    let newLine = Session.get('newLine').filter(station => {
      return station._id != Session.get('selectedStation')._id
    });
    Session.set('newLine', newLine);
  }
});
