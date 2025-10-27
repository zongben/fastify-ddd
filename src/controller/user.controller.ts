import type { FastifyInstance, FastifyRequest } from "fastify";

const makeUserController = () => {
  return {
    getUser: async (req: FastifyRequest) => {
      const a = req.user;
      console.log(a);
      return "test";
    },
  };
};

export const makeUserRoutes = () => (fastify: FastifyInstance) => {
  const user = makeUserController();
  fastify.register(
    (instance) => {
      instance.get("/", user.getUser);
    },
    { prefix: "/user" },
  );
};
