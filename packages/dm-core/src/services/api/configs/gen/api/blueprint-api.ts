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


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { ErrorResponse } from '../models';
// @ts-ignore
import { GetBlueprintResponse } from '../models';
/**
 * BlueprintApi - axios parameter creator
 * @export
 */
export const BlueprintApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get a Blueprint and all Ui- and StorageRecipes connected to it, given a Blueprint address.  Args: - type_ref (str): The address of the blueprint.     - Example: PROTOCOL://<DATA-SOURCE>/<PACKAGE>/<FOLDER>/<NAME> - context (str): Optional name of application that has Ui-/StorageRecipe lookup table. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - GetBlueprintResponse: An object containing the blueprint, a list of all UI- recipes and a list of all StorageRecipes.
         * @summary Get Blueprint
         * @param {string} typeRef 
         * @param {string} [context] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        blueprintGet: async (typeRef: string, context?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'typeRef' is not null or undefined
            assertParamExists('blueprintGet', 'typeRef', typeRef)
            const localVarPath = `/api/blueprint/{type_ref}`
                .replace(`{${"type_ref"}}`, encodeURIComponent(String(typeRef)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)

            if (context !== undefined) {
                localVarQueryParameter['context'] = context;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Resolve path address of a blueprint given id address.  This endpoint takes in an ID-address of a blueprint and finds the full path address to the blueprint.  Args: - address (str): The ID address of the blueprint.     - Example: PROTOCOL://<DATA-SOURCE>/$<UUID>  Returns: - str: the path address of the blueprint.     - Example:  PROTOCOL://<DATA-SOURCE>/<PACKAGE>/<FOLDER>/<NAME>
         * @summary Resolve Blueprint Id
         * @param {string} address 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        blueprintResolve: async (address: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'address' is not null or undefined
            assertParamExists('blueprintResolve', 'address', address)
            const localVarPath = `/api/resolve-path/{address}`
                .replace(`{${"address"}}`, encodeURIComponent(String(address)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
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
 * BlueprintApi - functional programming interface
 * @export
 */
export const BlueprintApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = BlueprintApiAxiosParamCreator(configuration)
    return {
        /**
         * Get a Blueprint and all Ui- and StorageRecipes connected to it, given a Blueprint address.  Args: - type_ref (str): The address of the blueprint.     - Example: PROTOCOL://<DATA-SOURCE>/<PACKAGE>/<FOLDER>/<NAME> - context (str): Optional name of application that has Ui-/StorageRecipe lookup table. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - GetBlueprintResponse: An object containing the blueprint, a list of all UI- recipes and a list of all StorageRecipes.
         * @summary Get Blueprint
         * @param {string} typeRef 
         * @param {string} [context] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async blueprintGet(typeRef: string, context?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetBlueprintResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.blueprintGet(typeRef, context, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Resolve path address of a blueprint given id address.  This endpoint takes in an ID-address of a blueprint and finds the full path address to the blueprint.  Args: - address (str): The ID address of the blueprint.     - Example: PROTOCOL://<DATA-SOURCE>/$<UUID>  Returns: - str: the path address of the blueprint.     - Example:  PROTOCOL://<DATA-SOURCE>/<PACKAGE>/<FOLDER>/<NAME>
         * @summary Resolve Blueprint Id
         * @param {string} address 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async blueprintResolve(address: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.blueprintResolve(address, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * BlueprintApi - factory interface
 * @export
 */
export const BlueprintApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = BlueprintApiFp(configuration)
    return {
        /**
         * Get a Blueprint and all Ui- and StorageRecipes connected to it, given a Blueprint address.  Args: - type_ref (str): The address of the blueprint.     - Example: PROTOCOL://<DATA-SOURCE>/<PACKAGE>/<FOLDER>/<NAME> - context (str): Optional name of application that has Ui-/StorageRecipe lookup table. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - GetBlueprintResponse: An object containing the blueprint, a list of all UI- recipes and a list of all StorageRecipes.
         * @summary Get Blueprint
         * @param {BlueprintApiBlueprintGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        blueprintGet(requestParameters: BlueprintApiBlueprintGetRequest, options?: AxiosRequestConfig): AxiosPromise<GetBlueprintResponse> {
            return localVarFp.blueprintGet(requestParameters.typeRef, requestParameters.context, options).then((request) => request(axios, basePath));
        },
        /**
         * Resolve path address of a blueprint given id address.  This endpoint takes in an ID-address of a blueprint and finds the full path address to the blueprint.  Args: - address (str): The ID address of the blueprint.     - Example: PROTOCOL://<DATA-SOURCE>/$<UUID>  Returns: - str: the path address of the blueprint.     - Example:  PROTOCOL://<DATA-SOURCE>/<PACKAGE>/<FOLDER>/<NAME>
         * @summary Resolve Blueprint Id
         * @param {BlueprintApiBlueprintResolveRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        blueprintResolve(requestParameters: BlueprintApiBlueprintResolveRequest, options?: AxiosRequestConfig): AxiosPromise<string> {
            return localVarFp.blueprintResolve(requestParameters.address, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for blueprintGet operation in BlueprintApi.
 * @export
 * @interface BlueprintApiBlueprintGetRequest
 */
export interface BlueprintApiBlueprintGetRequest {
    /**
     * 
     * @type {string}
     * @memberof BlueprintApiBlueprintGet
     */
    readonly typeRef: string

    /**
     * 
     * @type {string}
     * @memberof BlueprintApiBlueprintGet
     */
    readonly context?: string
}

/**
 * Request parameters for blueprintResolve operation in BlueprintApi.
 * @export
 * @interface BlueprintApiBlueprintResolveRequest
 */
export interface BlueprintApiBlueprintResolveRequest {
    /**
     * 
     * @type {string}
     * @memberof BlueprintApiBlueprintResolve
     */
    readonly address: string
}

/**
 * BlueprintApi - object-oriented interface
 * @export
 * @class BlueprintApi
 * @extends {BaseAPI}
 */
export class BlueprintApi extends BaseAPI {
    /**
     * Get a Blueprint and all Ui- and StorageRecipes connected to it, given a Blueprint address.  Args: - type_ref (str): The address of the blueprint.     - Example: PROTOCOL://<DATA-SOURCE>/<PACKAGE>/<FOLDER>/<NAME> - context (str): Optional name of application that has Ui-/StorageRecipe lookup table. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - GetBlueprintResponse: An object containing the blueprint, a list of all UI- recipes and a list of all StorageRecipes.
     * @summary Get Blueprint
     * @param {BlueprintApiBlueprintGetRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BlueprintApi
     */
    public blueprintGet(requestParameters: BlueprintApiBlueprintGetRequest, options?: AxiosRequestConfig) {
        return BlueprintApiFp(this.configuration).blueprintGet(requestParameters.typeRef, requestParameters.context, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Resolve path address of a blueprint given id address.  This endpoint takes in an ID-address of a blueprint and finds the full path address to the blueprint.  Args: - address (str): The ID address of the blueprint.     - Example: PROTOCOL://<DATA-SOURCE>/$<UUID>  Returns: - str: the path address of the blueprint.     - Example:  PROTOCOL://<DATA-SOURCE>/<PACKAGE>/<FOLDER>/<NAME>
     * @summary Resolve Blueprint Id
     * @param {BlueprintApiBlueprintResolveRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BlueprintApi
     */
    public blueprintResolve(requestParameters: BlueprintApiBlueprintResolveRequest, options?: AxiosRequestConfig) {
        return BlueprintApiFp(this.configuration).blueprintResolve(requestParameters.address, options).then((request) => request(this.axios, this.basePath));
    }
}
