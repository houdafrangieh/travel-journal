import { useLocation } from 'react-router-dom';

export default function About() {
  const location = useLocation();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-rose-900 mb-4">About Our Travel Journal</h1>
      <p className="mb-4">
        This travel journal is dedicated to fictional locations from TV shows and movies.
        Our goal is to explore these imaginary worlds as if they were real destinations.
      </p>
      <p className="mb-4">
        Current path: <span className="font-mono bg-gray-100 p-1 rounded">{location.pathname}</span>
      </p>
      <p>
        You can suggest new destinations by signing up and using the "Suggest Next Destination" button.
      </p>
    </div>
  );
}