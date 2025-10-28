module.exports = async (srv) => {
  srv.before('*', req => {
    console.log(`--> ${req.method} ${req.path}`);
  });

  // Handle CORS
  srv.before('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).send();
    }
    next();
  });

  // Basic authentication middleware for development
  srv.before('*', (req) => {
    req.user = {
      id: 'default-user',
      roles: ['authenticated-user', 'User'],
      attr: {
        email: 'test@example.com'
      }
    };
  });
};