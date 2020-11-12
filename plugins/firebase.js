import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyAUOR_pVi1uQ9RFneyPWR3PKfo8e2W8eBo',
  authDomain: 'on-be-3d88b.firebaseapp.com',
  databaseURL: 'https://on-be-3d88b.firebaseio.com',
  projectId: 'on-be-3d88b',
  storageBucket: 'on-be-3d88b.appspot.com',
  messagingSenderId: '942337674969',
  appId: '1:942337674969:web:35d191161b321e0e05b8c8',
  measurementId: 'G-T32251F30F',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
  firebase.firestore();
}

export default firebase;
