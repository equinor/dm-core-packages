/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Storage Service
 * API for basic data modelling interaction
 *
 * The version of the OpenAPI document: 1.2.3
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import { StorageAttribute } from './storage-attribute';
// May contain unused imports in some cases
// @ts-ignore
import { StorageDataTypes } from './storage-data-types';

/**
 * 
 * @export
 * @interface StorageRecipe
 */
export interface StorageRecipe {
    /**
     * 
     * @type {string}
     * @memberof StorageRecipe
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof StorageRecipe
     */
    'type'?: string;
    /**
     * 
     * @type {{ [key: string]: StorageAttribute; }}
     * @memberof StorageRecipe
     */
    'attributes'?: { [key: string]: StorageAttribute; };
    /**
     * 
     * @type {StorageDataTypes}
     * @memberof StorageRecipe
     */
    'storageAffinity'?: StorageDataTypes;
    /**
     * 
     * @type {string}
     * @memberof StorageRecipe
     */
    'description'?: string;
}



