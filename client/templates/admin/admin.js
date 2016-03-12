Template.admin.onCreated(function() {
  Session.setDefault('newStation',{})
  Session.setDefault('newline',{})
  Session.setDefault('selectedStation',{})
  Session.setDefault('selectedLine',{})

  Session.set('newStation',{})
  Session.set('newline',{})
  Session.set('selectedStation',{})
  Session.set('selectedLine',{})
});
