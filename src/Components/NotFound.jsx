import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-rose-900 mb-4">404 - Page Not Found</h1>
      <p className="mb-6">The page you're looking for doesn't exist.</p>
      <button 
        onClick={() => navigate('/')}
        className="bg-rose-900 text-white px-6 py-2 rounded-md hover:bg-rose-800 transition-colors"
      >
        Go to Home
      </button>
    </div>
  );
}