function generateRegistrationNumber() {
	const s = "ABCDEFGHIJKLMNOPQRSTUVWXYZŠĐČĆŽ";
	return   'NI-' + //city
						Math.floor(Math.random() * 900 + 100) + // 3 digits
						"-" + //separator
						s.charAt(Math.floor(Math.random() * s.length)) + s.charAt(Math.floor(Math.random() * s.length)); //last two characters
}

function generateCompleteRoute(lines) {
  let route = { distance: 0, duration: 0, points: []};
  lines.forEach(line => {
    route.distance += line.route.distance;
    route.duration += line.route.duration;
    route.points = route.points.concat(line.route.points)
  })
  return route;
}

Meteor.methods({
	createBusesForLine: (number) => {
		const lines = Lines.find({number: number}).fetch();

    /* If there are 2 lines with the same number (A & B directions)
     * then line is complete and buses can be created for that line
     */
		if(lines.length === 2) {
      let route = generateCompleteRoute(lines);
			const numberOfBuses = Math.floor(Math.random() * 7 + 4); // random number between 4 and 10

			for(let i = 0; i < numberOfBuses; i++) {
				let currentPosition = Math.floor(Math.random() * route.points.length);
				Buses.insert({
					line: number,
					regNum: generateRegistrationNumber(),
					position: currentPosition,
					coordinates: route.points[currentPosition]
					//inStation: bus.inStation
					}
				);
			}
		}
	}
});

Meteor.startup(() => {
	let buses = Buses.find();
	buses.observe({
		added: (bus) => {
			const lines = Lines.find().fetch();
      let route = generateCompleteRoute(lines);
			var delay = 700;
			var multiplier = 1;
			Meteor.setInterval(function () {
				bus.position = (bus.position >= route.points.length - 1) ? 0 : bus.position + 1;
				bus.coordinates = route.points[bus.position];
				//bus.inStation = path[bus.position].station;
				//multiplier = bus.inStation ? 8.5 : 1;
				Buses.update({_id: bus._id},
												 {$set: {
														position: bus.position,
														coordinates: bus.coordinates,
														//inStation: bus.inStation
												 }
												});
			}, delay * multiplier);
		}
	});
});
