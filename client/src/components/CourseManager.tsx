import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { RichTextEditor } from './RichTextEditor';

export const CourseManager: React.FC = () => {
  const { id } = useParams();
  const [courseId, setCourseId] = useState<number | null>(id ? Number(id) : null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  
  const [lessonTitle, setLessonTitle] = useState('');
  const [contentType, setContentType] = useState('VIDEO');
  const [videoUrl, setVideoUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const token = localStorage.getItem('jwt_token');

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title, description, price: Number(price), categoryId: Number(categoryId), requirements: []
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCourseId(data.id);
        alert('Kurs zapisany! Teraz możesz dodawać lekcje.');
      } else {
        alert('Błąd podczas zapisywania kursu.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    let finalContentPath = textContent;
    
    if (contentType === 'IMAGE' && imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      try {
        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          alert(`Błąd serwera podczas wgrywania zdjęcia: ${uploadData.error || 'Nieznany błąd'}\nSzczegóły: ${uploadData.details || ''}`);
          return;
        }

        finalContentPath = uploadData.path;
      } catch (uploadErr) {
        console.error("Błąd sieci przy wgrywaniu:", uploadErr);
        alert("Krytyczny błąd połączenia przy wgrywaniu pliku!");
        return;
      }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: lessonTitle,
          contentType,
          contentPath: finalContentPath,
          videoUrl: contentType === 'VIDEO' ? videoUrl : null,
          durationMin: 10,
          order: 1
        })
      });

      if (response.ok) {
        alert('Lekcja dodana pomyślnie!');
        setLessonTitle(''); setTextContent(''); setVideoUrl(''); setImageFile(null);
      } else {
        alert('Błąd podczas dodawania lekcji do bazy.');
      }
    } catch (err) {
      console.error('Błąd dodawania lekcji', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{courseId ? 'Edycja kursu' : 'Kreator nowego kursu'}</h1>

      <form onSubmit={handleCreateCourse} className="bg-white p-6 rounded-lg shadow-md mb-8 border">
        <h2 className="text-xl font-semibold mb-4">1. Podstawowe informacje</h2>
        <div className="grid grid-cols-1 gap-4">
          <input className="border p-2 rounded" placeholder="Tytuł kursu" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea className="border p-2 rounded" placeholder="Opis" value={description} onChange={e => setDescription(e.target.value)} required />
          <div className="flex gap-4">
            <input className="border p-2 rounded w-1/2" type="number" placeholder="Cena (PLN)" value={price} onChange={e => setPrice(e.target.value)} required />
            <input className="border p-2 rounded w-1/2" type="number" placeholder="ID Kategorii (np. 1)" value={categoryId} onChange={e => setCategoryId(e.target.value)} required />
          </div>
          {!courseId && (
            <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Zapisz kurs i przejdź do lekcji</button>
          )}
        </div>
      </form>

      {courseId && (
        <form onSubmit={handleAddLesson} className="bg-gray-50 p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">2. Dodaj nową lekcję</h2>
          <div className="grid grid-cols-1 gap-4">
            <input className="border p-2 rounded" placeholder="Tytuł lekcji" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} required />
            
            <select className="border p-2 rounded" value={contentType} onChange={e => setContentType(e.target.value)}>
              <option value="VIDEO">Wideo (YouTube/Link)</option>
              <option value="TEXT">Artykuł / Tekst</option>
              <option value="IMAGE">Obrazek</option>
            </select>

            {contentType === 'VIDEO' && (
              <input className="border p-2 rounded" placeholder="Link do wideo (np. YouTube)" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required />
            )}
            
            {contentType === 'TEXT' && (
              <div className="pb-10">
                <label className="block text-sm font-medium text-gray-700 mb-2">Treść lekcji</label>
                <RichTextEditor value={textContent} onChange={setTextContent} />
              </div>
            )}

            {contentType === 'IMAGE' && (
              <input type="file" className="border p-2 rounded bg-white" onChange={e => setImageFile(e.target.files?.[0] || null)} required />
            )}

            <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Dodaj lekcję do kursu</button>
          </div>
        </form>
      )}
    </div>
  );
};