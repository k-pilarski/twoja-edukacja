# 1. Tytuł projektu
# TwojaEdukacja
System sprzedaży kursów online

# 2. Opis projektu
Aplikacja to kompletna platforma e-learningowa umożliwiająca zarządzanie materiałami edukacyjnymi, sprzedaż szkoleń oraz uczestnictwo w kursach online. Użytkownicy mogą przeglądać rozbudowany katalog, kupować dostęp do modułów i uczyć się poprzez zintegrowany odtwarzacz multimedialny. 
System posiada dedykowane panele oparte na rolach (Student, Instruktor, Admin), co automatyzuje zarządzanie platformą, procesem twórczym i uprawnieniami użytkowników.

# 3. Sprint plan
| Sprint | Cel (Kamień milowy) | Data | Status |
| :--- | :--- | :--- | :--- |
| Sprint 1 | Konfiguracja środowiska (Node.js, Prisma, Supabase) | 17.03.2026 | ✅ Ukończone |
| Sprint 2 | Projekt UI/UX aplikacji, system Autentykacji JWT i Ról | 24.03.2026 | ✅ Ukończone |
| Sprint 3 | Implementacja modułu CRUD dla kursów i panelu instruktora | 31.03.2026 | ✅ Ukończone |
| Sprint 4 | Obsługa multimediów i zaawansowany odtwarzacz lekcji | 07.04.2026 | ✅ Ukończone |
| Sprint 5 | Katalog kursów z zaawansowanym systemem filtrowania i wyszukiwania | 14.04.2026 | ✅ Ukończone |
| Sprint 6 | System śledzenia postępów ucznia i interfejs aktywnej lekcji | 21.04.2026 | ✅ Ukończone |
| Sprint 7 | Integracja płatności (Stripe API) i proces checkoutu | 28.04.2026 | ✅ Ukończone |
| Sprint 8 | Optymalizacja bazy danych (Indeksowanie, Paginacja) | 05.05.2026 | ✅ Ukończone |
| Sprint 9 | Optymalizacja wydajności frontendu (SEO, Lazy Loading, Lighthouse) | 08.05.2026 | ✅ Ukończone |
| Sprint 10 | Końcowe poprawki bezpieczeństwa i wdrożenie aplikacji (Deployment) | 11.05.2026 | ✅ Ukończone |

# 4. Autorzy
- Karol Pilarski - backend, baza danych, integracje API
- Adam Ptasznik - frontend, interfejs użytkownika, optymalizacja UX/UI

# 5. Technologie
### Frontend:
- React (Vite)
- React Router DOM (zabezpieczone trasy)
- Tailwind CSS
- TypeScript

### Backend:
- Node.js & Express
- TypeScript
- JWT (JSON Web Tokens)
- Stripe API (obsługa płatności)

### Baza danych:
- PostgreSQL (hostowane na Supabase)
- Prisma ORM

# 6. Funkcjonalności
- **Autentykacja i Autoryzacja:** Rejestracja, logowanie (JWT) oraz zaawansowany system ról (Student / Instruktor / Admin).
- **Zabezpieczenie dostępu:** Ochrona widoków frontendu i endpointów backendu przed nieautoryzowanym dostępem.
- **Katalog Kursów:** Wyszukiwarka z systemem filtrów (kategoria, cena, słowa kluczowe) i stronicowaniem (paginacja).
- **Moduł Zakupowy (Checkout):** Integracja z bramką płatności Stripe, dynamiczne przeliczanie cen, weryfikacja posiadania kursu.
- **Panel Instruktora:** Tworzenie kursów, dodawanie lekcji multimedialnych (wideo, tekst, obrazy), zarządzanie widocznością kursu.
- **Platforma E-learningowa:** Odtwarzacz lekcji zabezpieczony przed osobami bez wykupionego dostępu, dynamiczne ładowanie treści.
- **Wysoka Wydajność:** Wdrożony Code Splitting (Lazy Loading), optymalizacja SEO, zoptymalizowane zapytania do bazy z indeksowaniem.

# 7. Architektura projektu
Aplikacja jest zbudowana w architekturze klient-serwer.
Frontend komunikuje się z backendem za pomocą bezpiecznego REST API (autoryzacja nagłówkami Bearer).
Backend obsługuje logikę biznesową, integracje z zewnętrznymi usługami (Stripe) oraz komunikację z bazą danych PostgreSQL za pomocą Prisma ORM.

# 8. Instalacja
1. Sklonuj repozytorium
   ```bash
   git clone [https://github.com/k-pilarski/twoja-edukacja.git](https://github.com/k-pilarski/twoja-edukacja.git)
   ```
2. Przejdź do katalogu projektu
   ```bash
   cd twoja-edukacja
   ```
3. Skonfiguruj zmienne środowiskowe
   Utwórz plik `.env` w folderze `server/` na wzór `.env.example` (wymagane klucze Supabase, Prisma, JWT Secret, Stripe Secret).

# 9. Uruchomienie aplikacji w środowisku deweloperskim
### Backend
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

# 10. Instrukcja użytkownika
1. Otwórz przeglądarkę i przejdź pod adres lokalny (domyślnie `http://localhost:5173`).
2. Przeglądaj katalog kursów jako gość.
3. Utwórz konto przez formularz rejestracyjny, aby móc dokonywać zakupów.
4. Zaloguj się na swoje konto.
5. Przejdź proces płatności (Checkout), aby odblokować kurs.
6. Rozpocznij naukę w odtwarzaczu multimedialnym.
7. *(Opcjonalnie)* Zaloguj się na konto z uprawnieniami Instruktora, aby przejść do dedykowanego panelu tworzenia kursów.

# 11. Struktura repozytorium
- `client/` - interfejs użytkownika (React, Tailwind, Vite)
- `server/` - logika aplikacji (Express), integracje i kontrolery
- `server/prisma/` - schematy bazy danych i konfiguracja ORM
- `README.md` - dokumentacja główna projektu

# 12. Główne Endpointy API
- `POST /api/auth/register` - Rejestracja użytkownika
- `POST /api/auth/login` - Logowanie i wydawanie tokenów JWT
- `GET /api/courses` - Pobieranie katalogu kursów (z paginacją)
- `GET /api/courses/:id` - Szczegóły kursu (wraz z weryfikacją zakupu)
- `POST /api/payments/create-checkout-session` - Generowanie sesji płatniczej Stripe
- `POST /api/payments/academic-success` - Endpoint weryfikacji zakupów (Academic Bypass)

# 13. Status projektu
**Release Candidate / Gotowy do wdrożenia.** Zakończono etap rozwoju lokalnego, wdrożono wszystkie funkcjonalności, zoptymalizowano bazę danych oraz frontend pod kątem metryk Lighthouse. Projekt zrealizowany w ramach kursu Projekt zespołowy systemu informatycznego.

# 14. Licencja
Projekt edukacyjny.