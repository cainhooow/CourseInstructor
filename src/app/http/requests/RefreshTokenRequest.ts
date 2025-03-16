import Request from "./Request";

export default class RefreshTokenRequest extends Request {
  constructor(protected data: any) {
    super(data, ["refreshToken"]);
  }

  protected rules(): Record<string, string> {
      return {
          "refreshToken": "string|min:25"
      }
  }
}
