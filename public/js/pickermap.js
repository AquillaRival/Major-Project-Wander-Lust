const mapContainer = document.getElementById("picker-map");

if (mapContainer) {
  const defaultCoords =
    typeof initialCoordinates !== "undefined" &&
    Array.isArray(initialCoordinates) &&
    initialCoordinates.length === 2
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
  const cityInput = document.getElementById("city");
  const countryInput = document.getElementById("country");

  function setInputs(lng, lat) {
    if (lngInput) lngInput.value = lng;
    if (latInput) latInput.value = lat;
  }

  // Edit Page: Set initial coordinates if already present
  if (typeof initialCoordinates !== "undefined") {
    map.on("load", () => {
      const center = map.getCenter();
      setInputs(center.lng, center.lat);
    });
  }

  // When dragging the map, update the hidden coordinate inputs
  map.on("moveend", () => {
    const center = map.getCenter();
    setInputs(center.lng, center.lat);
  });

  // Client-side Geocoding sync on City or Country input changes
  async function syncMapWithAddress() {
    const cityVal = cityInput ? cityInput.value.trim() : "";
    const countryVal = countryInput ? countryInput.value.trim() : "";

    if (!cityVal) return;

    try {
      const query = countryVal ? `${cityVal}, ${countryVal}` : cityVal;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } },
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lng = parseFloat(data[0].lon);
        const lat = parseFloat(data[0].lat);

        map.flyTo({
          center: [lng, lat],
          zoom: 12,
          essential: true,
        });

        setInputs(lng, lat);
      }
    } catch (err) {
      console.error("Client-side geocoding error:", err);
    }
  }

  if (cityInput) {
    cityInput.addEventListener("change", syncMapWithAddress);
  }
  if (countryInput) {
    countryInput.addEventListener("change", syncMapWithAddress);
  }
}
