import crypto from "crypto";

export default class Cryptor {
  private SECRET: Buffer;
  private readonly IV_LENGTH = 16;
  
  constructor() {
    this.SECRET = Buffer.alloc(32, process.env.APP_SECRET);
  };

  public random() {
    const { randomBytes } = crypto;
    const random = randomBytes(this.IV_LENGTH * 2);

    return random.toString("hex");
  }

  public encrypt(arg: string) {
    if (!this.SECRET) return;
    const { randomBytes, createCipheriv } = crypto;

    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv("aes-256-cbc", this.SECRET, iv);
    const encrypted = Buffer.concat([
      cipher.update(arg, "utf-8"),
      cipher.final(),
    ]);

    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  }

  public decrypt(arg: string) {
    if (!this.SECRET) return;
    const { createDecipheriv } = crypto;

    const [iv, encryptedData] = arg
      .split(":")
      .map((part) => Buffer.from(part, "hex"));
    const decipher = createDecipheriv("aes-256-cbc", this.SECRET, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return decrypted.toString();
  }
}
