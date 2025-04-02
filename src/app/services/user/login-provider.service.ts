import LoginProviderRepository, {
  CreateableProvider,
} from "@/app/repositories/user/login-provider.repository";

export default class LoginProviderService {
  constructor(protected readonly repository = new LoginProviderRepository()) {}

  public async create(provider: CreateableProvider) {
    return await this.repository.create(provider);
  }
}
