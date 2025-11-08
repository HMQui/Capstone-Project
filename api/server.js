import { webcrypto } from 'node:crypto';

// Polyfill global crypto to jose library
if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = webcrypto;
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as jose from 'jose';

dotenv.config();
const app = express();

const JWKS = jose.createRemoteJWKSet(new URL(process.env.JWKS_URL));

app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
    console.log('Request received cho /api/data (API thật)');
    res.json({ message: 'Hello từ Express API!' });
});

// === EXT_AUTHZ SERVICE ===
app.all('/auth/check/*', async (req, res) => {
    console.log('==> Envoy đang hỏi ý kiến /auth/check...');
    try {
        // Get info from headers
        const authHeader = req.headers['authorization'];
        const dpopHeader = req.headers['dpop'];

        // Get the original method and path
        const originalMethod = req.headers['x-envoy-original-method'];
        const originalUrl = `${process.env.ENVOY_URL}${req.headers['x-envoy-original-path']}`;        

        if (!authHeader || !dpopHeader) {
            throw new Error("Missing Authorization or DPoP header");
        }

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            throw new Error("Missing access token");
        }

        // Verify the access token
        const { payload: tokenPayload } = await jose.jwtVerify(accessToken, JWKS, {
            issuer: process.env.KEYCLOAK_ISSUER_URL,
        });        

        // Verify the DPoP proof
        const { jwk } = jose.decodeProtectedHeader(dpopHeader);
        const dpopPublicKey = await jose.importJWK(jwk, 'ES256');
        const { payload: dpopPayload } = await jose.jwtVerify(dpopHeader, dpopPublicKey);

        // Verify binding between DPoP and access token
        const dpopKeyThumbprint = await jose.calculateJwkThumbprint(jwk);
        if (!tokenPayload.cnf || tokenPayload.cnf.jkt !== dpopKeyThumbprint) {
            throw new Error("Token-Key binding failed. DPoP key does not match token 'cnf'.");
        }

        // Verify HTTP method and URL
        console.log(dpopPayload);
        
        if (dpopPayload.htm !== originalMethod) {
            throw new Error(`DPoP htm (method) mismatch: Expected ${originalMethod}, got ${dpopPayload.htm}`);
        }
        if (dpopPayload.htu.url !== originalUrl) {
            throw new Error(`DPoP htu (url) mismatch: Expected ${originalUrl}, got ${dpopPayload.htu}`);
        }

        console.log("==> True:", tokenPayload.preferred_username);
        res.sendStatus(200);
    } catch (error) {
        console.error("==> Fail:", error.message, error);
        res.status(401).send(error.message);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
});