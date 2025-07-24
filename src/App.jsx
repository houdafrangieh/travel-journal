import { useState } from 'react';
import JournalEntry from "./Components/JournalEntry.jsx";
import data from "./Data/entries.js";
import SignUpForm from "./Components/SignUpForm.jsx";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDestination(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: entries.length + 1,
      img: { src: "src/Assets/Images/default.jpg", alt: "Default destination" },
      location: newDestination.location,
      duration: newDestination.duration,
      description: newDestination.description,
      author: currentUser || 'Anonymous'
    };
    setEntries([...entries, newEntry]);
    setNewDestination({ location: '', duration: '', description: '' });
    setShowForm(false);
  };

  const handleSignUp = (username) => {
    setCurrentUser(username);
    setShowSignUp(false);
  };

  const entryElements = entries.map((entry) => {
    return (
      <JournalEntry 
        key={entry.id}
        img={entry.img.src}
        alt={entry.img.alt}
        location={entry.location}
        duration={entry.duration}
        description={entry.description}
        author={entry.author}
      />
    );
  });
  
  return (
    <div className="container">
      <header className="header">
        ✈️ My Travel Journal
        {currentUser ? (
          <span className="welcome-message">Welcome, {currentUser}!</span>
        ) : (
          <button 
            onClick={() => setShowSignUp(true)}
            className="signup-button"
          >
            Sign Up
          </button>
        )}
      </header>
      
      <main className="main">
        {showSignUp && (
          <div className="modal">
            <div className="modal-content">
              <button 
                onClick={() => setShowSignUp(false)}
                className="close-button"
              >
                ×
              </button>
              <SignUpForm onSignUp={handleSignUp} />
            </div>
          </div>
        )}

        <p className="disclaimer">
          Disclaimer: All the towns mentioned in the journal are based on fictional towns from series and tv shows.
          <br />Credits go to the respective creators of these shows for their imaginative worlds.
        </p>
        
        {currentUser && (
          <>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="suggestion-button"
            >
              {showForm ? 'Cancel Suggestion' : 'Suggest Next Destination'}
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="destination-form">
                <input
                  type="text"
                  name="location"
                  value={newDestination.location}
                  onChange={handleInputChange}
                  placeholder="Location (e.g., 📌Gotham City)"
                  required
                />
                <input
                  type="text"
                  name="duration"
                  value={newDestination.duration}
                  onChange={handleInputChange}
                  placeholder="Duration (e.g., May 1, 2023 - June 30, 2023)"
                  required
                />
                <textarea
                  name="description"
                  value={newDestination.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about this destination..."
                  required
                />
                <button type="submit">Submit Suggestion</button>
              </form>
            )}
          </>
        )}

        {entryElements}
      </main>
      <footer className="footer">© 2025 Travel Journal</footer>
    </div>
  );
}

export default App;