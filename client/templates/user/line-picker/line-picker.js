Template.linePicker.onCreated(function() {
  linePickerRef = this;
  linePickerRef.active = new ReactiveVar(false);
})

Template.linePicker.onRendered(function() {})

Template.linePicker.events({
  'click .line-picker__pick': () => {
    linePickerRef.active.set(
      linePickerRef.active.get() ? false : true
    );
  },
  'click .line-picker__line': (event) => {
    window.location.href = `/${event.target.dataset.lineNumber}`;
  }
});

Template.linePicker.helpers({
  active: () => {
    return linePickerRef.active.get();
  },
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
