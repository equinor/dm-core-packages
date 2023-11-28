/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Job API
 * REST API used with the Data Modelling framework to schedule jobs
 *
 * The version of the OpenAPI document: 1.4.2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



/**
 * An enumeration.
 * @export
 * @enum {string}
 */

export const JobStatus = {
    Registered: 'registered',
    NotStarted: 'not started',
    Starting: 'starting',
    Running: 'running',
    Failed: 'failed',
    Completed: 'completed',
    Removed: 'removed',
    Unknown: 'unknown'
} as const;

export type JobStatus = typeof JobStatus[keyof typeof JobStatus];



