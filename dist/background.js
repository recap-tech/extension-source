"use strict";
const fetchOrigins = ['https://api-pub.bitfinex.com', 'https://api.binance.com', 'https://api.binance.je', 'https://api.binance.us', 'https://fapi.binance.com', 'https://dapi.binance.com', 'https://api.bitfinex.com', 'https://api.bittrex.com', 'https://api.coinbase.com', 'https://api.exchange.bitpanda.com', 'https://api.kraken.com', 'https://api.pro.coinbase.com', 'https://api.uphold.com', 'https://poloniex.com', 'https://support.kraken.com', 'https://wallet-api.celsius.network', 'https://webapi.coinfloor.co.uk', 'https://www.bitstamp.net', 'https://api.luno.com', 'https://futures.kraken.com', 'https://api.kucoin.com', 'https://www.bitmex.com', 'https://api.crypto.com', 'https://ftx.com', 'https://api.gemini.com', 'https://ftx.us', 'https://api.valr.com', 'https://api.wealth99.com', 'https://api-recap-b2b.coinpass.com'];
function arrayBufferToBase64(arrayBuffer) {
    return btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => {
        return data + String.fromCharCode(byte);
    }, ''));
}
function base64ToArrayBuffer(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}
function getHeaders(headers) {
    const record = {};
    headers.forEach((value, key) => {
        record[key.toLowerCase()] = value;
    });
    return record;
}
chrome.runtime.onMessageExternal.addListener((message, _sender, sendResponse) => {
    const { type, payload } = message;
    if (type === 'getVersion') {
        const { version } = chrome.runtime.getManifest();
        sendResponse(version);
        return;
    }
    if (type === 'fetch') {
        if (!fetchOrigins.some(x => payload.url.startsWith(x))) {
            sendResponse({
                error: true,
                payload: 'Not whitelisted',
            });
            return;
        }
        const init = {
            credentials: 'omit',
        };
        if (payload.method) {
            init.method = payload.method;
        }
        if (payload.headers) {
            init.headers = payload.headers;
        }
        if (payload.body) {
            init.body = base64ToArrayBuffer(payload.body);
        }
        fetch(new Request(payload.url, init))
            .then(async (response) => {
            const serializedResponse = {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: getHeaders(response.headers),
                body: arrayBufferToBase64(await response.arrayBuffer()),
            };
            sendResponse({
                payload: serializedResponse,
            });
        })
            .catch(err => {
            sendResponse({
                error: true,
                payload: {
                    name: err.name,
                    message: err.message,
                },
            });
        });
        return true;
    }
});
