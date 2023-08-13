const getToken = (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error("Authorization header is missing.");
    }

    const token = authHeader.split(" ")[1];

    return token;
}

module.exports = getToken
