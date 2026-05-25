import React from 'react';
import { X } from 'lucide-react';

type Props = Readonly<{
  open: boolean;
  src?: string;
  alt?: string;
  onClose: () => void;
}>;

export default function ImagePreviewModal({ open, src, alt, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative max-w-4xl w-full mx-4">
        <button onClick={onClose} className="absolute right-3 top-3 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full bg-white shadow">
          <X size={16} />
        </button>

        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          {src ? (
            <img src={src} alt={alt} className="w-full h-[70vh] object-contain bg-black" />
          ) : (
            <div className="h-96 flex items-center justify-center">No image</div>
          )}
        </div>
      </div>
    </div>
  );
}
