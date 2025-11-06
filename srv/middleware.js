const cds = require('@sap/cds');

module.exports = async (srv) => {
  // Handle CORS on all requests - must be FIRST
  srv.on('*', (req) => {
    const res = req.res;
    if (res) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
      
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return res.status(200).send();
      }
    }
  });

  // Log all requests
  srv.before('*', req => {
    console.log(`--> ${req.method} ${req.path}`);
  });

  // Mock authentication for development - set user before CAP checks
  srv.before('*', async (req) => {
    // Set user early to bypass CAP's auth check
    if (!req.user) {
      req.user = {
        id: 'default-user',
        _roles: ['authenticated-user', 'User', 'Tech'],
        roles: ['authenticated-user', 'User', 'Tech'],
        attr: {
          email: 'test@example.com'
        }
      };
    }
  });
};
