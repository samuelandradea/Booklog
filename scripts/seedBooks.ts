import csv from 'csvtojson';
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyALpmsLJ3uzaELFi73QIVg-JVMOoYKIgvw",
  authDomain: "booklog-40ce6.firebaseapp.com",
  projectId: "booklog-40ce6",
  storageBucket: "booklog-40ce6.firebasestorage.app",
  messagingSenderId: "290492336424",
  appId: "1:290492336424:web:c2eda1d205eb153bef281d",
  measurementId: "G-S5M8REXTDQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  const data = await csv().fromFile('./data/dataset.csv');
  
  console.log(`Total de livros: ${data.length}`);
  
  const batchSize = 500;
  let count = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = data.slice(i, i + batchSize);

    chunk.forEach((book: any) => {
      const ref = doc(collection(db, 'books'));
      batch.set(ref, {
        isbn13: book.isbn13 || null,
        isbn10: book.isbn10 || null,
        title: book.title || null,
        subtitle: book.subtitle || null,
        authors: book.authors || null,
        categories: book.categories || null,
        thumbnail: book.thumbnail || null,
        description: book.description || null,
        published_year: book.published_year || null,
        average_rating: book.average_rating || null,
        num_pages: book.num_pages || null,
        ratings_count: book.ratings_count || null,
      });
      count++;
    });

    await batch.commit();
    console.log(`Importados: ${count}/${data.length}`);
  }

  console.log('Seed concluído!');
}

seed().catch(console.error);