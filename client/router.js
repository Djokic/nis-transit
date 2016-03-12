FlowRouter.route('/admin', {
  action: function() {
    BlazeLayout.render("admin");
  }
});

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("landingPage");
  }
});

FlowRouter.route('/:lineId', {
  action: function() {
    BlazeLayout.render("line");
  }
});
