import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Course } from '../types';
import { useAuth } from '../context/AuthContext';

export const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error(err));
  }, [courseId]);

  const handlePayment = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const response = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: course?.id })
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Wystąpił błąd podczas inicjowania płatności.');
      }
    } catch (error) {
      console.error('Błąd płatności:', error);
      alert('Nie udało się połączyć z bramką płatności.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (!course) return <div className="p-8 text-center">Ładowanie podsumowania...</div>;

  // POPRAWKA: Rzutujemy wartość na Number, aby zapobiec błędom z .toFixed()
  const priceGross = Number(course.price);
  const priceNet = (priceGross / 1.23).toFixed(2);
  const vatAmount = (priceGross - Number(priceNet)).toFixed(2);

  return (
    <div className="max-w-5xl px-4 py-12 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Podsumowanie zamówienia</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="p-6 bg-white border border-gray-200 shadow-sm lg:col-span-2 rounded-xl">
          <h2 className="pb-4 mb-4 text-xl font-bold border-b">Wybrany kurs</h2>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center flex-shrink-0 w-32 h-24 bg-gray-200 rounded-lg">
              <span className="text-sm text-gray-400">Miniaturka</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
              <p className="mt-1 text-sm text-gray-500">Instruktor: {course.instructor?.user.firstName} {course.instructor?.user.lastName}</p>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{course.description}</p>
            </div>
          </div>
        </div>

        <div className="h-fit p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h2 className="pb-4 mb-4 text-xl font-bold border-b">Do zapłaty</h2>
          
          <div className="mb-6 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Kwota netto:</span>
              <span>{priceNet} PLN</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>VAT (23%):</span>
              <span>{vatAmount} PLN</span>
            </div>
            <div className="flex justify-between pt-3 text-lg font-bold text-gray-900 border-t">
              <span>Suma (brutto):</span>
              <span>{priceGross.toFixed(2)} PLN</span>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            disabled={isProcessingPayment}
            className="flex items-center justify-center w-full gap-2 px-6 py-3 font-bold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70"
          >
            {isProcessingPayment ? 'Przekierowywanie...' : 'Zapłać bezpiecznie ze Stripe'}
          </button>
          <p className="mt-4 text-xs text-center text-gray-400">
            Klikając przycisk, zostaniesz przeniesiony do bezpiecznej bramki płatności Stripe.
          </p>
        </div>
      </div>
    </div>
  );
};