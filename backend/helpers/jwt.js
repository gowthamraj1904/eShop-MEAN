const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_URL;
    const productsUrlRegExp = /\/api\/v1\/products(.*)/;
    const categoriesUrlRegExp = /\/api\/v1\/categories(.*)/;

    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        // Exclude these APIs from authorization
        path: [
            {
                url: categoriesUrlRegExp,
                methods: ['GET', 'OPTIONS']
            },
            {
                url: productsUrlRegExp,
                methods: ['GET', 'OPTIONS']
            },
            `${api}/users/login`,
            `${api}/users/register`
        ]
    });
}

async function isRevoked(req, token) {
    if (!token.payload.isAdmin) {
        return true;
    }

    return false;
}

module.exports = authJwt;
