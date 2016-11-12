Meteor.methods({
  createLine: (number, direction, stations) => {
    return Modules.server.getRoute(stations).then( route => {
      const startStation = stations[0].name;
      const endStation = stations[stations.length-1].name;
      Lines.upsert({ number, direction }, { $set: { number, direction, route, startStation, endStation } });

      stations.forEach(station => {
        Stations.update({_id: station._id}, {$addToSet: {"lines": number, "linesWithDirection": `${number} | ${direction}`}})
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
