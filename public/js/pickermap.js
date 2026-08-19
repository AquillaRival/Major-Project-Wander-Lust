const mapContainer = document.getElementById("picker-map");

if (mapContainer) {
  const defaultCoords =
    typeof initialCoordinates !== "undefined" &&
    Array.isArray(initialCoordinates)
      ? initialCoordinates
      : [77.209, 28.6139];

  const map = new maplibregl.Map({
    container: "picker-map",
    style: "https://tiles.openfreemap.org/styles/bright",
    center: defaultCoords,
    zoom: 12,
  });

  map.addControl(new maplibregl.NavigationControl());

  const lngInput = document.getElementById("lng-input");
  const latInput = document.getElementById("lat-input");

  function setInputs(lng, lat) {
    if (lngInput) lngInput.value = lng;
    if (latInput) latInput.value = lat;
  }

  // Edit Page: Agar pehle se initialCoordinates hain tabhi load par set karein
  if (typeof initialCoordinates !== "undefined") {
    map.on("load", () => {
      const center = map.getCenter();
      setInputs(center.lng, center.lat);
    });
  }

  // New Page & Edit Page: User ke drag karne par hamesha update hoga
  map.on("moveend", () => {
    const center = map.getCenter();
    setInputs(center.lng, center.lat);
  });
}
