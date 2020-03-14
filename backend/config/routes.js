module.exports = app => {
    app.roue('/users')
        .post(app.api.user.save)
}