import { useState } from 'react';

export default function JournalEntry(props) {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    
    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setIsLiked(!isLiked);
    };
    
    return (
        <article className="flex mb-8 bg-white rounded-lg overflow-hidden shadow-md">
            <img 
                src={props.img} 
                alt={props.alt} 
                className="w-64 h-48 object-cover" 
            />
            <div className="p-5 flex-1">
                <h2 className="text-xl font-semibold text-rose-900 mb-1">{props.location}</h2>
                <h3 className="text-gray-600 text-sm mb-4">{props.duration}</h3>
                <p className="mb-4">{props.description}</p>
                {props.author && (
                    <p className="italic text-gray-600 text-xs mt-3">
                        Posted by: {props.author}
                    </p>
                )}
                <button 
                    onClick={handleLike}
                    className={`flex items-center gap-1 mt-4 ${isLiked ? 'text-red-500' : 'text-rose-900'}`}
                >
                    ❤️ {likes} {likes === 1 ? 'like' : 'likes'}
                </button>
            </div>
        </article>
    );
}