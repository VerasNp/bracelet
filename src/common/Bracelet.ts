import jwt from 'jsonwebtoken'
import IBracelet from '../interfaces/IBracelet'
import { v4 as uuidv4 } from 'uuid'

class Bracelet {
  whitelist: Array<string>

  constructor(whitelist: Array<string>) {
    this.whitelist = whitelist
  }

  verify(bracelet: IBracelet, userAgent: string, remoteAddr: string) {
    if (!this.whitelist.includes(bracelet.jti))
      throw new Error('Sai daqui otariu')

    if (bracelet.remoteAddr !== remoteAddr || bracelet.userAgent !== userAgent)
      throw new Error('foca off')
    // TODO: validar times iat e exp p/ return TokenExpiredError e remove da whitelist
  }

  // TODO: arv
  make(userId: string, userAgent: string, remoteAddr: string) {
    const jti = uuidv4()
    this.whitelist.push(jti)
    return jwt.sign(
      {
        userId: userId,
        userAgent: userAgent,
        remoteAddr: remoteAddr,
        jti: jti,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: '55m',
      }
    )
  }

  // TODO: arv
  remake(oldBracelet: IBracelet, userAgent: string, remoteAddr: string) {
    // TODO: arv
    return jwt.sign(
      {
        userId: oldBracelet.userId,
        userAgent: userAgent,
        remoteAddr: remoteAddr,
        jti: oldBracelet.jti,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: '55m',
      }
    )
  }

  read(bracelet: string) {
    return <IBracelet>jwt.verify(bracelet, `${process.env.JWT_SECRET}`)
    // TODO: Precisamos excluir a entry do array caso timedout
    // mas non sei como, pq se timedout, o jwt acima ja throw error
  }

  castOut(bracelet: string) {
    const readableBracelet = this.read(bracelet)
    const index = this.whitelist.indexOf(readableBracelet.jti)
    if (index === -1) throw new Error('Quenhe tu')

    delete this.whitelist[index]
  }
}

export default new Bracelet([])
