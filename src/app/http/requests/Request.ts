import ValidationHelper from "@/app/helpers/ValidationHelper";
import { Validator } from "@courseinstructor/validator";
import { ValidationError } from "../errors/ValidationError";
import { Request as ExpressRequest } from "express";

/**
 * Interface para requisições HTTP
 * Define os métodos necessários para validação e manipulação de dados de requisição
 */
export interface IRequest {
  /**
   * Valida os dados da requisição de forma assíncrona
   * @returns Promise<boolean> - Verdadeiro se a validação for bem-sucedida
   */
  validateAsync(): Promise<boolean>;
  /**
   * Verifica se há erros de validação
   * @returns string[] - Array com mensagens de erro
   */
  hasErrors(): string[];
  /**
   * Retorna os dados da requisição convertidos para o tipo especificado
   * @template T - Tipo para o qual os dados serão convertidos
   * @returns T - Dados da requisição no tipo especificado
   */
  getData<T>(): T;
}

/**
 * Classe base para validação de requisições HTTP
 * Implementa IRequest e fornece funcionalidades de validação para dados recebidos
 */
export default class Request implements IRequest {
  protected errors: string[] = [];
  protected data: Record<string, any>;
  private ignoredFields: string[] = [];
  /**
   * Cria uma nova instância de Request
   *
   * @param req - Objeto de requisição do Express
   * @param requiredFields - Array com campos obrigatórios da requisição
   * @param helper - Instância do ValidationHelper para auxiliar na validação
   */
  constructor(
    protected req: ExpressRequest,
    private requiredFields: string[],
    protected helper = new ValidationHelper()
  ) {
    this.data = req.body || {};
  }
  /**
   * Valida todos os campos e regras da requisição
   *
   * @returns Promise<boolean> - Verdadeiro se a validação for bem-sucedida
   * @throws ValidationError - Lançada se houver erros de validação
   */
  public async validateAsync(): Promise<boolean> {
    this.errors = [];

    if (typeof this.data === "undefined") {
      this.errors.push(this.req.t("validation.failed"));
      throw new ValidationError(this.errors);
    }

    for (const field of this.requiredFields) {
      if (!(field in this.data) && !this.fieldIsIgnored(field)) {
        this.errors.push(
          this.req.t("validation.missing", {
            field: field,
          })
        );
        throw new ValidationError(this.errors);
      }
    }

    await this.applyRulesAsync();

    if (this.errors.length > 0) {
      throw new ValidationError(this.errors);
    }

    return true;
  }
  /**
   * Método base para validações personalizadas
   * Pode ser sobrescrito por classes filhas para adicionar validações específicas
   *
   * @returns boolean - Sempre retorna true na implementação base
   */
  protected validation(): boolean {
    return true;
  }
  /**
   * Aplica as regras de validação definidas em rules() para cada campo
   * Processa transformações e verificações de unicidade
   *
   * @private
   */
  private async applyRulesAsync() {
    const rules = this.rules();

    for (const [field, ruleString] of Object.entries(rules)) {
      const value = this.data[field];
      const ruleList = ruleString.split("|");

      for (const rule of ruleList) {
        if (this.fieldIsIgnored(field)) return;

        const validator = new Validator(rule, field, value, this.req.t);
        const validationResult = validator.validate();
        const fnTransform = /(?<=transform)\./;

        if (validationResult && fnTransform.test(validationResult)) {
          const transformedValue = validationResult.split(fnTransform)[1];
          this.data[field] = transformedValue;
        }

        if (
          validationResult &&
          !fnTransform.test(validationResult)
        ) {
          this.errors.push(validationResult);
        }

        const uniqueMatch = rule.match(/^unique:([\w_]+)$/);
        if (uniqueMatch) {
          const tableName = uniqueMatch[1];
          const isUnique = await this.helper.unique(tableName, field, value);

          if (!isUnique) {
            this.errors.push(`${tableName} already exists`);
          }
        }
      }
    }
  }
  /**
   * Define as regras de validação para os campos da requisição
   * Deve ser sobrescrita por classes filhas para especificar regras personalizadas
   *
   * @returns Record<string, string> - Objeto com campos e suas respectivas regras separadas por pipe (|)
   * @example
   * protected rules(): Record<string, string> {
   *   return {
   *     email: "string|email|transform:lower",
   *     password: "string|min:6",
   *     username: "string|min:6|max:40|transform:camel"
   *   };
   * }
   */
  protected rules(): Record<string, string> {
    return {};
  }
  /**
   * Retorna as mensagens de erro encontradas durante a validação
   *
   * @returns string[] - Array com mensagens de erro
   */
  public hasErrors(): string[] {
    return this.errors;
  }

  protected fieldIsIgnored(key: string): boolean {
    return this.ignoredFields.includes(key);
  }

  public ignoreFields(fields: string[]) {
    fields.map((field) => {
      if (this.ignoredFields.includes(field)) {
        throw new Error(`${field} already exists in ignore list`)
      }

      this.ignoredFields.push(field)
    })

    return this;
  }

  public ignoreField(field: string) {
    if (this.fieldIsIgnored(field)) {
      throw new Error(`${field} already in ignore list`);
    }

    this.ignoredFields.push(field);

    return this;
  }
  /**
   * Acrescenta campos adicionais aos dados da requisição após a validação
   * Útil para adicionar valores que não existiam originalmente na requisição
   *
   * @template T - Tipo do valor a ser adicionado
   * @param key - Chave do valor para acrescentar
   * @param value - Valor a ser adicionado
   * @returns this - Retorna a instância atual para permitir encadeamento
   */
  public appendField<T>(key: string, value: T): this {
    this.data[key] = value;
    return this;
  }
  /**
   * Retorna os dados validados da requisição convertidos para o tipo especificado
   *
   * @template T - Tipo para o qual os dados serão convertidos
   * @returns T - Dados da requisição no tipo especificado
   */
  public getData<T>(): T {
    return this.data as T;
  }
}
