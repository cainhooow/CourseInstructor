import { describe, test, expect, beforeEach } from "bun:test";
import { Response } from "../response";
import ResponseNotFound from "../../errors/not-found.error";

describe("Response", () => {
  let userResponse: Response;
  const sampleUser = { id: 1, nome: "João Silva", email: "joao@exemplo.com" };
  const userList = [
    { id: 1, nome: "João Silva", email: "joao@exemplo.com" },
    { id: 2, nome: "Maria Santos", email: "maria@exemplo.com" },
  ];

  describe("Construtor", () => {
    test("deve criar uma instância sem dados", () => {
      const response = new Response();
      expect(response).toBeInstanceOf(Response);
    });

    test("deve criar uma instância com dados", () => {
      const response = new Response(sampleUser);
      expect(response).toBeInstanceOf(Response);
    });
  });

  describe("addField", () => {
    beforeEach(() => {
      userResponse = new Response(sampleUser);
    });

    test("deve adicionar um campo corretamente", () => {
      userResponse.addField("token", "abc123");
      const result = userResponse.make<any>();
      expect(result.token).toBe("abc123");
    });

    test("deve permitir encadeamento de métodos", () => {
      const result = userResponse
        .addField("token", "abc123")
        .addField("expiresIn", 3600);

      expect(result).toBe(userResponse);
      const data = userResponse.make<any>();
      expect(data.token).toBe("abc123");
      expect(data.expiresIn).toBe(3600);
    });

    test("deve sobrescrever campo com o mesmo nome", () => {
      userResponse.addField("role", "user").addField("role", "admin");

      const result = userResponse.make<any>();
      expect(result.role).toBe("admin");
    });
  });

  describe("make", () => {
    test("deve lançar ResponseEmpty quando dados são undefined", () => {
      const response = new Response();
      expect(() => response.make()).toThrow(ResponseNotFound);
      expect(() => response.make()).toThrow("responses.empty");
    });

    test("deve lançar ResponseEmpty quando dados são um array vazio", () => {
      const response = new Response([]);
      expect(() => response.make()).toThrow(ResponseNotFound);
      expect(() => response.make()).toThrow("responses.empty");
    });

    test("deve processar corretamente dados de objeto único", () => {
      const response = new Response(sampleUser);
      response.addField("timestamp", 1616161616);

      const result = response.make<typeof sampleUser & { timestamp: number }>();
      expect(result).toEqual({
        ...sampleUser,
        timestamp: 1616161616,
      });
    });

    test("deve processar corretamente array de dados", () => {
      const response = new Response(userList);
      response.addField("processedAt", "2023-01-01");

      const results = response.make<any>();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);

      results.forEach((item: any, index: number) => {
        expect(item).toEqual({
          ...userList[index],
          processedAt: "2023-01-01",
        });
      });
    });
  });

  describe("makeData", () => {
    test("deve combinar dados com campos incluídos", () => {
      const response = new Response();
      (response as any).include = {
        extraField: "valor extra",
        status: "ativo",
      };

      // Acessando método protegido para teste
      const result = (response as any).makeData({ id: 1, name: "Teste" });

      expect(result).toEqual({
        id: 1,
        name: "Teste",
        extraField: "valor extra",
        status: "ativo",
      });
    });

    test("deve preservar campos originais quando existem chaves duplicadas", () => {
      const response = new Response();
      (response as any).include = { id: 999, status: "ativo" };

      // Acessando método protegido para teste
      const result = (response as any).makeData({ id: 1, name: "Teste" });

      // Os campos originais têm precedência sobre os campos incluídos
      expect(result.id).toBe(1);
      expect(result.status).toBe("ativo");
    });
  });

  describe("Tipagem genérica", () => {
    test("deve respeitar a tipagem genérica fornecida", () => {
      interface Usuario {
        id: number;
        nome: string;
        email: string;
      }

      const response = new Response(sampleUser);
      const result = response.make<Usuario>() as Usuario;
      // Verificando se o tipo está correto (em tempo de execução isso é apenas um objeto)
      expect(typeof result.id).toBe("number");
      expect(typeof result.nome).toBe("string");
      expect(typeof result.email).toBe("string");
    });
  });
});
