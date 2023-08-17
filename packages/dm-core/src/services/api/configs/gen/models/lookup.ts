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
import { Recipe } from './recipe';
// May contain unused imports in some cases
// @ts-ignore
import { StorageRecipe } from './storage-recipe';

/**
 * 
 * @export
 * @interface Lookup
 */
export interface Lookup {
    /**
     * 
     * @type {{ [key: string]: Array<Recipe>; }}
     * @memberof Lookup
     */
    'uiRecipes'?: { [key: string]: Array<Recipe>; };
    /**
     * 
     * @type {{ [key: string]: Array<StorageRecipe>; }}
     * @memberof Lookup
     */
    'storageRecipes'?: { [key: string]: Array<StorageRecipe>; };
    /**
     * 
     * @type {{ [key: string]: Recipe; }}
     * @memberof Lookup
     */
    'initialUiRecipes'?: { [key: string]: Recipe; };
    /**
     * 
     * @type {{ [key: string]: Array<string>; }}
     * @memberof Lookup
     */
    'extends'?: { [key: string]: Array<string>; };
}

