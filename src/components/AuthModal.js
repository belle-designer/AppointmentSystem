import { X } from "lucide-react";

export default function AuthModal({ children, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md
                     bg-white rounded-lg shadow-xl
                     animate-[scaleIn_0.2s_ease-out]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </>
  );
}
