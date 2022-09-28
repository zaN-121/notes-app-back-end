const Jwt = require('@hapi/jwt');

const TokenManager = {
  genereateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts;
      return payload;
    } catch (err) {
      throw new InvariantError('Refresh token tidak valid');
    }

  }
  
  
};

module.exports = TokenManager;