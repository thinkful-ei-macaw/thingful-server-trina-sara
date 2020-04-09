function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''
  console.log('require auth l3')
  let basicToken
  if (!authToken.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({ error: 'Missing basic token' })
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length)
  }
      
  const [tokenUserName, tokenPassword] = Buffer
    .from(basicToken, 'base64')
    .toString()
    .split(':')
    
  if (!tokenUserName || !tokenPassword) {
    console.log('no username of pw l17')
    return res.status(401).json({ error: 'Unauthorized request' })
  }

  req.app.get('db')('thingful_users')
    .where({ user_name: tokenUserName })
    .first()
    .then(user => {
      console.log(user)
      if (!user || user.password !== tokenPassword) {
        console.log('cant find user l26')
        return res.status(401).json({ error: 'Unauthorized request' })
      }
      
      next()
    })
    .catch(next)
}

module.exports = {
  requireAuth,
}