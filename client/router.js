FlowRouter.route('/admin', {
  action: function () {
    BlazeLayout.render("admin");
  }
});

FlowRouter.route('/', {
  action: function () {
    BlazeLayout.render("landingPage");
  }
});

FlowRouter.route('/:lineNumber', {
  action: function () {
    BlazeLayout.render("line");
  }
});
