  Web Shop Aplikacija – Upute

Ova aplikacija predstavlja jednostavan webshop sistem razvijen korištenjem React-a za frontend i FastAPI-ja za backend. Cilj aplikacije je omogućiti korisnicima pregled i naručivanje proizvoda, dok administratori imaju dodatne ovlasti nad upravljanjem narudžbama i korisnicima.

---

  Kako pokrenuti aplikaciju

  Backend (FastAPI)

1. Ući u `backend` direktorij:

   ```
   cd backend
   ```

2. Instalirati potrebne pakete:

   ```
   pip install -r requirements.txt
   ```

3. Pokrenuti backend server:

   ```
   uvicorn main:app --reload
   ```

Backend će biti dostupan na adresi:
[http://localhost:8000](http://localhost:8000)
Swagger dokumentacija dostupna je na:
[http://localhost:8000/docs](http://localhost:8000/docs)

  Frontend (React)

1. Ući u `frontend` direktorij:

   ```
   cd frontend
   ```

2. Instalirati potrebne pakete:

   ```
   npm install
   ```

3. Pokrenuti razvojni server:

   ```
   npm start
   ```

Frontend će biti dostupan na adresi:
[http://localhost:3000](http://localhost:3000)

---

  Funkcionalnosti aplikacije

Aplikacija omogućava sljedeće funkcionalnosti:

* Prikaz liste proizvoda na početnoj stranici
* Detaljan prikaz pojedinačnog proizvoda
* Dodavanje proizvoda u korpu
* Prikaz korpe i unos podataka za narudžbu
* Slanje narudžbe backendu
* Prijava i registracija korisnika
* Autentikacija putem JWT tokena
* Admin uvid u sve narudžbe (putem API-ja)
* Slanje email notifikacije nakon kreiranja narudžbe

---

  Vrste korisnika

Aplikacija podržava tri osnovna tipa korisnika:

 Gost (neprijavljeni korisnik)

* Može pregledavati proizvode
* Ima mogućnost narudžbe

  Administrator

* Ima pristup svim narudžbama putem API-a
* Može upravljati narudžbama i produktima(i dodavati nove) 
* Ima dodatne ovlasti koje nisu dostupne običnim korisnicima
