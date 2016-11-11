Template.home.onCreated(function() {
  homeRef = this;
  homeRef.linePickerActive = new ReactiveVar(false);
})

Template.home.onRendered(function() {})

Template.home.events({
  'click .line-picker__pick': () => {
    homeRef.linePickerActive.set(
      homeRef.linePickerActive.get() ? false : true
    );
  },
  'click .line-picker__line': (event) => {
    FlowRouter.go(`/${event.target.dataset.lineNumber}`);
  }
});

Template.home.helpers({
  linePickerActive: () => {
    return homeRef.linePickerActive.get();
  },
  lines: () => {
    return Lines.find({direction: 'A'}).fetch();
  }
});
