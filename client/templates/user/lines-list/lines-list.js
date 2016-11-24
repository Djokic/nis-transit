

Template.linesList.events({
  'click .lines-list__line': (event) => {
    window.location.href = `/${event.currentTarget.dataset.lineNumber}`;
  }
});

Template.linesList.helpers({
  lines: () => {
    let lines = Lines.find().fetch();

    lines.forEach(line1 => {
      line1['complete'] = false;
      if(line1.direction === 'A') {
        lines.forEach(line2 => {
          if(line2.number === line1.number && line2.direction === 'B') {
            line1['complete'] = true;
          }
        })
      }
    });

    return lines.filter(line => { return line['complete']});
  }
});
