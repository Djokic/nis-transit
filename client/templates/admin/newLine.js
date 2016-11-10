Template.newLine.onCreated(function () {
  const _this = this;

  newLineRef = this;

  newLineRef.lineNumber = new ReactiveVar(null);
  newLineRef.selectedDirection = new ReactiveVar('A');

  newLineRef.lineForbidden = new ReactiveVar(false);
  newLineRef.directionAForbidden = new ReactiveVar(false);
  newLineRef.directionBForbidden = new ReactiveVar(false);

  GoogleMaps.ready('adminMap', map => {
    _this.map = map.instance;
    _this.directionsService = new google.maps.DirectionsService;
  });
});

Template.newLine.onRendered(function () {
  $('[type="radio"]').radiocheck();
  $('.new-line').on('shown.bs.modal', () => {
    $('#new-line-number').focus();
  });

  Tracker.autorun(() => {
    const newLine = Session.get('newLine');
    if(newLine.length === 0) {
      $('.new-line').modal('hide');
      $('.new-line')[0].reset();
    }

    //New line autosuggestion
    let lines = Lines.find({number: newLineRef.lineNumber.get()}).fetch();
    newLineRef.lineForbidden.set(false);
    newLineRef.directionAForbidden.set(false);
    newLineRef.directionBForbidden.set(false);

    if(lines.length === 2) {
      newLineRef.lineForbidden.set(true);
    }

    if(lines.length === 1) {
      const direction = lines[0].direction;
      if(direction === 'A') {
        newLineRef.directionAForbidden.set(true);
        newLineRef.selectedDirection.set('B');
      } else {
        newLineRef.directionBForbidden.set(true);
        newLineRef.selectedDirection.set('A');
      }
    }

    if(lines.length === 0) {
      newLineRef.selectedDirection.set('A');
    }


  })
});

Template.newLine.events({
  'click .radio .icons': event => {
    const direction = $(event.currentTarget).closest('.radio').find('[type="radio"]').val();
    if(direction === 'A' && !newLineRef.directionAForbidden.get()) {
      newLineRef.selectedDirection.set(direction);
    }
    if(direction === 'B' && !newLineRef.directionBForbidden.get()) {
      newLineRef.selectedDirection.set(direction);
    }

  },
  'keyup .new-line-number, change .new-line-number': (event, template) => {
    newLineRef.lineNumber.set(event.target.value.trim());
  },
  'submit .new-line': (event, template) => {
    event.preventDefault();
    if(!newLineRef.lineForbidden.get()) {
      const number = $('#new-line-number').val();
      const direction = $('[name="new-line-direction"]:checked').val();
      const stations = Session.get('newLine');
      Session.set('newLine', []);
      newLineRef.selectedDirection.set('A');
      Meteor.call('createLine', number, direction, stations, (err, ret) => {
        if(! err) {
          console.log(ret);
        } else {
          throw new Meteor.Error(err);
        }
      });
    }
  }
});

Template.newLine.helpers({
  'lineForbidden': () => {
    return newLineRef.lineForbidden.get();
  },
  'directionADisabled': () => {
    if(newLineRef.lineForbidden.get() || newLineRef.directionAForbidden.get()) {
      return 'disabled';
    }
    return '';
  },
  'directionBDisabled': () => {
    if(newLineRef.lineForbidden.get() || newLineRef.directionBForbidden.get()) {
      return 'disabled';
    }
    return '';
  },
  'directionASelected': () => {
    return newLineRef.selectedDirection.get() === 'A' ? 'checked' : '';
  },
  'directionBSelected': () => {
    return newLineRef.selectedDirection.get() === 'B' ? 'checked' : '';
  }
});
