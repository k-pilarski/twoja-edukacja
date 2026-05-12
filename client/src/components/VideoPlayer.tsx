import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  contentPath?: string | null;
  videoUrl?: string | null;
}

export const VideoPlayer = ({ contentPath, videoUrl }: VideoPlayerProps) => {
  const [secureUrl, setSecureUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSecureUrl = async () => {
      if (!contentPath) return;
      
      setIsLoading(true);
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/secure-url`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ path: contentPath })
        });

        if (!response.ok) throw new Error('Błąd uwierzytelniania wideo');
        
        const data = await response.json();
        setSecureUrl(data.secureUrl);
      } catch (err) {
        console.error(err);
        setError('Nie udało się załadować wideo. Sprawdź swoje uprawnienia.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecureUrl();
  }, [contentPath]);

  if (videoUrl) {
    const getYouTubeId = (url: string) => {
       const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
       const match = url.match(regExp);
       return (match && match[2].length === 11) ? match[2] : null;
    };
    
    const ytId = getYouTubeId(videoUrl);
    if (ytId) {
      return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-black">
          <iframe 
            className="absolute top-0 left-0 w-full h-full" 
            src={`https://www.youtube.com/embed/${ytId}`} 
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <video 
        className="w-full aspect-video rounded-lg shadow-lg border border-gray-200 bg-black" 
        controls 
        src={videoUrl}
      >
        Twoja przeglądarka nie obsługuje odtwarzacza wideo.
      </video>
    );
  }

  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">{error}</div>;
  if (isLoading) return <div className="w-full aspect-video flex items-center justify-center bg-gray-100 rounded-lg animate-pulse text-gray-500">Ładowanie bezpiecznego odtwarzacza...</div>;

  if (secureUrl) {
    return (
      <video 
        className="w-full aspect-video rounded-lg shadow-lg border border-gray-200 bg-black" 
        controls 
        controlsList="nodownload"
      >
        <source src={secureUrl} type="video/mp4" />
        Twoja przeglądarka nie obsługuje odtwarzacza wideo.
      </video>
    );
  }

  return <div className="p-4 bg-gray-100 text-gray-500 rounded-md text-center">Brak wideo do wyświetlenia</div>;
};