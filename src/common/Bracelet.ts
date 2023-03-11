import jwt from "jsonwebtoken";
import IBracelet from "../interfaces/IBracelet";
import {v4 as uuidv4} from "uuid";

class Bracelet {
    whitelist: Array<string>;
    constructor(whitelist: Array<string>) {
        this.whitelist = whitelist;
    }

    verify(bracelet: IBracelet, userAgent: string, remoteAddr: string) {
        if (!this.whitelist.includes(bracelet.jti))
            throw new Error("Sai daqui otariu");

        if (
            bracelet.remoteAddr !== remoteAddr ||
            bracelet.userAgent !== userAgent
        )
            throw new Error("foca off");
    }

    // TODO: arv
    make(userId: string, userAgent: string, remoteAddr: string) {
        // TODO: arv
        return jwt.sign(
            {
                userId: userId,
                userAgent: userAgent,
                remoteAddr: remoteAddr,
                jti: uuidv4(),
            },
            `${process.env.JWT_SECRET}`,
            {
                expiresIn: "5m",
            }
        );
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
                expiresIn: "5m",
            }
        );
    }

    read(bracelet: string) {
        return <IBracelet>(
            jwt.verify(bracelet, `${process.env.JWT_ACCESS_SECRET}`)
        );
    }

    castOut(bracelet: IBracelet) {
        const index = this.whitelist.indexOf(bracelet.jti)
        if (index === -1)
            throw new Error("Quenhe tu")

        delete this.whitelist[index]
    }
}

export default new Bracelet([]);
