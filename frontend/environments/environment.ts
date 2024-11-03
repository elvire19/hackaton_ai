export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    auth: {
      loginEndpoint: '/auth/login',
      registerEndpoint: '/auth/register',
      refreshTokenEndpoint: '/auth/refresh-token',
      logoutEndpoint: '/auth/logout'
    }
  };