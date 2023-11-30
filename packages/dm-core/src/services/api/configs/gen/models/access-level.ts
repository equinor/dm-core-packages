/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Storage Service
 * API for basic data modelling interaction
 *
 * The version of the OpenAPI document: 1.12.0
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

export const AccessLevel = {
    WRITE: 'WRITE',
    READ: 'READ',
    NONE: 'NONE'
} as const;

export type AccessLevel = typeof AccessLevel[keyof typeof AccessLevel];



