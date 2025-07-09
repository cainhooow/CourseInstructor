import SettingsRepository from "@/app/repositories/system/settings.repository";

export default class SettingsService {
  constructor(protected readonly repository = new SettingsRepository()) {}

  async index() {
    return await this.repository.index();
  }
}
