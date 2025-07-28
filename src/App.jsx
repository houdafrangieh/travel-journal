import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import JournalEntry from "./Components/JournalEntry.jsx";
import data from "./Data/entries.js";
import SignUpForm from "./Components/SignUpForm.jsx";
import Home from "./Components/Home.jsx";
import About from "./Components/About.jsx";
import NotFound from "./Components/NotFound.jsx";

function AppWrapper() {
  return (
    <Router>
      <App data={data} />
    </Router>
  );
}

function App({ data }) {
  const [entries, setEntries] = useState(data);
  const [newDestination, setNewDestination] = useState({
    location: '',
    duration: '',
    description: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const navigate = useNavigate();

  // Memoize the fetch function with useCallback
  const fetchDestinationImage = useCallback(async (location) => {
    setIsImageLoading(true);
    setImageError(null);
    try {
      const cleanLocation = location.replace(/[^\w\s]/gi, '').trim();
      const response = await fetch(
        `https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_KEY}&q=${cleanLocation}`
      );
      const data = await response.json();
      return {
        src: data.hits[0]?.webformatURL || "src/Assets/Images/default.jpg",
        alt: `Image of ${cleanLocation}`
      };
    } catch (error) {
      setImageError("Couldn't load image - using default");
      return {
        src: "src/Assets/Images/default.jpg",
        alt: "Default destination"
      };
    } finally {
      setIsImageLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDestination(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imgData = await fetchDestinationImage(newDestination.location);
    
    const newEntry = {
      id: entries.length + 1,
      img: imgData,
      location: newDestination.location,
      duration: newDestination.duration,
      description: newDestination.description,
      author: currentUser || 'Anonymous'
    };
    
    setEntries([...entries, newEntry]);
    setNewDestination({ location: '', duration: '', description: '' });
    setShowForm(false);
    navigate('/');
  };

  const handleSignUp = (username) => {
    setCurrentUser(username);
    setShowSignUp(false);
    navigate('/');
  };

  const entryElements = entries.map((entry) => (
    <JournalEntry 
      key={entry.id}
      img={entry.img.src}
      alt={entry.img.alt}
      location={entry.location}
      duration={entry.duration}
      description={entry.description}
      author={entry.author}
    />
  ));
  
  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <header className="bg-rose-900 p-5 flex justify-between items-center text-white text-xl">
        <Link to="/" className="hover:text-amber-100 transition-colors">
          ✈️ My Travel Journal
        </Link>
        {currentUser ? (
          <span className="text-sm">Welcome, {currentUser}!</span>
        ) : (
          <button 
            onClick={() => setShowSignUp(true)}
            className="bg-white text-rose-900 px-4 py-2 rounded-md text-sm hover:bg-amber-50 transition-colors"
          >
            Sign Up
          </button>
        )}
      </header>
      
      <main className="flex-1 p-5 max-w-6xl mx-auto w-full">
        {showSignUp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md relative">
              <button 
                onClick={() => setShowSignUp(false)}
                className="absolute top-3 right-3 text-gray-500 text-2xl hover:text-gray-700"
              >
                ×
              </button>
              <SignUpForm onSignUp={handleSignUp} />
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <>
              <p className="italic text-gray-600 mb-5 text-sm leading-relaxed">
                Disclaimer: All the towns mentioned in the journal are based on fictional towns from series and tv shows.
                <br />Credits go to the respective creators of these shows for their imaginative worlds.
              </p>
              
              {currentUser && (
                <>
                  <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-rose-900 text-white px-4 py-2 rounded-md mb-5 hover:bg-rose-800 transition-colors"
                  >
                    {showForm ? 'Cancel Suggestion' : 'Suggest Next Destination'}
                  </button>

                  {showForm && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8 p-5 bg-gray-100 rounded-lg">
                      <input
                        type="text"
                        name="location"
                        value={newDestination.location}
                        onChange={handleInputChange}
                        placeholder="Location (e.g., 📌Gotham City)"
                        required
                        className="p-3 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        name="duration"
                        value={newDestination.duration}
                        onChange={handleInputChange}
                        placeholder="Duration (e.g., May 1, 2023 - June 30, 2023)"
                        required
                        className="p-3 border border-gray-300 rounded-md"
                      />
                      <textarea
                        name="description"
                        value={newDestination.description}
                        onChange={handleInputChange}
                        placeholder="Tell us about this destination..."
                        required
                        className="p-3 border border-gray-300 rounded-md min-h-[100px]"
                      />
                      <button 
                        type="submit" 
                        disabled={isImageLoading}
                        className={`bg-green-700 text-white p-3 rounded-md ${isImageLoading ? 'opacity-75 cursor-wait' : 'hover:bg-green-800'} transition-colors relative`}
                      >
                        {isImageLoading ? 'Finding images...' : 'Submit Suggestion'}
                        {isImageLoading && (
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        )}
                      </button>
                      {imageError && <p className="text-red-600 text-sm text-center">{imageError}</p>}
                    </form>
                  )}
                </>
              )}

              <div className="space-y-8">
                {entryElements}
              </div>
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="text-center p-4 text-rose-900">
        © 2025 Travel Journal
      </footer>
    </div>
  );
}

export default AppWrapper;