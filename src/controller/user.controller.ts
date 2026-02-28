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

export const makeUserRoutes = (fastify: FastifyInstance) => {
  const userController = fastify.diContainer.resolve(
    "userController",
  ) as UserController;

  fastify.register(
    (instance) => {
      instance.get("/", userController.getUser);
    },
    { prefix: "/user" },
  );
};
