# Recap Browser Extension Source

This repository contains the source code deployed in the [Recap browser extension](https://chrome.google.com/webstore/detail/recap/oebaibegfmdokfbbeooiaoogobnaaikj).

The extension acts as a simple proxy to connect to exchange APIs which would otherwise be blocked in browser because of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). This means that Recap doesn't operate proxy servers where we could intercept your traffic and snoop on your data. [More about Recap's security model](https://recap.io/security).

You can always check the content of the live extension using the [Chrome extension source viewer](https://chrome.google.com/webstore/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin) or its [online demo](https://robwu.nl/crxviewer/?crx=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Frecap%2Foebaibegfmdokfbbeooiaoogobnaaikj%3Fhl%3Den).

## Security Details

The only domain that can communicate with the extension is `https://app.recap.io/*` as defined in the `externally_connectable` property of `manifest.json`. This means no other apps or sites can use the extension to bypass browser security.

The extension can only fetch data from URLs defined in the `permissions` property of `manifest.json`. This limits which URLs the extension can connect to, which means that Recap can't query any other sites other than those defined. This whitelist is also checked in the `fetch` method of `background.js`.
