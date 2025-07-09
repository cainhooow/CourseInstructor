import { SettingsDTO } from "@/app/dto/system/settings.dto";
import { Response } from "../response";

export default class SettingsResponse extends Response {
  constructor(protected readonly data: SettingsDTO | SettingsDTO[]) {
    super(data);
  }

  protected makeData<_T>(data: SettingsDTO) {
    return {
      id: data.id,
      name: data.name,
      value: data.value,
    };
  }
}
