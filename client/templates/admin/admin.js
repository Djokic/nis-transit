Template.admin.onCreated(function () {
  Session.setDefault('newStation',{})
  Session.setDefault('newLine',[])
  Session.setDefault('selectedStation',{})
  Session.setDefault('selectedLine',{})

  Session.set('newStation',{})
  Session.set('newLine',[])
  Session.set('selectedStation',{})
  Session.set('selectedLine',{})
});
