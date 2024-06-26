/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Storage Service
 * API for basic data modelling interaction
 *
 * The version of the OpenAPI document: 1.26.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import { Dependency } from './dependency';

/**
 * 
 * @export
 * @interface ExportMetaResponse
 */
export interface ExportMetaResponse {
    /**
     * 
     * @type {string}
     * @memberof ExportMetaResponse
     */
    'type'?: string;
    /**
     * 
     * @type {string}
     * @memberof ExportMetaResponse
     */
    'version'?: string;
    /**
     * 
     * @type {Array<Dependency>}
     * @memberof ExportMetaResponse
     */
    'dependencies'?: Array<Dependency>;
}

