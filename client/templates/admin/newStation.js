Template.newStation.helpers({
  newStation: () => {
    const newStation = Session.get('newStation');
    if(newStation.lat && newStation.lng) {
      $('.new-station').modal('show').on('shown.bs.modal', () => {
        $('#new-station-name').focus();
      });
    } else {
      $('.new-station').modal('hide');
    }
    return newStation;
  }
});

Template.newStation.events({
  'keyup, change, paste #new-station-name': event => {
    let newStation = Session.get('newStation');
    newStation.name = event.target.value;
    Session.set('newStation', newStation);
  },
  'submit .new-station': event => {
    event.preventDefault();
    Stations.insert(Session.get('newStation'));
    Session.set('newStation',{});
  }
});
