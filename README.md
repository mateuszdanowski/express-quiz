# express-quiz

# Uruchamianie
1. npm install
2. npm run build
3. npm run createdb
4. npm run start (port 8081) / npm run start:dev ( port 3000)


# Testy
Po uruchomieniu za pomocą start:dev:
``npm run test``

# Użytkownicy
user1/user1
user2/user2

# Dodawanie własnego quizu
Aby przejść do strony, gdzie można dodawać quiz, należy się zalogować, a następnie wybrać przycisk 'Dodaj własny quiz'.
W polu 'nazwa' należy wpisać nazwę nowego quizu.
W polu 'pytania' należy wkleić listę pytań zgodną z formatem:
```json
[
  {
    "statement": "Pytanie1",
    "answer": "Odpowiedź1",
    "penalty": 123
  },
  {
    "statement": "Pytanie2",
    "answer": "Odpowiedź2",
    "penalty": 123
  },
  ...
]
```
