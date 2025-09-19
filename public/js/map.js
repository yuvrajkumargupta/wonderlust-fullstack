
mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
    });

const el = document.createElement('div');
el.className = 'custom-marker';
el.style.backgroundImage = 'url(/images/home-icon.png)'; // your icon path
el.style.width = '40px';
el.style.height = '40px';
el.style.backgroundSize = 'cover';
el.style.borderRadius = '50%';

const marker = new mapboxgl.Marker({ color: 'red' }) // red
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // popup offset
      .setHTML(
`<h4>${listing.title}</h4><p>Can’t wait to explore? Book now and unlock the exact location!</p>`
    ) // popup content
  )
  .addTo(map);
