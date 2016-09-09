Meteor.methods({
  createLine: (number, direction, stations) => {
    const points = stations.map(station => {
      return `${station.lat},${station.lng}`
    })

    return Modules.server.getRoute(points).then( route => {
      Lines.upsert({ number, direction }, { $set: { number, direction, route } });

      stations.forEach(station => {
        Stations.update({_id: station._id}, {$addToSet: {"lines": number}})
      });

      Meteor.call('createBusesForLine', number);

      return true;
    });
  },
  deleteLine: number => {
    Lines.remove({number});
    Stations.update({ }, {$pull: {"lines": number }}, {multi: true});
    Buses.remove({line: number});
  }
})
