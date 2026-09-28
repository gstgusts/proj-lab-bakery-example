import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM ?? 'example',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'web',
})

let initPromise: Promise<boolean> | null = null

// keycloak-js may only be initialised once; React StrictMode runs effects twice
export function initKeycloak(): Promise<boolean> {
  initPromise ??= keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    checkLoginIframe: false,
  })
  return initPromise
}
