/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Storage Service
 * API for basic data modelling interaction
 *
 * The version of the OpenAPI document: 1.6.4
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import { Repository } from './repository';

/**
 * 
 * @export
 * @interface DataSourceRequest
 */
export interface DataSourceRequest {
    /**
     * 
     * @type {string}
     * @memberof DataSourceRequest
     */
    'name': string;
    /**
     * 
     * @type {{ [key: string]: Repository; }}
     * @memberof DataSourceRequest
     */
    'repositories': { [key: string]: Repository; };
}

