'use client';

import Image from 'next/image';

interface CarCardProps {
  image: string;
  model: string;
  year: string;
  rating: string;
  trips: number;
  location: string;
  price: string;
  originalPrice?: string;
  discountText?: string;
}

const carList: CarCardProps[] = [
  {
    image: '/images/tesla-y.jpg',
    model: 'Tesla Model Y',
    year: '2024',
    rating: '5.0',
    trips: 45,
    location: 'Burlingame',
    price: '$468 total',
  },
  {
    image: '/images/tesla-s.jpg',
    model: 'Tesla Model S',
    year: '2023',
    rating: '5.0',
    trips: 84,
    location: 'Burlingame',
    price: '$860 total',
    originalPrice: '$931',
    discountText: 'Save $72',
  },
];

export default function CarCardList(): JSX.Element {
  return (
    <>
      {carList.map((car, index) => (
        <div
          key={index}
          className="border rounded-xl overflow-hidden flex flex-col md:flex-row bg-white shadow-sm"
        >
          <Image
            src={car.image}
            alt={car.model}
            width={350}
            height={200}
            className="object-cover w-full md:w-1/2"
          />
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">{`${car.model} ${car.year}`}</h3>
              <p className="text-sm text-gray-600">
                ⭐ {car.rating} ({car.trips} trips) · 📍 {car.location}
              </p>
            </div>
            <div className="mt-4">
              {car.originalPrice && (
                <p className="text-sm line-through text-gray-400">{car.originalPrice}</p>
              )}
              <p className="font-bold">{car.price}</p>
              {car.discountText && (
                <span className="inline-block mt-1 text-green-600 text-sm font-medium bg-green-100 px-2 py-0.5 rounded">
                  {car.discountText}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}