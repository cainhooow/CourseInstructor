import BaseRouter from "@/app/utils/BaseRouter";

export default class AuthRouter extends BaseRouter {
  constructor() {
    super({ prefix: "/auth" });
  }

  public route(): void {
    this.router.get("/", (req, res) => {
      res.json(req);
    });
  }
}
