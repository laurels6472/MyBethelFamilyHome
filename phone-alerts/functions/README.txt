PHONE PUSH (works with the app closed) — one-time setup, about 10 minutes:
1. Firebase console > Project settings > Cloud Messaging > "Web Push certificates" > Generate key pair. Copy the key.
2. In the app (as Laurel) open the "Alerts on this device" card and paste that key into the Push key box, then tap Save.
3. On a computer with Node installed:  npm i -g firebase-tools ; firebase login ; firebase init functions (choose this project, JavaScript, keep this functions folder) ; firebase deploy --only functions
   (Functions need Firebase's Blaze plan. You set a budget; a family app normally costs $0.)
4. On every phone/tablet: install the app to the Home Screen, open it, and tap "Turn on alerts".
