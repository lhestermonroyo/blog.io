import admin from 'firebase-admin';
import { firebaseAdmin } from '../config';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: firebaseAdmin.project_id,
    clientEmail: firebaseAdmin.client_email,
    privateKey: firebaseAdmin.private_key.replace(/\\n/g, '\n')
  })
});

export default admin;
