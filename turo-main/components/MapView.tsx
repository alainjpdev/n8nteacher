'use client';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Cancun`;

export default function MapView(): JSX.Element {
  return (
    <iframe
      title="map"
      width="100%"
      height="100%"
      loading="lazy"
      allowFullScreen
      src={mapUrl}
    />
  );
}