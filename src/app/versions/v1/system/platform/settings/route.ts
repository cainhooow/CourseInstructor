import { Request, Response } from "express";
import { Get } from "@/app/utils/controller";
import { Route, Controller } from "@fastexpress/http";
import { SettingsDTO } from "@/app/dto/system/settings.dto";
import PlatformPaymentRouter from "./payments/route";
import RoleMiddleware from "@/app/middleware/role.middleware";
import SettingsService from "@/app/services/system/settings.service";
import SettingsResponse from "@/app/http/responses/system/settings.response";
import Guard from "@/app/utils/type-guards";
import ResponseNotFound from "@/app/http/errors/not-found.error";

@Route("/settings")
export default class PlatformSettingsRouter extends Controller {
  constructor(protected readonly service = new SettingsService()) {
    super();
  }

  @Get("/", [new RoleMiddleware(["CAN_LIST_SERVER_SETTINGS"])])
  async index(_req: Request, res: Response) {
    const data = await this.service.index();

    if (Guard.isNull(data)) {
      throw new ResponseNotFound("Cannot find settings");
    }

    return res.json(
      new SettingsResponse(Guard.assumeAs<SettingsDTO[]>(data)).make()
    );
  }

  @Get("/:key")
  async findByKey(req: Request, res: Response) {
    const { key } = req.params;
    const data = await this.service.findByKey(key);

    return res.json(
      new SettingsResponse(Guard.assumeAs<SettingsDTO>(data)).make()
    );
  }

  public route(): void {
    this.router.use(new PlatformPaymentRouter().getRouter());
  }
}
