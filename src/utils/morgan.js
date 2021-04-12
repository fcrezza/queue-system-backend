import morgan from 'morgan'

morgan.token('sessionid', (req) => {
  if (req.sessionID) {
    return req.sessionID
  }

  return ''
})

morgan.token('user', (req) => {
  if (req.session) {
    return req.session.user
  }

  return ''
})

export default morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :user :sessionid',
)
