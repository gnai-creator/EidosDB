import { validarLicenca } from "../src/utils/license";

describe("validação de licença", () => {
  const OLD_ENV = { ...process.env };

  afterEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("lança erro quando licença não é aceita", () => {
    process.env.NODE_ENV = "production";
    delete process.env.EIDOS_ACCEPT_LICENSE;
    expect(() => validarLicenca()).toThrow("Licença não aceita");
  });

  it("permite execução quando licença é aceita", () => {
    process.env.NODE_ENV = "production";
    process.env.EIDOS_ACCEPT_LICENSE = "true";
    expect(() => validarLicenca()).not.toThrow();
  });
});
