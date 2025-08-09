import SettingsRepository from "@/app/repositories/system/settings.repository";

export default class SettingsService {
  constructor(protected readonly repository = new SettingsRepository()) {}

  async index() {
    return await this.repository.index();
  }

  async findByKey(key: string) {
    return await this.repository.findByKey(key);
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }
}
