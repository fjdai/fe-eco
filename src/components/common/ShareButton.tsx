import React, { useState } from 'react';


interface ShareButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'floating' | 'inline';
  showLabel?: boolean;
  platforms?: string[];
}

const ShareButton: React.FC<ShareButtonProps> = ({
  className = '',
  size = 'md',
  variant = 'button',
  showLabel = true,
  platforms = ['facebook', 'twitter', 'whatsapp', 'copy']
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-600 hover:bg-blue-700';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-sm px-2 py-1';
      case 'lg': return 'text-lg px-6 py-3';
      default: return 'text-base px-4 py-2';
    }
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed right-4 bottom-4 z-50 ${className}`}>
        <div className={`relative ${isOpen ? 'mb-2' : ''}`}>
          {isOpen && (
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border p-2 min-w-48">
              <div className="flex flex-col gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors ${getPlatformColor(platform)}`}
                  >
                    <span className="capitalize">
                      {platform === 'copy' ? 'Copy Link' : platform}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors ${getSizeClasses()}`}
          >
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {platforms.map((platform) => (
          <button
            key={platform}
            className={`flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors ${getPlatformColor(platform)}`}
            title={`Share on ${platform}`}
          >
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors ${getSizeClasses()}`}
      >
        {showLabel && <span>Share</span>}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border p-2 min-w-48 z-50">
            <div className="flex flex-col gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors ${getPlatformColor(platform)}`}
                >
                  <span className="capitalize">
                    {platform === 'copy' ? 'Copy Link' : platform}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
