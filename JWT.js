const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id },
    `LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFE
    Q0JpUUtCZ1FDcHZmVy9HK1J4ZUlKaHhZS0pFaEZhbkFlbwoydnhEWjFLY3VNa1cyc29Ya1VBWHk0
    Nm40cThlWko2VEF3VDFyR04zSEphVEMzUG5hLzU1eHNDL1ovWmVTN21UCjZzY0VIL2tBdyt2aWhB
    bjNnUW5hRUZMZkpYcU9ObGRqV2lwdVUvWEphbkdCVzlybkFiMDIxVnhQbDJoR1oyeC8KbU5tQW1j
    eWZqZlhzYWZ4MmR3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=`
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, `LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFE
    Q0JpUUtCZ1FDcHZmVy9HK1J4ZUlKaHhZS0pFaEZhbkFlbwoydnhEWjFLY3VNa1cyc29Ya1VBWHk0
    Nm40cThlWko2VEF3VDFyR04zSEphVEMzUG5hLzU1eHNDL1ovWmVTN21UCjZzY0VIL2tBdyt2aWhB
    bjNnUW5hRUZMZkpYcU9ObGRqV2lwdVUvWEphbkdCVzlybkFiMDIxVnhQbDJoR1oyeC8KbU5tQW1j
    eWZqZlhzYWZ4MmR3SURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=`);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { createTokens, validateToken };
