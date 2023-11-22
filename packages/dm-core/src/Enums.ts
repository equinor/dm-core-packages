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
  RECURRING_JOB = 'dmss://WorkflowDS/Blueprints/RecurringJob',
  RECURRING_JOB_HANDLER = 'dmss://WorkflowDS/Blueprints/RecurringJobHandler',

  CRON_JOB = 'dmss://WorkflowDS/Blueprints/CronJob',
  REFERENCE = 'dmss://system/SIMOS/Reference',
  FILE = 'dmss://system/SIMOS/File',
}

export enum EPrimitiveTypes {
  string,
  number,
  boolean,
}
