import withSession from '../../util/session'

export default withSession(async (req, res) => {
  const user = req.session.get('user')
  // As of now, anything we'd need is stored with the user in session
  if (user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      isLoggedIn: true,
      ...user,
    })
  } else {
    res.json({
      isLoggedIn: false,
    })
  }
})
