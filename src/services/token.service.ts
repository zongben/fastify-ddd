import { JWT } from "@fastify/jwt";

export interface ITokenService {
    sign(payload: object): string;
}

export const makeTokenService = (jwt: JWT): ITokenService => {
    return {
        sign: (payload: object) => {
            return jwt.sign(payload)
        }
    }
}