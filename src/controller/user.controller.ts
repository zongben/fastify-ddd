import type { FastifyInstance, FastifyRequest } from "fastify";

export const makeUserController = () => {
  return {
    getUser: async (req: FastifyRequest) => {
      const a = req.user;
      console.log(a);
      return "test";
    },
  };
};

export type UserController = ReturnType<typeof makeUserController>;

export const makeUserRoutes =
  (user: UserController) => (fastify: FastifyInstance) => {
    fastify.register(
      (instance) => {
        instance.get("/", user.getUser);
      },
      { prefix: "/user" },
    );
  };
