const colors = {
  blue: '#3498db',
  green: '#1abc9c',
  yellow: '#f1c40f',
  red: '#d9534f'
}

const markerIcon = function(color) {
  return {
    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#000',
    strokeWeight: 1,
    scale: 1,
  }
}

MAP_MARKER = {
  DEFAULT:  markerIcon(colors.blue),
  SELECTED: markerIcon(colors.green),
  LOCKED:   markerIcon(colors.yellow),
  IN_LINE:  markerIcon(colors.red)
}
