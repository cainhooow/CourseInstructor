import Request from "./Request";

export default class UserRequest extends Request {
    constructor(protected data: any) {
        super(data, ["email", "password", "display_name"]);
    }

    protected rules(): Record<string, string> {
        return {
            "email": "string|min:8|email|unique:User",
            "password": "string|min:8",
            "display_name": "string|min:8"
        }
    }
}