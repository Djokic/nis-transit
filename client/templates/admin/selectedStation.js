Template.selectedStation.helpers({
  selectedStation: function() {
    return Session.get('selectedStation');
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
  }
});
