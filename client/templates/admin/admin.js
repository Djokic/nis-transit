Template.admin.onCreated(function () {
  Session.setDefault('newStation',{})
  Session.setDefault('newLine',[])
  Session.setDefault('selectedStation',{})
  Session.setDefault('selectedLine', false)

  Session.set('newStation',{})
  Session.set('newLine',[])
  Session.set('selectedStation',{})
  Session.set('selectedLine', false)
});

Template.admin.events({
  'click .log-out': () => {
    Meteor.logout();
  }
});
