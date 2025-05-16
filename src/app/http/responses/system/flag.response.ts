import { FlagsDTO } from "@/app/dto/system/flags.dto";
import { Response } from "../response";

export default class FlagResponse extends Response {
  constructor(protected readonly data: FlagsDTO | FlagsDTO[]) {
    super(data);
  }

  protected makeData<_T>(data: FlagsDTO) {
    return {
      id: data.id,
      name: data.name,
      ...this.include,
    };
  }
}
