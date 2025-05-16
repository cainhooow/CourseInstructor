import { Request, Response } from "express";
import { Get, Route, Controller } from "@fastexpress/http";
import FlagService from "@/app/services/system/flag.service";
import FlagResponse from "@/app/http/responses/system/flag.response";
import Guard from "@/app/utils/type-guards";
import { FlagsDTO } from "@/app/dto/system/flags.dto";

@Route("/flags")
export default class FlagsRouter extends Controller {
  constructor(protected readonly service = new FlagService()) {
    super();
  }

  @Get("/")
  async index(_req: Request, res: Response) {
    const data = await this.service.index();
    return res.json(new FlagResponse(Guard.assumeAs<FlagsDTO[]>(data)).make());
  }

  public route(): void {}
}
