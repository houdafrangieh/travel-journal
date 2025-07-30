// src/Components/LoadingSpinner.jsx
export default function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={`flex justify-center items-center ${fullPage ? 'h-screen' : 'h-40'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-900"></div>
    </div>
  );
}