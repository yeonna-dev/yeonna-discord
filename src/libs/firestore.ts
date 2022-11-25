// import { initializeApp } from 'firebase/app';
// import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

// const firebase = initializeApp({
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
// });

// const firestore = getFirestore(firebase);
// const collectionId = 'spotify-auth';

// export class Firestore
// {
//   static collectionReference()
//   {
//     return collection(firestore, collectionId);
//   }

//   static documentReference(documentId: string)
//   {
//     return doc(firestore, collectionId, documentId);
//   }

//   static async getDocument<T>(documentId: string)
//   {
//     const document = Firestore.documentReference(documentId);
//     const doc = await getDoc(document);
//     return doc.data() as T;
//   }

//   static async setDocument<T>(documentId: string, data: unknown)
//   {
//     await setDoc(Firestore.documentReference(documentId), data);
//     return Firestore.getDocument<T>(documentId);
//   }

//   static async updateDocument<T>(documentId: string, data: Partial<unknown>)
//   {
//     await setDoc(Firestore.documentReference(documentId), data, { merge: true });
//     return Firestore.getDocument<T>(documentId);
//   }
// }
