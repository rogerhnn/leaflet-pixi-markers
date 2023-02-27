async function pixiTest() {
  function handleMarkerClick(e) {
    e.stopPropagation();
    console.log(e);
  }

  const markerTexture = await PIXI.Assets.load(
    `./files/debug_marker.png`
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

    let scaleFactor = 0.5;

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
