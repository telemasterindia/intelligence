export class BaseIntelligenceEngine {
  constructor({ name, version }) {
    this.name = name;
    this.version = version;
  }

  async execute() {
    throw new Error(`${this.name} must implement execute().`);
  }
}
