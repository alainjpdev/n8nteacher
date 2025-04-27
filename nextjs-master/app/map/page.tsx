"use client";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapPage() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[calc(100vh-4rem)] w-full"> {/* 4rem = altura Navbar */}
        <iframe
          className="absolute inset-0 w-full h-full border-0"
          src={`https://www.google.com/maps/embed/v1/view?key=${googleMapsApiKey}&center=20.2111,-87.4654&zoom=13&maptype=roadmap`}
          allowFullScreen
          loading="lazy"
          style={{
            pointerEvents: "auto", // ✅ Permite mover, hacer scroll, hacer zoom normalmente
          }}
        />
      </section>
    </div>
  );
}