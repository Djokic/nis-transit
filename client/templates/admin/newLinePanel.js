Template.newLinePanel.helpers({
  newLine: () => Session.get('newLine')
})

Mousetrap.bind('c', () => {
  if(!$("input").is(':focus'))
    $('.new-line-create').click();
});
