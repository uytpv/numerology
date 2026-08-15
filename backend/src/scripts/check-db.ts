import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
admin.initializeApp({ projectId: 'numerology-app-dev' });
const db = getFirestore();

async function checkDb() {
  const indicatorsSnap = await db.collection('indicators').limit(5).get();
  console.log('Indicators count:', (await db.collection('indicators').get()).size);
  indicatorsSnap.forEach((doc: any) => {
    console.log('Indicator:', doc.id, doc.data());
  });

  const numbersSnap = await db.collection('indicator_numbers').limit(3).get();
  console.log('Indicator Numbers count:', (await db.collection('indicator_numbers').get()).size);
  numbersSnap.forEach((doc: any) => {
    console.log('Indicator Number:', doc.id, {
      ...doc.data(),
      description: doc.data().description?.substring(0, 150) + '...'
    });
  });
}

checkDb().catch(console.error);
