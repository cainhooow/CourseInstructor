import BaseRouter from "@/app/utils/BaseRouter";

export default class ProfileRouter extends BaseRouter {
  constructor() {
    super({
      prefix: "/profile",
    });
  }

  public route(): void {
    this.router.get("/", (req, res) => {
      res.json({ json: "lkllç" });
    });
  }
}
