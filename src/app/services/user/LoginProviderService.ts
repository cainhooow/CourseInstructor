import LoginProviderRepository, {
  CreateableProvider,
} from "@/app/repositories/user/LoginProviderRepo";

export default class LoginProviderService {
  constructor(protected readonly repository = new LoginProviderRepository()) {}

  public async create(provider: CreateableProvider) {
    return await this.repository.create(provider);
  }
}
