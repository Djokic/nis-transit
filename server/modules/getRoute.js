const GOOGLE_API_KEY = 'AIzaSyDkTfQ849TfA3zQdcYrVo96FG8pT8lh-JY';


/**
 * Creates an array of elements split into groups the length of size.
 * If array can’t be split evenly, the final chunk will be the remaining elements.
 * @param {Array} array - Array that needs to be splited in chunks
 * @param {Number} size - Chunk size
 * @return {Array} - Array of chunks
 *
 * Example:
 * _chunk(['a', 'b', 'c', 'd'], 2);
 * → [['a', 'b'], ['c', 'd']]
 */
let _chunk = (array, size = 1) => {
  return array.reduce((res, item, index) => {
    if (index % size === 0) res.push([]);
    res[res.length-1].push(item);
    return res;
  }, []);
}

let _getRoutePart = (points, mode = 'driving') => {
  const routeParams = {
    params: {
      origin: points.shift(),
      destination: points.pop(),
      waypoints: points.join('|'),
      mode: mode,
      key: GOOGLE_API_KEY
    }
  }

  return new Promise((resolve, reject) => {
    try {
      HTTP.get('https://maps.googleapis.com/maps/api/directions/json', routeParams, (error, response) => {
        if(! error) {
          if(response.data.status === 'OK') resolve(response.data);
          else reject(Error(response.data.status));
        } else {
          reject(Error(error));
        }
      });
    } catch(error) {
      reject(Error(error));
    }
  });
}



let _parseRoutePart = (response) => {
  const legs = response.routes[0].legs;

  let distance = 0;
  let duration = 0;
  let steps = [];

  legs.forEach(leg => {
    distance += leg.distance.value;
    duration += leg.duration.value;
    steps = steps.concat(leg.steps);
  })

  let points = [];

  steps.forEach(step => {
    // TODO: investigate is step start and end included in polyline points

    const stepPoints = polyline.decode(step.polyline.points).map(point => {
      return {
        lat: point[0],
        lng: point[1]
      }
    });
    //stepPoints.unshift(step.start_location);
    //stepPoints.push(step.end_location);
    points = points.concat(stepPoints);
  });

  return {
    distance,
    duration,
    points
  }
}

/*
 * Calculates distance between two points with given coordinates
 * Haversine Formula
 * @param1 {Object} - First point
 * @param2 {Object} - Second point
 * @return - distance between points in meters
 */
let _haversineDistance = (point_1, point_2) => {
	function toRad(x) {
	    return x * Math.PI / 180;
	}

	const R = 6371; // km

	const x1 = Math.abs(point_1.lat - point_2.lat);
	const dLat = toRad(x1);
	const x2 = Math.abs(point_1.lng - point_2.lng);
	const dLng = toRad(x2)
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(point_1.lat)) * Math.cos(toRad(point_2.lat)) *	Math.sin(dLng / 2) * Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;

	return d*1000;
}

/*
 * Calculates new point (midpoint) between two points with given coordinates
 * @param1 {Object} - First point
 * @param2 {Object} - Second point
 * @return {Object} - Step object to be inserted
 */
let _midPoint = (point_1, point_2) => {
	let delta = {
    lat: Math.abs(point_1.lat - point_2.lat),
    lng: Math.abs(point_1.lng - point_2.lng)
  }

  let midpoint = {
    lat: point_1.lat > point_2.lat ? point_2.lat + delta.lat/2 : point_1.lat + delta.lat/2,
    lng: point_1.lng > point_2.lng ? point_2.lng + delta.lng/2 : point_1.lng + delta.lng/2
  }

  return midpoint;
}

/**
 * Interpolate route path by calculating midpoints betweein main route points
 * @param {Array} points - Array of route points, coordinates in format [lat, lng]
 * @return {Array} points - Array of route points, coordinates in format [lat, lng]
 */
let _interpolateRoute = (points) => {
	/*
	 * Sort points according to distance using Haversine formula
	 */
  let number_of_points = points.length;
	let min_distance;

	for(let i = 1; i < number_of_points; i++) {
		min_distance = 1000000;
		for(let j = i; j < number_of_points; j++) {
			let distance = _haversineDistance(points[i-1], points[j])
			if( distance < min_distance) {
				let tmp = points[i];
				points[i] = points[j];
				points[j] = tmp;
				min_distance = distance;
			}
		}
		if(min_distance > 10) {
			points.push(_midPoint(points[i-1], points[i]));
			number_of_points++;
			i--;
		}
	}
	return points;
}

/**
 * Get route data from Google Directions Service API
 * @param {Array} points - Array of route points, coordinates in format [lat, lng]
 * @param {String} mode -Google Direction Service travel mode (default: driving)
 * @return {Promise} Route - Route Object { distance, duration, points[]}
 */

let getRoute = (points, mode = 'driving') => {
 /**
  * Google Directions API has a limit of 23 point in single request
  * because of that we split points array in smaller chunks, with the maximum size of 23 (minimum size of 2)
  * and fetch Dirction data for each chunk separetly
  * At the end we combine all results and get complete Route
  */

  //FIXME fix chunk size calcuclation
  const chunkSize = points.length % 23 !== 1 ? 23 : 22;
  const pointGroups = _chunk(points, chunkSize);

  let promises = [];

  pointGroups.forEach(pointGroup => {
   promises.push(_getRoutePart(pointGroup, mode))
  })

  return Promise.all(promises).then(responses => {
   let Route = {
     distance: 0,
     duration: 0,
     points: []
   }

   //Each response in responses is Google Directions API response object
   responses.forEach(response => {
     const part = _parseRoutePart(response);
     Route.distance += part.distance;
     Route.duration += part.duration;
     Route.points = Route.points.concat(part.points);
   })

   Route.points = _interpolateRoute(Route.points);

   return Route;
  });
}

Modules.server.getRoute = getRoute;
