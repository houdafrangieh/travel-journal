import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Home() {
  const [featuredEntries, setFeaturedEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading featured entries
  useEffect(() => {
    const timer = setTimeout(() => {
      const featured = [
        {
          id: 1,
          img: { src: "src/Assets/Images/Riverdale.jpg", alt: "Riverdale" },
          location: "📌Riverdale",
          duration: "January 26, 2017 – August 23, 2023",
          description: "Explore the iconic town from Archie Comics with its thrilling mysteries."
        },
        {
          id: 2,
          img: { src: "src/Assets/Images/Rosewood.jpg", alt: "Rosewood" },
          location: "📌Rosewood",
          duration: "June 8, 2010 – June 27, 2017",
          description: "Discover the charming yet mysterious town from Pretty Little Liars."
        }
      ];
      setFeaturedEntries(featured);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-rose-900 text-white p-8 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Explore Fictional Worlds</h1>
          <p className="text-xl mb-6">
            Your passport to the most fascinating fictional towns from TV shows and movies
          </p>
          <Link 
            to="/" 
            className="inline-block bg-white text-rose-900 px-6 py-3 rounded-md font-medium hover:bg-amber-50 transition-colors"
          >
            Browse Destinations
          </Link>
        </div>
      </section>

      {/* Featured Destinations */}
      <section>
        <h2 className="text-2xl font-bold text-rose-900 mb-6 border-b pb-2">
          Featured Destinations
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-900"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {featuredEntries.map(entry => (
              <div key={entry.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={entry.img.src} 
                  alt={entry.img.alt} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-rose-900 mb-1">{entry.location}</h3>
                  <p className="text-gray-600 text-sm mb-3">{entry.duration}</p>
                  <p className="mb-4 line-clamp-2">{entry.description}</p>
                  <Link 
                    to="/" 
                    className="text-rose-900 font-medium hover:underline inline-flex items-center"
                  >
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-amber-100 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-rose-900 mb-3">Ready to Explore?</h2>
        <p className="mb-5 max-w-2xl mx-auto">
          Join our community of fictional world travelers and share your own experiences with these amazing destinations.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-rose-900 text-white px-6 py-2 rounded-md font-medium hover:bg-rose-800 transition-colors"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}