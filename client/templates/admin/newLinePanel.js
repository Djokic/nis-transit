Template.newLinePanel.helpers({
  newLine: () => Session.get('newLine')
})

Template.newLinePanel.events({
  'click .new-line-create:not(.disabled)': () => {
    $('.new-line').modal('show');
  },
  'click .new-line-clean': () => {
    Session.set('newLine', []);
  }
})

Mousetrap.bind('c', () => {
  if(!$("input").is(':focus'))
    $('.new-line-create').click();
});
