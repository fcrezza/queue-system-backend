import cors from 'cors'

export default cors({
  credentials: true,
  origin: process.env.ORIGIN || 'http://localhost:3000',
})
