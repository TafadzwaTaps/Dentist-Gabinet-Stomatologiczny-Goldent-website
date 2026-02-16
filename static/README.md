# Gabinet Stomatologiczny Goldent - Website

Profesjonalna strona internetowa dla Gabinetu Stomatologicznego Goldent w Rzeszowie.

## 🦷 Features

- **Modern & Professional Design** - Czysty, medyczny design budujący zaufanie
- **Multi-language Support** - Polish & English (PL ↔ EN switcher)
- **Fully Responsive** - Doskonale wygląda na wszystkich urządzeniach
- **Online Booking System** - Rezerwacja wizyt 24/7 z kalendarzem
- **Admin Panel** - Zarządzanie rezerwacjami i wiadomościami
- **SEO Optimized** - Zoptymalizowane dla wyszukiwarek Google (dentysta Rzeszów, stomatolog Rzeszów)
- **Hreflang Tags** - SEO meta tags dla wersji językowych
- **Contact Form** - Integracja z Web3Forms + Firebase storage
- **Fast Loading** - Lekka strona, szybkie ładowanie
- **Smooth Animations** - Płynne animacje przy przewijaniu (AOS)
- **Click-to-Call** - Funkcjonalność "kliknij aby zadzwonić"
- **Gallery Lightbox** - Galeria zdjęć z efektem lightbox
- **Structured Data** - Schema.org markup dla Local Business
- **Firebase Backend** - Serverless database i authentication

## 📁 Struktura plików

```
static/
├── index.html          # Główna strona HTML (multi-language)
├── admin.html          # Panel administracyjny
├── css/
│   └── styles.css     # Własne style CSS
├── js/
│   ├── translations.js # Tłumaczenia PL/EN
│   ├── firebase-config.js # Konfiguracja Firebase
│   ├── app.js         # Language switcher & booking system
│   ├── admin.js       # Admin panel logic
│   └── script.js      # JavaScript (formularz, animacje)
├── images/            # Folder na dodatkowe zdjęcia
├── README.md          # Ta instrukcja
└── FIREBASE_SETUP.md  # Szczegółowa instrukcja Firebase
```

## 🚀 Wdrożenie na GitHub Pages

### Krok 1: Utwórz repozytorium GitHub

1. Zaloguj się na [GitHub.com](https://github.com)
2. Kliknij "New repository"
3. Nazwij repozytorium: `goldent-dental` (lub dowolna nazwa)
4. Ustaw jako **Public**
5. Kliknij "Create repository"

### Krok 2: Upload plików

**Opcja A: Przez przeglądarkę (łatwiejsze)**

1. W swoim repozytorium kliknij "Add file" → "Upload files"
2. Przeciągnij wszystkie pliki ze folderu `static/`:
   - `index.html`
   - folder `css/` z plikiem `styles.css`
   - folder `js/` z plikiem `script.js`
3. Kliknij "Commit changes"

**Opcja B: Przez Git (dla zaawansowanych)**

```bash
# Sklonuj repozytorium
git clone https://github.com/twoj-username/goldent-dental.git
cd goldent-dental

# Skopiuj pliki ze static/ do repozytorium
cp -r /path/to/static/* .

# Commit i push
git add .
git commit -m "Initial commit - Goldent website"
git push origin main
```

### Krok 3: Włącz GitHub Pages

1. W repozytorium przejdź do **Settings**
2. W menu bocznym kliknij **Pages**
3. W sekcji "Source":
   - Branch: wybierz `main`
   - Folder: wybierz `/ (root)`
4. Kliknij **Save**

### Krok 4: Gotowe! 🎉

Twoja strona będzie dostępna pod adresem:
```
https://twoj-username.github.io/goldent-dental/
```

*(Może potrwać 1-2 minuty zanim strona się pojawi)*

## 🔧 Konfiguracja

### Własna domena (opcjonalnie)

1. W ustawieniach GitHub Pages wprowadź swoją domenę w polu "Custom domain"
2. W ustawieniach DNS swojej domeny dodaj CNAME record:
   ```
   www.twoja-domena.pl  →  twoj-username.github.io
   ```

### Aktualizacja treści

Aby zmienić treść strony:

1. Edytuj plik `index.html` lokalnie lub bezpośrednio na GitHub
2. Commit i push zmian
3. GitHub Pages automatycznie zaktualizuje stronę

## 📧 Formularz kontaktowy (Web3Forms)

Formularz już działa! Wiadomości będą wysyłane na email powiązany z kluczem API Web3Forms.

### Jak zmienić email odbiorcy:

1. Odwiedź [Web3Forms.com](https://web3forms.com)
2. Wprowadź swój email (np. kontakt@goldent.pl)
3. Otrzymasz nowy Access Key
4. W pliku `index.html` znajdź linię:
   ```html
   <input type="hidden" name="access_key" value="5163e4c9-4cd4-47ba-9720-ea722ebcab40">
   ```
5. Zamień wartość `value` na swój nowy Access Key

## 🎨 Personalizacja

### Zmiana kolorów

Edytuj plik `css/styles.css`, sekcja "CSS VARIABLES":

```css
:root {
  --accent-gold: #D4AF37;          /* Złoty kolor akcentu */
  --text-primary: #232323;         /* Kolor głównego tekstu */
  --bg-page: #FFF9F2;             /* Kolor tła strony */
}
```

### Dodanie własnych zdjęć

1. Wrzuć zdjęcia do folderu `images/`
2. W pliku `index.html` zamień linki do obrazków:
   ```html
   <!-- Zamiast -->
   <img src="https://images.unsplash.com/photo-xxx" alt="...">
   
   <!-- Użyj -->
   <img src="images/twoje-zdjecie.jpg" alt="...">
   ```

### Zmiana treści

Wszystkie teksty znajdują się w pliku `index.html`. Możesz je łatwo edytować:

- Nagłówki (h1, h2, h3)
- Paragrafy (p)
- Przyciski (button, a class="btn-primary")
- Opinie pacjentów
- Dane kontaktowe

## 📱 Sekcje strony

1. **Hero** - Główna sekcja z nagłówkiem i CTA
2. **Dlaczego Goldent** - 6 kart z zaletami
3. **Usługi** - 6 kart z usługami stomatologicznymi
4. **Opinie** - Opinie pacjentów (5.0 ⭐)
5. **O nas** - Informacje o gabinecie
6. **Galeria** - 6 zdjęć gabinetu
7. **Kontakt** - Dane kontaktowe + formularz

## 🔍 SEO - Local Business

Strona zawiera strukturalne dane Schema.org dla Local Business:

```json
{
  "@type": "Dentist",
  "name": "Gabinet Stomatologiczny Goldent",
  "address": "Wołyńska 5/2, 35-505 Rzeszów",
  "telephone": "+48883977202",
  "aggregateRating": {
    "ratingValue": "5.0",
    "reviewCount": "5"
  }
}
```

### Meta tagi SEO:

- Title: "Gabinet Stomatologiczny Goldent - Dentysta Rzeszów | Wołyńska 5/2"
- Description: Zoptymalizowany opis z głównymi słowami kluczowymi
- Keywords: dentysta Rzeszów, stomatolog Rzeszów, higienizacja zębów Rzeszów

## 📊 Wydajność

- **Lightweight** - Minimalne zależności zewnętrzne
- **Bootstrap 5.3.2** - Framework CSS
- **Font Awesome 6.5.1** - Ikony
- **AOS Library** - Animacje przy przewijaniu
- **Web3Forms API** - Obsługa formularza

## 🆘 Wsparcie

W razie problemów:

1. Sprawdź czy wszystkie pliki są poprawnie przesłane
2. Upewnij się że GitHub Pages jest włączony w ustawieniach
3. Poczekaj 1-2 minuty na aktualizację strony
4. Sprawdź Console w przeglądarce (F12) pod kątem błędów

## 📞 Kontakt

**Gabinet Stomatologiczny Goldent**
- 📍 Wołyńska 5/2, 35-505 Rzeszów
- 📞 +48 883 977 202
- ⭐ Ocena: 5.0 (5 opinii)

---

Stworzone z ❤️ dla Gabinet Goldent
