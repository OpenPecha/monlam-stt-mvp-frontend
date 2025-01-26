/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { Auth0Provider } from '@auth0/auth0-react';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <Auth0Provider domain="dev-vz6o17motc18g45h.us.auth0.com" clientId="RHBKvxr8sWksscmmGZMSlXDbJP2UsVNx" authorizationParams={{redirect_uri: "http://localhost:5173/"}} cacheLocation="localstorage" useRefreshTokens={true}>
      <RemixBrowser />
      </Auth0Provider>
    </StrictMode>
  );
});
