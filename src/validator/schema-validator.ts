import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export class SchemaValidator {
  private ajv: any;
  private manifestValidator: any;
  private shardValidator: any;
  private stateValidator: any;
  private sessionValidator: any;

  constructor(schemasDir: string = "./schemas") {
    this.ajv = new (Ajv2020 as any)({ allErrors: true, strict: false });
    (addFormats as any)(this.ajv);

    const manifestSchema = JSON.parse(
      readFileSync(join(schemasDir, "curriculum-manifest.schema.json"), "utf-8")
    );
    const shardSchema = JSON.parse(
      readFileSync(join(schemasDir, "node-shard.schema.json"), "utf-8")
    );
    const stateSchema = JSON.parse(
      readFileSync(join(schemasDir, "learner-state.schema.json"), "utf-8")
    );
    const sessionSchema = JSON.parse(
      readFileSync(join(schemasDir, "session-interaction.schema.json"), "utf-8")
    );

    this.manifestValidator = this.ajv.compile(manifestSchema);
    this.shardValidator = this.ajv.compile(shardSchema);
    this.stateValidator = this.ajv.compile(stateSchema);
    this.sessionValidator = this.ajv.compile(sessionSchema);
  }

  public validateManifest(data: unknown): { valid: boolean; errors?: string[] } {
    const valid = this.manifestValidator(data);
    if (!valid) {
      return {
        valid: false,
        errors: this.manifestValidator.errors?.map(
          (e: any) => `${e.instancePath || "/"}: ${e.message}`
        ),
      };
    }
    return { valid: true };
  }

  public validateShard(data: unknown): { valid: boolean; errors?: string[] } {
    const valid = this.shardValidator(data);
    if (!valid) {
      return {
        valid: false,
        errors: this.shardValidator.errors?.map(
          (e: any) => `${e.instancePath || "/"}: ${e.message}`
        ),
      };
    }
    return { valid: true };
  }

  public validateState(data: unknown): { valid: boolean; errors?: string[] } {
    const valid = this.stateValidator(data);
    if (!valid) {
      return {
        valid: false,
        errors: this.stateValidator.errors?.map(
          (e: any) => `${e.instancePath || "/"}: ${e.message}`
        ),
      };
    }
    return { valid: true };
  }

  public validateSession(data: unknown): { valid: boolean; errors?: string[] } {
    const valid = this.sessionValidator(data);
    if (!valid) {
      return {
        valid: false,
        errors: this.sessionValidator.errors?.map(
          (e: any) => `${e.instancePath || "/"}: ${e.message}`
        ),
      };
    }
    return { valid: true };
  }
}
