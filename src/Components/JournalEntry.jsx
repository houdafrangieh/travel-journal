import { useState } from 'react';

export default function JournalEntry(props) {
    const [likes, setLikes] = useState(0);
    
    return (
        <article className="journal-entry">
            <img src={props.img} alt={props.alt} className="journal-image" />
            <div className="entry-content">
                <h2 className="location">{props.location}</h2>
                <h3 className="duration">{props.duration}</h3>
                <p>{props.description}</p>
                {props.author && <p className="author">Posted by: {props.author}</p>}
                <button 
                    onClick={() => setLikes(likes + 1)}
                    className="like-button"
                >
                    ❤️ {likes} {likes === 1 ? 'like' : 'likes'}
                </button>
            </div>
        </article>
    );
}