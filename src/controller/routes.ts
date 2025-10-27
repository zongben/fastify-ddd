import { type FastifyInstance } from "fastify";
import { userController } from "./user.controller.js";
import { serviceContext } from "../application/service.context.js";
import { authController } from "./auth.controller.js";
import { LoginSchema } from "../contract/auth/login.js";
import { RegisterSchema } from "../contract/auth/register.js";

export class Routes {
  private constructor(
    private readonly svcCtx: ReturnType<typeof serviceContext>,
  ) {}

  #authRoutes(fastify: FastifyInstance) {
    const auth = authController({
      serviceCtx: this.svcCtx,
      jwt: fastify.jwt,
    });
    fastify.register(
      (instance) => {
        instance.post("/login", { schema: LoginSchema }, auth.login);
        instance.post("/register", { schema: RegisterSchema }, auth.register);
      },
      { prefix: "/auth" },
    );
  }

  #userRoutes(fastify: FastifyInstance) {
    const user = userController();
    fastify.register(
      (instance) => {
        instance.get("/", user.getUser);
      },
      { prefix: "/user" },
    );
  }

  anonymousRoutes(fastify: FastifyInstance) {
    fastify.register(async (instance) => {
      this.#authRoutes(instance);
    });
  }

  jwtAuthRoutes(fastify: FastifyInstance) {
    fastify.register(async (instance) => {
      instance.addHook("onRequest", async (req, reply) => {
        try {
          await req.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      });
      this.#userRoutes(instance);
    });
  }

  static create(svcCtx: ReturnType<typeof serviceContext>) {
    return new Routes(svcCtx);
  }
}
