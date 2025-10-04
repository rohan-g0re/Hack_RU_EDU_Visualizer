import React, { useState } from 'react';
import { Globe, Loader } from 'lucide-react';
import Button from '../../components/common/Button';

interface UrlInputProps {
  onUrlSubmit: (url: string) => Promise<void>;
  className?: string;
}

const UrlInput: React.FC<UrlInputProps> = ({ 
  onUrlSubmit,
  className = '' 
}) => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic URL validation
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    // Add http:// if missing
    let processedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      processedUrl = 'https://' + url;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await onUrlSubmit(processedUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process URL');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center rounded-md border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <div className="flex items-center pl-3 text-gray-400">
            <Globe size={18} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website or PDF URL"
            className="w-full py-2 px-3 border-0 focus:outline-none focus:ring-0 text-sm"
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-1">
            {error}
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          icon={isLoading ? undefined : <Globe size={16} />}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Process URL'}
        </Button>
      </form>
    </div>
  );
};

export default UrlInput; 