Meteor.methods({
  getLineRoute: stations => {
    const points = stations.map(station => {
      return `${station.lat},${station.lng}`
    })

    return Modules.server.getRoute(points);

  }
})
