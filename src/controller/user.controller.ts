import type { FastifyRequest } from "fastify";

export const userController = () => {
  return {
    getUser: async (req: FastifyRequest) => {
      const a = req.user;
      console.log(a);
      return "test";
    },
  };
};
