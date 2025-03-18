export default class Repository<
  _T,
  IncludeType extends Record<string, any> = {}
> {
  protected fields: (keyof IncludeType)[] = [];

  protected getIncludes(): Partial<IncludeType> {
    return Object.fromEntries(
      this.fields.map((key) => [key, true])
    ) as Partial<IncludeType>;
  }

  public include<K extends keyof IncludeType>(key: K): this {
    this.fields.push(key);
    return this;
  }

  public includes<K extends keyof IncludeType>(keys: K[]): this {
    this.fields.push(...keys);
    return this;
  }
}
