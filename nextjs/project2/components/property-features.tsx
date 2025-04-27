export default function PropertyFeatures() {
  const features = {
    interior: [
      "Hardwood Floors",
      "Central A/C & Heating",
      "High Ceilings",
      "Walk-in Closets",
      "Custom Lighting",
      "Smart Home Technology",
      "Open Floor Plan",
      "Gourmet Kitchen"
    ],
    exterior: [
      "Swimming Pool",
      "Landscaped Gardens",
      "Outdoor Kitchen",
      "Covered Patio",
      "Double Garage",
      "Security System",
      "Sprinkler System",
      "Fenced Yard"
    ],
    community: [
      "Playground",
      "Fitness Center",
      "Community Pool",
      "Tennis Courts",
      "Dog Park",
      "Walking Trails",
      "Clubhouse",
      "24/7 Security"
    ]
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Property Features</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-lg font-medium">Interior Features</h3>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {features.interior.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="mb-3 text-lg font-medium">Exterior Features</h3>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {features.exterior.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="mb-3 text-lg font-medium">Community Amenities</h3>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {features.community.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}