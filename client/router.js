FlowRouter.route('/admin', {
  action: function () {
    BlazeLayout.render("admin");
  }
});

FlowRouter.route('/', {
  action: function () {
    BlazeLayout.render("home");
  }
});

FlowRouter.route('/:lineNumber', {
  action: function () {
    BlazeLayout.render("line");
  }
});
