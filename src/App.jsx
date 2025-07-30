import { useState, useCallback, useReducer, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Components/AuthContext';
import data from "./Data/entries.js";
import LoadingSpinner from './Components/LoadingSpinner.jsx';
import ErrorBoundary from './Components/ErrorBoundary';

// Lazy-loaded components
const JournalEntry = lazy(() => import("./Components/JournalEntry.jsx"));
const SignUpForm = lazy(() => import("./Components/SignUpForm.jsx"));
const Home = lazy(() => import("./Components/Home.jsx"));
const About = lazy(() => import("./Components/About.jsx"));
const NotFound = lazy(() => import("./Components/NotFound.jsx"));

// Form reducer for destination input
const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return { location: '', duration: '', description: '' };
    default:
      return state;
  }
};

function AppContent({ data }) {
  const [entries, setEntries] = useState(data);
  const [newDestination, dispatch] = useReducer(formReducer, {
    location: '',
    duration: '',
    description: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  
  const { currentUser, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch destination image from API
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
        src: data.hits[0]?.webformatURL || "/default.jpg",
        alt: `Image of ${cleanLocation}`
      };
    } catch (error) {
      setImageError("Couldn't load image - using default");
      return {
        src: "/default.jpg",
        alt: "Default destination"
      };
    } finally {
      setIsImageLoading(false);
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', field: name, value });
  };

  // Handle form submission
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
    dispatch({ type: 'RESET' });
    setShowForm(false);
    navigate('/');
  };

  // Handle user sign up
  const handleSignUp = (username) => {
    signIn(username);
    setShowSignUp(false);
    navigate('/');
  };

  // Handle user sign out - FIXED IMPLEMENTATION
  const handleSignOut = () => {
    signOut();
    navigate('/');
    window.location.reload(); // Ensure complete state reset
  };

  // Render journal entries
  const renderEntries = () => (
    <div className="space-y-8">
      {entries.map((entry) => (
        <ErrorBoundary key={`error-boundary-${entry.id}`}>
          <Suspense key={`suspense-${entry.id}`} fallback={<LoadingSpinner />}>
            <JournalEntry 
              key={entry.id}
              img={entry.img.src}
              alt={entry.img.alt}
              location={entry.location}
              duration={entry.duration}
              description={entry.description}
              author={entry.author}
            />
          </Suspense>
        </ErrorBoundary>
      ))}
    </div>
  );

  // Render authentication section
  const renderAuthSection = () => (
    <div className="flex items-center gap-4">
      {currentUser ? (
        <>
          <span className="text-sm">Welcome, {currentUser}!</span>
          <button 
            onClick={handleSignOut}
            className="bg-white text-rose-900 px-3 py-1 rounded-md text-sm hover:bg-amber-50 transition-colors"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button 
          onClick={() => setShowSignUp(true)}
          className="bg-white text-rose-900 px-4 py-2 rounded-md text-sm hover:bg-amber-50 transition-colors"
          aria-label="Sign up"
        >
          Sign Up
        </button>
      )}
    </div>
  );

  // Render destination form
  const renderDestinationForm = () => (
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
  );

  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <header className="bg-rose-900 p-5 flex justify-between items-center text-white text-xl">
        <Link to="/" className="hover:text-amber-100 transition-colors">
          ✈️ My Travel Journal
        </Link>
        {renderAuthSection()}
      </header>
      
      <main className="flex-1 p-5 max-w-6xl mx-auto w-full">
        {showSignUp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md relative">
              <button 
                onClick={() => setShowSignUp(false)}
                className="absolute top-3 right-3 text-gray-500 text-2xl hover:text-gray-700"
                aria-label="Close sign up form"
              >
                ×
              </button>
              <Suspense fallback={<LoadingSpinner />}>
                <SignUpForm onSignUp={handleSignUp} />
              </Suspense>
            </div>
          </div>
        )}

        <Suspense fallback={<LoadingSpinner fullPage />}>
          <Routes>
            <Route path="/" element={
              <>
                <p className="italic text-gray-600 mb-5 text-sm leading-relaxed">
                  Disclaimer: All the towns mentioned in the journal are based on fictional towns from series and tv shows.
                  <br />Credits go to the respective creators of these shows for their imaginative worlds.
                </p>
                
                {currentUser && renderDestinationForm()}
                {renderEntries()}
              </>
            } />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="text-center p-4 text-rose-900">
        © 2025 Travel Journal
      </footer>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent data={data} />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;