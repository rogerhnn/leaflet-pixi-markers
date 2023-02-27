async function getData() {
  let origin = window.location.origin;
  let data = await fetch(`./src/markers.json`, {
    cache: 'reload',
  });
  let markerData = await data.json();
  return markerData;
}

const markersGroup = new L.LayerGroup();

async function loadMapMarkers() {
  const mapMarkers = await getData();

  for (let i = 0; i < mapMarkers.length; i++) {
    let markerStored = mapMarkers[i];
    let coord_x = markerStored.coords[0];
    let coord_y = markerStored.coords[1];
    let iconUrl = markerStored.icon;
    let title = markerStored.title;

    let markerIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });

    let popupcontent = `<p>${title}</p>`;

    let marker = L.marker([coord_y, coord_x], {
      draggable: false,
      icon: markerIcon,
      position: [coord_y, coord_x],
    }).bindPopup(popupcontent);

    marker.addTo(markersGroup);
  }

  map.addLayer(markersGroup);
}
