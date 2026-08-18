const mapContainer = document.getElementById("picker-map");

if (mapContainer) {
  // Ensure default coordinates exist
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

  // Add zoom and rotation controls
  map.addControl(new maplibregl.NavigationControl());

  const lngInput = document.getElementById("lng-input");
  const latInput = document.getElementById("lat-input");

  function setInputs(lng, lat) {
    if (lngInput) lngInput.value = lng;
    if (latInput) latInput.value = lat;
  }

  // Set initial coordinates when map loads
  map.on("load", () => {
    const center = map.getCenter();
    setInputs(center.lng, center.lat);
  });

  // Update inputs on drag end
  map.on("moveend", () => {
    const center = map.getCenter();
    setInputs(center.lng, center.lat);
  });
}
