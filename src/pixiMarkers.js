async function pixiTest() {

  function handleMarkerClick(e) {
    e.stopPropagation();
    console.log(e)
  };

  const markerTexture = await PIXI.Assets.load(`./files/debug_marker.png`);

  let scaleFactor = 0.7;

  const marker1Coords = [0, 0];
  const marker1 = new PIXI.Sprite(markerTexture);
  marker1.width = 128; // Does this works?
  marker1.height = 128; // I noticed the icon only change size if set through the scale
  marker1.anchor.set(0.5, 0.5);
  marker1.interactive = true;
  marker1.buttonMode = true;
  marker1.on("pointerup", handleMarkerClick);

  const marker2Coords = [0, 4160];
  const marker2 = new PIXI.Sprite(markerTexture);
  marker2.width = 128;
  marker2.height = 128;
  marker2.anchor.set(0.5, 0.5);
  marker2.interactive = true;
  marker2.buttonMode = true;

  const marker3Coords = [2080, 2080];
  const marker3 = new PIXI.Sprite(markerTexture);
  marker3.width = 128;
  marker3.height = 128;
  marker3.anchor.set(0.5, 0.5);
  marker3.interactive = true;
  marker3.buttonMode = true;


  const pixiContainer = new PIXI.Container();
  pixiContainer.addChild(marker1);
  pixiContainer.addChild(marker2);
  pixiContainer.addChild(marker3);

  let firstDraw = true;
  let prevZoom;

  const pixiOverlay = L.pixiOverlay((utils) => {
    const zoom = utils.getMap().getZoom();
    const container = utils.getContainer();
    const renderer = utils.getRenderer();
    const project = utils.latLngToLayerPoint;
    const unproject = utils.layerPointToLatLng;
    const scale = utils.getScale();

    if (firstDraw) {
      const markerCoords1 = project(marker1Coords);
      marker1.x = markerCoords1.x;
      marker1.y = markerCoords1.y;

      const markerCoords2 = project(marker2Coords);
      marker2.x = markerCoords2.x;
      marker2.y = markerCoords2.y;

      const markerCoords3 = project(marker3Coords);
      marker3.x = markerCoords3.x;
      marker3.y = markerCoords3.y;
    }

    if (firstDraw || prevZoom !== zoom) {
      marker1.scale.set(scaleFactor / scale);
      marker2.scale.set(scaleFactor / scale);
      marker3.scale.set(scaleFactor / scale);
    }

    firstDraw = false;
    prevZoom = zoom;
    renderer.render(container);
  }, pixiContainer);

  pixiOverlay.addTo(map);
}
pixiTest()