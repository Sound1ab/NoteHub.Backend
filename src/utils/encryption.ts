import crypto from 'crypto'

const tokenSigningKey = process.env.SERVERLESS_APP_TOKEN_SIGNING_KEY!

const key = crypto
  .createHash('sha256')
  .update(String(tokenSigningKey))
  .digest('base64')
  .substr(0, 32)

export const encrypt = (value: string): { value: string; iv: string } => {
  const iv = new Buffer(crypto.randomBytes(8)).toString('hex')

  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv)

  const crypted = cipher.update(value, 'utf8', 'hex')

  return { value: `${crypted}${cipher.final('hex')}`, iv }
}

export const decrypt = (value: string, iv: string): string => {
  const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv)

  const dec = decipher.update(value, 'hex', 'utf8')

  return `${dec}${decipher.final('utf8')}`
}
