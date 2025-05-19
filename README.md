# 📱 Εφαρμογή Κράτησης Θέσεων σε Εστιατόριο

Αυτή η εφαρμογή επιτρέπει σε χρήστες να κάνουν κρατήσεις σε εστιατόρια μέσω κινητής συσκευής. Υλοποιήθηκε με React Native για το frontend, Node.js/Express για το backend και MariaDB για τη βάση δεδομένων.

---

## 🔧 Τεχνολογίες

- **Frontend**: React Native
- **Backend**: Node.js + Express
- **Database**: MariaDB (μέσω XAMPP/phpMyAdmin)
- **Άλλα εργαλεία**: Postman, GitHub, VS Code

---

## ⚙️ Λειτουργίες

- Εγγραφή και σύνδεση χρήστη (με JWT)
- Αναζήτηση & προβολή εστιατορίων
- Δημιουργία κρατήσεων
- Ιστορικό & διαχείριση κρατήσεων (επεξεργασία/ακύρωση)
- Προφίλ χρήστη & αποσύνδεση

---

## 🚀 Οδηγίες Εκτέλεσης

### 1. Backend (Express Server)

```bash
cd Backend
npm install
node server.js


```bash
cd Frontend
npm install
npx expo start

---


```markdown
---


| Εγγραφή Χρήστη | Προβολή Εστιατορίων | Δημιουργία Κράτησης |
|----------------|----------------------|----------------------|
| ![signup](screenshots/signup.png) | ![restaurants](screenshots/restaurants.png) | ![reservation](screenshots/reserve.png) |

> Τα screenshots πρέπει να βρίσκονται σε φάκελο `screenshots/` μέσα στο project.
---

Η βάση περιλαμβάνει τους εξής πίνακες:

- **users**: user_id, name, email, password (hashed)
- **restaurants**: restaurant_id, name, location, description
- **reservations**: reservation_id, user_id, restaurant_id, date, time, people_count

> Η βάση δημιουργήθηκε μέσω **phpMyAdmin**, και συνδέεται στο backend με τη βιβλιοθήκη `mysql2`.
---


Ανάπτυξη από τον Lefteris Simeonidis στο πλαίσιο μαθήματος "Mobile & Distributed Systems".
