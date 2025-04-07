import { describe, test, expect, mock, spyOn, beforeEach } from "bun:test";
import Controller from "../controller";
import Middleware from "../../middleware/middleware";

// Mock para express.Router
const mockRouter = {
  use: mock(() => {}),
};

// Mock para express
mock.module("express", () => ({
  Router: () => mockRouter,
}));

// Classe de middleware de teste
class TestMiddleware extends Middleware {
  constructor(public handleCalled = false, public handleErrorCalled = false) {
    super();
  }

  handle(_req: any, _res: any, next: any): void {
    this.handleCalled = true;
    next();
  }

  handleError(err: any, _req: any, _res: any, next: any): void {
    this.handleErrorCalled = true;
    next(err);
  }
}

// Classe de middleware sem handleError personalizado
class SimpleMiddleware extends Middleware {
  handle(_req: any, _res: any, next: any): void {
    next();
  }
}

// Subclasse de BaseRouter para testes
class TestRouter extends Controller {
  routeCalled = false;

  public route(): void {
    this.routeCalled = true;
  }
}

describe("BaseRouter", () => {
  let testMiddleware: TestMiddleware;
  let simpleMiddleware: SimpleMiddleware;
  let baseRouter: Controller;
  let testRouter: TestRouter;

  beforeEach(() => {
    // Limpar os mocks antes de cada teste
    mockRouter.use.mockClear();

    testMiddleware = new TestMiddleware();
    simpleMiddleware = new SimpleMiddleware();
    baseRouter = new Controller({});
    testRouter = new TestRouter({});
  });

  describe("Construtor", () => {
    test("deve inicializar com valores padrão quando options estão vazias", () => {
      const router = new Controller({});
      expect(router).toBeInstanceOf(Controller);
    });

    test("deve inicializar com prefix fornecido", () => {
      const router = new Controller({ prefix: "/api" });
      expect(router).toBeInstanceOf(Controller);
    });

    test("deve inicializar com middlewares fornecidos", () => {
      const router = new Controller({ middlewares: [testMiddleware] });
      expect(router).toBeInstanceOf(Controller);
    });
  });

  describe("route", () => {
    test("deve lançar erro quando não implementado", () => {
      expect(() => baseRouter.route()).toThrow("Method not implemented");
    });

    test("deve ser chamado por getRouter", () => {
      const router = testRouter.getRouter();
      console.log(router);
      expect(testRouter.routeCalled).toBe(true);
    });
  });

  describe("getRouter", () => {
    test("deve retornar router simples quando não há prefix", () => {
      const router = new TestRouter({});
      const result = router.getRouter();
      expect(result).toBe(mockRouter as any);
    });

    test("deve aplicar middlewares ao router", () => {
      const middlewareSpy = new TestMiddleware();
      const router = new TestRouter({ middlewares: [middlewareSpy] });

      const useSpy = spyOn(mockRouter, "use");
      router.getRouter();

      expect(useSpy).toHaveBeenCalled();
    });

    test("deve criar router prefixado quando prefix é fornecido", () => {
      const prefixRouter = new TestRouter({ prefix: "/api" });
      const useSpy = spyOn(mockRouter, "use");

      prefixRouter.getRouter();

      // Verifica se o router usa o prefix
      expect(useSpy).toHaveBeenCalledWith("/api", mockRouter);
    });

    test("deve inicializar o router apenas uma vez", () => {
      const router = new TestRouter({});
      const routeSpy = spyOn(router, "route");

      router.getRouter();
      router.getRouter();

      expect(routeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("applyMiddlewares", () => {
    test("deve aplicar todos os middlewares fornecidos", () => {
      const middleware1 = new TestMiddleware();
      const middleware2 = new TestMiddleware();
      const router = new TestRouter({
        middlewares: [middleware1, middleware2],
      });

      const useSpy = spyOn(mockRouter, "use");
      router.getRouter();

      expect(useSpy).toHaveBeenCalledTimes(4); // 2 para handle + 2 para handleError
    });
  });

  describe("applyErrorsMiddlewares", () => {
    test("deve aplicar apenas middlewares com handleError personalizado", () => {
      // SimpleMiddleware não tem um handleError personalizado
      const router = new TestRouter({
        middlewares: [testMiddleware, simpleMiddleware],
      });

      const useSpy = spyOn(mockRouter, "use");
      router.getRouter();

      // 2 chamadas para os handles normais + 1 para o handleError personalizado
      expect(useSpy).toHaveBeenCalledTimes(3);
    });

    test("deve usar bind para manter o contexto do middleware", () => {
      const middleware = new TestMiddleware();
      const router = new TestRouter({ middlewares: [middleware] });

      const useSpy = spyOn(mockRouter, "use");
      router.getRouter();

      const handleErrorCall = useSpy.mock.calls.find(
        (call: any) => call[0]?.name === "bound handleError"
      );

      expect(handleErrorCall).toBeTruthy();
    });
  });

  describe("Comportamento de herança", () => {
    class CustomRouter extends Controller {
      public routeImplemented = false;

      public route(): void {
        this.routeImplemented = true;
        this.router.use("/custom", (_req, res) => {
          res.send("ok");
        });
      }
    }

    test("deve permitir que subclasses implementem route", () => {
      const customRouter = new CustomRouter({});
      const routeSpy = spyOn(customRouter, "route");

      customRouter.getRouter();

      expect(routeSpy).toHaveBeenCalled();
    });

    test("deve manter o estado entre chamadas getRouter", () => {
      const customRouter = new CustomRouter({});
      customRouter.getRouter();

      expect(customRouter.routeImplemented).toBe(true);
    });
  });
});
