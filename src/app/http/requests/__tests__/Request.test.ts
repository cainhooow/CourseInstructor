import { describe, test, expect, mock, beforeEach } from "bun:test";
import Request from "../request";
import ValidationError from "../../errors/validation.error";

// Mock das dependências
const mockUnique = mock(() => Promise.resolve(true));
mock.module("@/app/helpers/ValidationHelper", () => ({
  default: class MockValidationHelper {
    unique = mockUnique;
  },
}));

mock.module("@courseinstructor/validator", () => ({
  Validator: class MockValidator {
    constructor(
      public rule: string,
      public field: string,
      public value: any,
      public t: any
    ) {}
    validate() {
      if (this.rule === "required" && !this.value) return "Campo obrigatório";
      if (this.rule === "email" && !this.value.includes("@"))
        return "Email inválido";
      if (this.rule === "transform.lowercase") return "transform.lowercase";
      return null;
    }
  },
}));

// Mock da requisição Express
const createMockRequest = (body: any = {}) => ({
  body,
  t: (key: string, params: any = {}) => {
    if (key === "validation.failed") return "Falha na validação";
    if (key === "validation.missing") return `Campo ${params.field} ausente`;
    return key;
  },
});

describe("Request", () => {
  let request: Request;
  let mockReq: any;

  beforeEach(() => {
    mockReq = createMockRequest({ nome: "João", email: "joao@exemplo.com" });
    request = new Request(mockReq, ["nome", "email"]);
  });

  describe("validateAsync", () => {
    test("deve validar com sucesso quando todos os campos obrigatórios estão presentes", async () => {
      const result = await request.validateAsync();
      expect(result).toBe(true);
    });

    test("deve lançar erro quando dados são undefined", async () => {
      mockReq.body = undefined;
      request = new Request(mockReq, ["nome", "email"]);

      await expect(request.validateAsync()).rejects.toThrow(ValidationError);
      expect(request.hasErrors()).toContain("Falha na validação");
    });

    test("deve lançar erro quando campos obrigatórios estão ausentes", async () => {
      mockReq.body = { nome: "João" };
      request = new Request(mockReq, ["nome", "email"]);

      await expect(request.validateAsync()).rejects.toThrow(ValidationError);
      expect(request.hasErrors()[0]).toContain("Campo email ausente");
    });
  });

  describe("optional e removeField", () => {
    test("deve permitir campos marcados como opcionais", async () => {
      mockReq.body = { nome: "João" };
      request = new Request(mockReq, ["nome", "email"]);
      request.optionals(["email"]);

      const result = await request.validateAsync();
      expect(result).toBe(true);
    });

    test("deve lançar erro quando tentar marcar o mesmo campo como opcional duas vezes", () => {
      request.optionals(["telefone"]);
      expect(() => request.optionals(["telefone"])).toThrow();
    });

    test("optional() deve marcar um único campo como opcional", () => {
      request.optional("telefone");
      expect(() => request.optional("telefone")).toThrow();
    });

    test("deve ignorar campos removidos", async () => {
      request.removeField("email");
      mockReq.body = { nome: "João" };
      request = new Request(mockReq, ["nome", "email"]);
      request.removeField("email");

      const result = await request.validateAsync();
      expect(result).toBe(true);
    });

    test("removeFields() deve remover múltiplos campos", () => {
      request.removeFields(["email", "telefone"]);
      expect(() => request.removeFields(["email"])).toThrow();
    });
  });

  describe("rules e applyRulesAsync", () => {
    test("deve aplicar regras customizadas definidas na classe filha", async () => {
      class TesteRequest extends Request {
        protected rules(): Record<string, string> {
          return {
            email: "required|email",
            nome: "required",
          };
        }
      }

      mockReq.body = { email: "invalido", nome: "João" };
      const customRequest = new TesteRequest(mockReq, ["nome", "email"]);

      await expect(customRequest.validateAsync()).rejects.toThrow(
        ValidationError
      );
      expect(customRequest.hasErrors()).toContain("Email inválido");
    });

    test("deve transformar valores conforme regras", async () => {
      class TesteRequest extends Request {
        protected rules(): Record<string, string> {
          return {
            email: "transform.lowercase",
          };
        }
      }

      mockReq.body = { email: "EMAIL@TESTE.COM", nome: "João" };
      const customRequest = new TesteRequest(mockReq, ["nome", "email"]);

      await customRequest.validateAsync();
      expect(customRequest.getData<any>().email).toBe("lowercase");
    });

    test("deve verificar unicidade no banco de dados", async () => {
      mockUnique.mockImplementationOnce(() => Promise.resolve(false));

      class TesteRequest extends Request {
        protected rules(): Record<string, string> {
          return {
            email: "unique:usuarios",
          };
        }
      }

      const customRequest = new TesteRequest(mockReq, ["nome", "email"]);

      await expect(customRequest.validateAsync()).rejects.toThrow(
        ValidationError
      );
      expect(customRequest.hasErrors()).toContain("usuarios already exists");
    });
  });

  describe("appendField e getData", () => {
    test("deve adicionar campo adicional", () => {
      request.appendField("idade", 30);
      expect(request.getData<any>().idade).toBe(30);
    });

    test("deve permitir encadeamento de métodos", () => {
      const result = request
        .appendField("idade", 30)
        .appendField("ativo", true);
      expect(result).toBe(request);
      expect(request.getData<any>().idade).toBe(30);
      expect(request.getData<any>().ativo).toBe(true);
    });

    test("deve retornar os dados convertidos para o tipo especificado", () => {
      interface Usuario {
        nome: string;
        email: string;
      }

      const data = request.getData<Usuario>();
      expect(data.nome).toBe("João");
      expect(data.email).toBe("joao@exemplo.com");
    });
  });
});
