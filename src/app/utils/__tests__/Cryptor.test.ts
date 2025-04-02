import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import Cryptor from "../cryptor";

describe("Cryptor", () => {
  let cryptor: Cryptor;
  const originalEnv = process.env.APP_SECRET;

  beforeEach(() => {
    // Garantir que APP_SECRET esteja definido para os testes
    process.env.APP_SECRET = "teste-secreto-para-testes-unitarios";
    cryptor = new Cryptor();
  });

  afterEach(() => {
    // Restaurar APP_SECRET original após cada teste
    if (originalEnv === undefined) {
      delete process.env.APP_SECRET;
    } else {
      process.env.APP_SECRET = originalEnv;
    }
  });

  describe("encrypt", () => {
    test("deve criptografar uma string e retornar resultado no formato esperado", () => {
      const texto = "Dados sigilosos para teste";
      const resultado = cryptor.encrypt(texto);

      expect(resultado).toBeDefined();
      expect(typeof resultado).toBe("string");
      expect(resultado?.split(":").length).toBe(2);
    });

    test("deve gerar resultados diferentes para a mesma entrada devido ao IV aleatório", () => {
      const texto = "Mesma mensagem";
      const resultado1 = cryptor.encrypt(texto);
      const resultado2 = cryptor.encrypt(texto);

      expect(resultado1).not.toBe(resultado2);
    });

    test("deve criptografar string vazia", () => {
      const resultado = cryptor.encrypt("");
      expect(resultado).toBeDefined();
      expect(typeof resultado).toBe("string");
    });

    test("deve criptografar texto longo", () => {
      const textoLongo = "a".repeat(10000);
      const resultado = cryptor.encrypt(textoLongo);

      expect(resultado).toBeDefined();
      expect(typeof resultado).toBe("string");
    });

    test("deve retornar undefined se SECRET não estiver definido", () => {
      // Simular SECRET indefinido acessando a propriedade privada
      (cryptor as any).SECRET = null;

      const resultado = cryptor.encrypt("teste");
      expect(resultado).toBeUndefined();
    });
  });

  describe("decrypt", () => {
    test("deve descriptografar corretamente uma string criptografada", () => {
      const original = "Mensagem de teste para descriptografia";
      const criptografado = cryptor.encrypt(original);
      const descriptografado = cryptor.decrypt(criptografado!);

      expect(descriptografado).toBe(original);
    });

    test("deve descriptografar string vazia", () => {
      const criptografado = cryptor.encrypt("");
      const descriptografado = cryptor.decrypt(criptografado!);

      expect(descriptografado).toBe("");
    });

    test("deve descriptografar texto longo", () => {
      const textoLongo = "b".repeat(10000);
      const criptografado = cryptor.encrypt(textoLongo);
      const descriptografado = cryptor.decrypt(criptografado!);

      expect(descriptografado).toBe(textoLongo);
    });

    test("deve retornar undefined se SECRET não estiver definido", () => {
      const criptografado = cryptor.encrypt("teste")!;
      // Simular SECRET indefinido
      (cryptor as any).SECRET = null;

      const resultado = cryptor.decrypt(criptografado);
      expect(resultado).toBeUndefined();
    });

    test("deve lançar erro ao tentar descriptografar dados inválidos", () => {
      expect(() => {
        cryptor.decrypt("formato:invalido:extra");
      }).toThrow();

      expect(() => {
        cryptor.decrypt("dadosinvalidos");
      }).toThrow();

      expect(() => {
        cryptor.decrypt("ABCDEF:GHIJKL"); // Hex inválido
      }).toThrow();
    });
  });

  describe("Fluxo completo de criptografia", () => {
    test("deve manter simetria: encrypt -> decrypt -> original", () => {
      const textos = [
        "Mensagem simples",
        "Caracteres especiais: áéíóúç@#$%&*()_+",
        JSON.stringify({ id: 1, nome: "João Silva", ativo: true }),
        "123456789012345678901234567890", // Teste com string maior que o tamanho do bloco
      ];

      for (const texto of textos) {
        const criptografado = cryptor.encrypt(texto);
        const descriptografado = cryptor.decrypt(criptografado!);

        expect(descriptografado).toBe(texto);
      }
    });
  });

  describe("Comportamento com diferentes APP_SECRET", () => {
    test("não deve descriptografar com uma chave diferente", () => {
      const texto = "Texto secreto";
      const criptografado = cryptor.encrypt(texto);

      // Criar novo cryptor com chave diferente
      process.env.APP_SECRET = "outra-chave-secreta-diferente";
      const outroCryptor = new Cryptor();

      expect(() => {
        outroCryptor.decrypt(criptografado!);
      }).toThrow();
    });
  });
});
