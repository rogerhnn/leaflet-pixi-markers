const tilesUrl =
  'https://raw.githack.com/rogerhn/rogerhn.github.io/master/maps/map_4160/{z}_{x}_{y}.jpg';

let mapSize = 4160;
let tileSize = 260;
let mapScale = mapSize / tileSize;
let defaultZoom = 0;
let maxNativeZoom = 8;
let mapMaxZoom = 4;
let mapInitialZoom = 0;
let mapBounds = [
  [0, 0],
  [mapSize, mapSize],
];

L.CRS.PixelPoint = L.extend({}, L.CRS.Simple, {
  transformation: new L.Transformation(
    1 / mapScale,
    0,
    -1 / mapScale,
    tileSize
  ),
});

let map = L.map('map', {
  maxNativeZoom: maxNativeZoom,
  minZoom: 0,
  maxZoom: mapMaxZoom,
  zoomControl: false,
  fullscreenControl: true,
  fullscreenControlOptions: {
    position: 'topright',
  },
  crs: L.CRS.PixelPoint,
  // inertia: !1,
  // boxZoom: !1,
  // inertia: !0,
  // zoomSnap: .5,
  // zoomDelta: .5,
  // wheelPxPerZoomLevel: 90,
  // wheelDebounceTime: 0,
  attributionControl: false,
}).setView([mapSize / 2, mapSize / 2], mapInitialZoom);

L.Control.Coordinates.include({
  _update: function (evt) {
    'use strict';
    let pos = evt.latlng,
      opts = this.options;
    if (pos) {
      //pos = pos.wrap(); // Remove that instruction
      this._currentPos = pos;
      this._inputY.value = L.NumberFormatter.round(
        pos.lat,
        opts.decimals,
        opts.decimalSeperator
      );
      this._inputX.value = L.NumberFormatter.round(
        pos.lng,
        opts.decimals,
        opts.decimalSeperator
      );
      this._label.innerHTML = this._createCoordinateLabel(pos);
    }
  },
});

L.control
  .coordinates({
    position: 'bottomright',
    decimals: 0, //optional default 4
    decimalSeperator: '.', //optional default "."
    labelTemplateLat: 'Y: {y}', //optional default "Lat: {y}"
    labelTemplateLng: 'X: {x}', //optional default "Lng: {x}"
    enableUserInput: true, //optional default true
    useDMS: false, //optional default false
    useLatLngOrder: false, //ordering of labels, default false -> lng-lat
    markerType: L.marker, //optional default L.marker
    markerProps: {}, //optional default {}
  })
  .addTo(map);

let mapLayer = L.tileLayer.canvas(tilesUrl, {
  maxNativeZoom: maxNativeZoom,
  minZoom: defaultZoom,
  maxZoom: mapMaxZoom,
  tileSize: tileSize,
  type: 'mapLayer',
  noWrap: true,
  tms: false,
  bounds: [
    [0, 0],
    [mapSize, mapSize],
  ],
  continuousWorld: true,
  keepBuffer: 2,
  useCache: false,
});

map.addLayer(mapLayer);

map.on('click', function (e) {
  console.log(e);
});

loadMapMarkers();

const toggle = document.getElementById('toggle');
toggle.addEventListener('click', function (e) {
  let element = e.target;
  if (element.classList.contains('active')) {
    map.removeLayer(markersGroup);
    element.classList.remove('active');
  } else {
    element.classList.add('active');
    map.addLayer(markersGroup);
  }
});
