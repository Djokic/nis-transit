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
      const route = generateCompleteRoute(lines);
			const duration = lines[0].route.duration + lines[1].route.duration
			const numberOfBuses = Math.floor(Math.random() * 7 + 4); // random number between 4 and 10

			for(let i = 0; i < numberOfBuses; i++) {
				let currentPosition = Math.floor(Math.random() * route.points.length);
				Buses.insert({
					line: number,
					regNum: generateRegistrationNumber(),
					position: currentPosition,
					coordinates: route.points[currentPosition],
					route: route,
					updateInterval: Math.floor((duration / route.points.length) * 1000),
					speedCoeficient: (Math.random() * (1.2 - 0.8) + 0.8)
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
			const numberOfPoints = bus.route.points.length;
			let busPosition = bus.position;
			Meteor.setInterval(function () {
				busPosition = (busPosition >= numberOfPoints - 1) ? 0 : busPosition + 1;
				Buses.update({_id: bus._id}, {$set: { position: busPosition}});
			},bus.updateInterval * bus.speedCoeficient);
		}
	});
});
