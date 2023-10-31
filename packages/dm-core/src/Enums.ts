/**
 * An enum with paths to various blueprint types
 *
 * @docs Enums
 */
export enum EBlueprint {
  /** Path to the Blueprint blueprint */
  BLUEPRINT = 'dmss://system/SIMOS/Blueprint',
  /** Path to the BlueprintAttribute blueprint */
  ATTRIBUTE = 'dmss://system/SIMOS/BlueprintAttribute',
  /** Path to the Package blueprint */
  PACKAGE = 'dmss://system/SIMOS/Package',
  /** Path to the Entity blueprint */
  ENTITY = 'dmss://system/SIMOS/Entity',
  /** Path to the Enum blueprint */
  ENUM = 'dmss://system/SIMOS/Enum',
  /** Path to the Job blueprint */
  JOB = 'dmss://WorkflowDS/Blueprints/Job',
  CRON_JOB = 'dmss://WorkflowDS/Blueprints/CronJob',
  REFERENCE = 'dmss://system/SIMOS/Reference',
  FILE = 'dmss://system/SIMOS/File',
}
