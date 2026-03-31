# 1. Tytuł projektu
# TwojaEdukacja
System sprzedaży kursów online

# 2. Opis projektu
Aplikacja umożliwia zarządzanie materiałami edukacyjnymi oraz uczestnictwo w kursach online. Użytkownicy mogą przeglądać dostępne moduły i korzystać z platformy e-learningowej.
System posiada dedykowane panele oparte na rolach (Student, Instruktor, Admin), co ułatwia zarządzanie platformą i użytkownikami.

# 3. Sprint plan
| Sprint | Cel (Kamień milowy) | Data |
| :--- | :--- | :--- |
| Sprint 1 | Konfiguracja środowiska (Node.js, Prisma, Supabase) | 17.03.2026 |
| Sprint 2 | Projekt UI/UX aplikacji, system Autentykacji JWT i Ról | 24.03.2026 |
| Sprint 3 | Implementacja modułu CRUD dla kursów i panelu instruktora | 31.03.2026 |
| Sprint 4 | Obsługa multimediów (wideo/Cloudinary/S3) i zaawansowany odtwarzacz lekcji | TBD |
| Sprint 5 | Katalog kursów z zaawansowanym systemem filtrowania i wyszukiwania | TBD |
| Sprint 6 | System śledzenia postępów ucznia i interfejs aktywnej lekcji | TBD |
| Sprint 7 | Integracja płatności (Stripe API), proces checkoutu i historia zakupów | TBD |
| Sprint 8 | System recenzji, ocen kursów oraz powiadomienia dla użytkowników | TBD |
| Sprint 9 | Generator certyfikatów PDF i zaawansowane zarządzanie profilem ucznia | TBD |
| Sprint 10 | Optymalizacja wydajności (SEO/baza danych) i wdrożenie aplikacji (Deployment) | TBD |

# 4. Autorzy
- Karol Pilarski - backend i baza danych
- Adam Ptasznik - frontend i interfejs użytkownika

# 5. Technologie
### Frontend:
- React
- HTML
- CSS (Tailwind CSS)

### Backend:
- Node.js
- Express
- TypeScript

### Baza danych:
- PostgreSQL (Supabase)
- Prisma ORM

# 6. Funkcjonalności
- rejestracja użytkownika
- logowanie
- zarządzanie profilem
- system ról (Student / Instruktor / Admin)
- panel instruktora i tworzenie kursów (w trakcie)
- rejestracja
- logowanie
- zabezpieczenie ścieżek dostępu

# 7. Architektura projektu
Aplikacja jest zbudowana w architekturze klient-serwer.
Frontend komunikuje się z backendem za pomocą REST API.
Backend obsługuje logikę biznesową oraz komunikację z bazą danych PostgreSQL za pomocą Prisma ORM.

# 8. Instalacja
1. Sklonuj repozytorium
   ```bash
   git clone [https://github.com/k-pilarski/twoja-edukacja.git](https://github.com/k-pilarski/twoja-edukacja.git)
   ```
2. Przejdź do katalogu projektu
   ```bash
   cd twoja-edukacja
   ```

# 9. Uruchomienie aplikacji
### Backend
```bash
cd server
npm install
npx prisma generate
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

# 10. Instrukcja użytkownika
1. Otwórz przeglądarkę
2. Przejdź na adres: `http://localhost:5173`
3. Utwórz konto przez formularz rejestracyjny
4. Zaloguj się
5. Wybierz kurs lub przejdź do panelu instruktora w zależności od posiadanej roli

# 11. Struktura repozytorium
- `client/` - interfejs użytkownika (React)
- `server/` - logika aplikacji, kontrolery i modele Prisma
- `README.md` - dokumentacja projektu

# 12. API
- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/login` - Logowanie i pobieranie tokena JWT
- `GET /api/auth/me` - Pobieranie danych zalogowanego użytkownika
- `GET /api/auth/instructor-panel` - Testowa ścieżka dla instruktorów

# 13. Status projektu
Projekt w trakcie rozwoju. Ukończono autentykację, w trakcie wdrożenia obsługi kursów. Projekt realizowany w ramach kursu Projekt Zespołowy Systemów Informatycznych 2026.

# 14. Licencja
Projekt edukacyjny.