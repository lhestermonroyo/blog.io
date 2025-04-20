const admin = require('firebase-admin');

const { firebaseAdmin } = require('../config');

admin.initializeApp({
  credential: admin.credential.cert({
    type: firebaseAdmin.type,
    project_id: firebaseAdmin.project_id,
    private_key_id: firebaseAdmin.private_key_id,
    private_key: firebaseAdmin.private_key.replace(/\\n/g, '\n'),
    client_email: firebaseAdmin.client_email,
    client_id: firebaseAdmin.client_id,
    auth_uri: firebaseAdmin.auth_uri,
    token_uri: firebaseAdmin.token_uri,
    auth_provider_x509_cert_url: firebaseAdmin.auth_provider_x509_cert_url,
    client_x509_cert_url: firebaseAdmin.client_x509_cert_url,
    universe_domain: firebaseAdmin.universe_domain
  })
});

module.exports = admin;
