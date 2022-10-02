const response = (h, body, code) => {
    const resp = h.response(body);
    resp.code(code);
    return resp;
}

module.exports = response