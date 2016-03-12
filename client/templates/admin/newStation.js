Template.newStation.helpers({
  newStation: function() {
    const newStation = Session.get('newStation');
    if(newStation.lat && newStation.lng) {
      $('.new-station').modal('show').on('shown.bs.modal', function (e) {
        $('#new-station-name').focus();
      });
    } else {
      $('.new-station').modal('hide');
    }
    return newStation;
  }
});

Template.newStation.events({
  'keyup, change, paste #new-station-name': function(event, template) {
    let newStation = Session.get('newStation');
    newStation.name = event.target.value;
    Session.set('newStation', newStation);
  },
  'submit .new-station': function(event, template) {
    event.preventDefault();
    Stations.insert(Session.get('newStation'));
    Session.set('newStation',{});
  }
});
