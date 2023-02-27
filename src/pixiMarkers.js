async function pixiTest() {
  function handleMarkerClick(e) {
    e.stopPropagation();
    console.log(e);
  }

  const markerTexture = await PIXI.Assets.load(
    `https://1c03930b-6ab3-4cd6-bf2d-8681c11b1eec.id.repl.co/files/debug_marker.png`
  );
  const markerLatLng = [0, 0];
  const marker = new PIXI.Sprite(markerTexture);
  marker.width = 128; // Does this works?
  marker.height = 128; // I noticed the icon only change size if set through the scale
  marker.anchor.set(0.5, 1);

  marker.interactive = true;
  marker.buttonMode = true;
  marker.on('pointerup', handleMarkerClick);

  const pixiContainer = new PIXI.Container();
  pixiContainer.addChild(marker);

  let firstDraw = true;
  let prevZoom;

  const pixiOverlay = L.pixiOverlay((utils) => {
    const zoom = utils.getMap().getZoom();
    const container = utils.getContainer();
    const renderer = utils.getRenderer();
    const project = utils.latLngToLayerPoint;
    const unproject = utils.layerPointToLatLng;
    const scale = utils.getScale();
    console.log(`Scale: ${scale}`);
    console.log('L.CRS.PixelPoint.pointToLatLng(markerLatLng)');
    console.log(
      L.CRS.PixelPoint.pointToLatLng(
        L.point(markerLatLng[0], markerLatLng[1]),
        scale
      )
    );
    let scaleFactor = 0.5;

    let x = markerLatLng[0],
      y = markerLatLng[1];

    // calculate point in xy space
    var pointXY = L.point(x, y);
    console.log('Point in x,y space: ' + pointXY);

    // convert to lat/lng space
    var pointlatlng = map.layerPointToLatLng(pointXY);
    // why doesn't this match e.latlng?
    console.log('Point in lat,lng space: ' + pointlatlng);
    console.log(pointlatlng);

    let convertedCoords = unproject(markerLatLng);
    console.log('convertedCoords');
    console.log(convertedCoords);

    if (firstDraw) {
      marker.x = markerLatLng[0];
      marker.y = markerLatLng[1];
    }

    if (firstDraw || prevZoom !== zoom) {
      marker.scale.set(scaleFactor / scale);
    }

    firstDraw = false;
    prevZoom = zoom;
    renderer.render(container);
  }, pixiContainer);

  pixiOverlay.addTo(map);
}
pixiTest();
