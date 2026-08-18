const mapElement = document.getElementById("map");

if (mapElement) {
  // Use geometry coordinates or fallback
  const coordinates =
    listingGeometry &&
    listingGeometry.coordinates &&
    listingGeometry.coordinates.length === 2
      ? listingGeometry.coordinates
      : [77.209, 28.6139];

  const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/bright",
    center: coordinates,
    zoom: 12,
  });

  if (listingGeometry && listingGeometry.coordinates) {
    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
      `<h5>${listingTitle}</h5><p>${listingLocation}</p>`,
    );

    new maplibregl.Marker({ color: "#fe424d" })
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);
  }

  map.addControl(new maplibregl.NavigationControl());
}
