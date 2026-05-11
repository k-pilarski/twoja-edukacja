import { useState, useEffect } from 'react';

interface SecureImageProps {
  contentPath: string;
}

export const SecureImage = ({ contentPath }: SecureImageProps) => {
  const [secureUrl, setSecureUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSecureUrl = async () => {
      if (!contentPath) return;
      
      setIsLoading(true);
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch('http://localhost:5000/api/uploads/secure-url', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ path: contentPath })
        });

        if (!response.ok) throw new Error('Błąd pobierania obrazu');
        
        const data = await response.json();
        setSecureUrl(data.secureUrl);
      } catch (err) {
        console.error(err);
        setError('Nie udało się załadować obrazu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecureUrl();
  }, [contentPath]);

  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">{error}</div>;
  if (isLoading) return <div className="w-full aspect-video flex items-center justify-center bg-gray-100 rounded-lg animate-pulse text-gray-500">Ładowanie obrazu...</div>;

  if (secureUrl) {
    return (
      <div className="flex justify-center w-full">
        <img 
          src={secureUrl} 
          alt="Treść lekcji" 
          className="max-w-full rounded-lg shadow-md border border-gray-200"
        />
      </div>
    );
  }

  return null;
};
