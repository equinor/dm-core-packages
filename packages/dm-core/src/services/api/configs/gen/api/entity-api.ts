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


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { Entity } from '../models';
// @ts-ignore
import { ErrorResponse } from '../models';
/**
 * EntityApi - axios parameter creator
 * @export
 */
export const EntityApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Returns a default entity of specified type. This entity is not stored in the database.  This endpoint creates a default entity of the specified type. A default entity of that type is specified to contain all the required fields with their default values. If no default value is set for the field, then an \'empty\' value will be set for that field. For an int that would be 0, and for a string that would be \"\". Optional attributes are not filled in, even if a default value is specified for that optional field.  Args: - entity (Entity): A JSON object with only a \"type\" parameter. Any other fields will be ignored. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: A default entity of the specified type.
         * @summary Instantiate
         * @param {Entity} entity 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        instantiateEntity: async (entity: Entity, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'entity' is not null or undefined
            assertParamExists('instantiateEntity', 'entity', entity)
            const localVarPath = `/api/entity`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(entity, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Validate an entity according to its blueprint.  This endpoint compares the entity to the specifications of its blueprint. The entity\'s blueprint is specified as the \'type\' parameter. The entity is required to have all attributes that are specified as required in the blueprint, and they must be on the correct format.  This endpoint returns a detailed error messages and status code 422 if the entity is invalid.  Args: - entity (Entity): a dict object with \"type\" specified.  Returns: - str: \"OK\" (200)
         * @summary Validate
         * @param {Entity} entity 
         * @param {string} [asType] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        validateEntity: async (entity: Entity, asType?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'entity' is not null or undefined
            assertParamExists('validateEntity', 'entity', entity)
            const localVarPath = `/api/entity/validate`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)

            if (asType !== undefined) {
                localVarQueryParameter['as_type'] = asType;
            }


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(entity, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Validate an entity stored in the database according to its blueprint .  This endpoint compares the entity to the specifications of its blueprint. The entity\'s blueprint is specified as the \'type\' parameter. The entity is required to have all attributes that are specified as required in the blueprint, and they must be on the correct format.  This endpoint returns a detailed error messages and status code 422 if the entity is invalid.  Args: - address (str): address path to the entity that is to be validated. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - str: \"OK\" (200)
         * @summary Validate Existing
         * @param {string} address 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        validateExistingEntity: async (address: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'address' is not null or undefined
            assertParamExists('validateExistingEntity', 'address', address)
            const localVarPath = `/api/entity/validate-existing-entity/{address}`
                .replace(`{${"address"}}`, encodeURIComponent(String(address)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * EntityApi - functional programming interface
 * @export
 */
export const EntityApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = EntityApiAxiosParamCreator(configuration)
    return {
        /**
         * Returns a default entity of specified type. This entity is not stored in the database.  This endpoint creates a default entity of the specified type. A default entity of that type is specified to contain all the required fields with their default values. If no default value is set for the field, then an \'empty\' value will be set for that field. For an int that would be 0, and for a string that would be \"\". Optional attributes are not filled in, even if a default value is specified for that optional field.  Args: - entity (Entity): A JSON object with only a \"type\" parameter. Any other fields will be ignored. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: A default entity of the specified type.
         * @summary Instantiate
         * @param {Entity} entity 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async instantiateEntity(entity: Entity, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.instantiateEntity(entity, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Validate an entity according to its blueprint.  This endpoint compares the entity to the specifications of its blueprint. The entity\'s blueprint is specified as the \'type\' parameter. The entity is required to have all attributes that are specified as required in the blueprint, and they must be on the correct format.  This endpoint returns a detailed error messages and status code 422 if the entity is invalid.  Args: - entity (Entity): a dict object with \"type\" specified.  Returns: - str: \"OK\" (200)
         * @summary Validate
         * @param {Entity} entity 
         * @param {string} [asType] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async validateEntity(entity: Entity, asType?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.validateEntity(entity, asType, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Validate an entity stored in the database according to its blueprint .  This endpoint compares the entity to the specifications of its blueprint. The entity\'s blueprint is specified as the \'type\' parameter. The entity is required to have all attributes that are specified as required in the blueprint, and they must be on the correct format.  This endpoint returns a detailed error messages and status code 422 if the entity is invalid.  Args: - address (str): address path to the entity that is to be validated. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - str: \"OK\" (200)
         * @summary Validate Existing
         * @param {string} address 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async validateExistingEntity(address: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.validateExistingEntity(address, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * EntityApi - factory interface
 * @export
 */
export const EntityApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = EntityApiFp(configuration)
    return {
        /**
         * Returns a default entity of specified type. This entity is not stored in the database.  This endpoint creates a default entity of the specified type. A default entity of that type is specified to contain all the required fields with their default values. If no default value is set for the field, then an \'empty\' value will be set for that field. For an int that would be 0, and for a string that would be \"\". Optional attributes are not filled in, even if a default value is specified for that optional field.  Args: - entity (Entity): A JSON object with only a \"type\" parameter. Any other fields will be ignored. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: A default entity of the specified type.
         * @summary Instantiate
         * @param {EntityApiInstantiateEntityRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        instantiateEntity(requestParameters: EntityApiInstantiateEntityRequest, options?: AxiosRequestConfig): AxiosPromise<object> {
            return localVarFp.instantiateEntity(requestParameters.entity, options).then((request) => request(axios, basePath));
        },
        /**
         * Validate an entity according to its blueprint.  This endpoint compares the entity to the specifications of its blueprint. The entity\'s blueprint is specified as the \'type\' parameter. The entity is required to have all attributes that are specified as required in the blueprint, and they must be on the correct format.  This endpoint returns a detailed error messages and status code 422 if the entity is invalid.  Args: - entity (Entity): a dict object with \"type\" specified.  Returns: - str: \"OK\" (200)
         * @summary Validate
         * @param {EntityApiValidateEntityRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        validateEntity(requestParameters: EntityApiValidateEntityRequest, options?: AxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.validateEntity(requestParameters.entity, requestParameters.asType, options).then((request) => request(axios, basePath));
        },
        /**
         * Validate an entity stored in the database according to its blueprint .  This endpoint compares the entity to the specifications of its blueprint. The entity\'s blueprint is specified as the \'type\' parameter. The entity is required to have all attributes that are specified as required in the blueprint, and they must be on the correct format.  This endpoint returns a detailed error messages and status code 422 if the entity is invalid.  Args: - address (str): address path to the entity that is to be validated. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - str: \"OK\" (200)
         * @summary Validate Existing
         * @param {EntityApiValidateExistingEntityRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        validateExistingEntity(requestParameters: EntityApiValidateExistingEntityRequest, options?: AxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.validateExistingEntity(requestParameters.address, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for instantiateEntity operation in EntityApi.
 * @export
 * @interface EntityApiInstantiateEntityRequest
 */
export interface EntityApiInstantiateEntityRequest {
    /**
     * 
     * @type {Entity}
     * @memberof EntityApiInstantiateEntity
     */
    readonly entity: Entity
}

/**
 * Request parameters for validateEntity operation in EntityApi.
 * @export
 * @interface EntityApiValidateEntityRequest
 */
export interface EntityApiValidateEntityRequest {
    /**
     * 
     * @type {Entity}
     * @memberof EntityApiValidateEntity
     */
    readonly entity: Entity

    /**
     * 
     * @type {string}
     * @memberof EntityApiValidateEntity
     */
    readonly asType?: string
}

/**
 * Request parameters for validateExistingEntity operation in EntityApi.
 * @export
 * @interface EntityApiValidateExistingEntityRequest
 */
export interface EntityApiValidateExistingEntityRequest {
    /**
     * 
     * @type {string}
     * @memberof EntityApiValidateExistingEntity
     */
    readonly address: string
}

/**
 * EntityApi - object-oriented interface
 * @export
 * @class EntityApi
 * @extends {BaseAPI}
 */
export class EntityApi extends BaseAPI {
    /**
     * Returns a default entity of specified type. This entity is not stored in the database.  This endpoint creates a default entity of the specified type. A default entity of that type is specified to contain all the required fields with their default values. If no default value is set for the field, then an \'empty\' value will be set for that field. For an int that would be 0, and for a string that would be \"\". Optional attributes are not filled in, even if a default value is specified for that optional field.  Args: - entity (Entity): A JSON object with only a \"type\" parameter. Any other fields will be ignored. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: A default entity of the specified type.
     * @summary Instantiate
     * @param {EntityApiInstantiateEntityRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EntityApi
     */
    public instantiateEntity(requestParameters: EntityApiInstantiateEntityRequest, options?: AxiosRequestConfig) {
        return EntityApiFp(this.configuration).instantiateEntity(requestParameters.entity, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Validate an entity according to its blueprint.  This endpoint compares the entity to the specifications of its blueprint. The entity\'s blueprint is specified as the \'type\' parameter. The entity is required to have all attributes that are specified as required in the blueprint, and they must be on the correct format.  This endpoint returns a detailed error messages and status code 422 if the entity is invalid.  Args: - entity (Entity): a dict object with \"type\" specified.  Returns: - str: \"OK\" (200)
     * @summary Validate
     * @param {EntityApiValidateEntityRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EntityApi
     */
    public validateEntity(requestParameters: EntityApiValidateEntityRequest, options?: AxiosRequestConfig) {
        return EntityApiFp(this.configuration).validateEntity(requestParameters.entity, requestParameters.asType, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Validate an entity stored in the database according to its blueprint .  This endpoint compares the entity to the specifications of its blueprint. The entity\'s blueprint is specified as the \'type\' parameter. The entity is required to have all attributes that are specified as required in the blueprint, and they must be on the correct format.  This endpoint returns a detailed error messages and status code 422 if the entity is invalid.  Args: - address (str): address path to the entity that is to be validated. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - str: \"OK\" (200)
     * @summary Validate Existing
     * @param {EntityApiValidateExistingEntityRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EntityApi
     */
    public validateExistingEntity(requestParameters: EntityApiValidateExistingEntityRequest, options?: AxiosRequestConfig) {
        return EntityApiFp(this.configuration).validateExistingEntity(requestParameters.address, options).then((request) => request(this.axios, this.basePath));
    }
}
