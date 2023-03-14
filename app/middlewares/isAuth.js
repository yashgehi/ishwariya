module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return {error:'Not loggedIn'}
    }
    next();
}