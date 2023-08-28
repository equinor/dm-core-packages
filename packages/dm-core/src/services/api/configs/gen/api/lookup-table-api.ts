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
import { Lookup } from '../models';
/**
 * LookupTableApi - axios parameter creator
 * @export
 */
export const LookupTableApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Creates a Recipe Lookup Table for an Application, given a Package Containing RecipeLinks.  This endpoint creates a lookup table for an application. This lookup table is used to find UI- and Storage recipes given a blueprint. This recipe is associated with an application, based on application name.  Args: - application (str): Name of an application. - recipe_package (list[str]): A list of one or more paths to packages that contain recipe links.     - Example: [\"system/SIMOS/recipe_links\"] - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - None, with status Code 204 (No Content).
         * @summary Create Lookup
         * @param {string} application 
         * @param {Array<string>} recipePackage 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createLookup: async (application: string, recipePackage: Array<string>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'application' is not null or undefined
            assertParamExists('createLookup', 'application', application)
            // verify required parameter 'recipePackage' is not null or undefined
            assertParamExists('createLookup', 'recipePackage', recipePackage)
            const localVarPath = `/api/application/{application}`
                .replace(`{${"application"}}`, encodeURIComponent(String(application)));
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

            if (recipePackage) {
                localVarQueryParameter['recipe_package'] = recipePackage;
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
         * Get The Lookup Table for UI- and Storage Recipes the Provided Application  This endpoint fetches the recipe lookup table for the application provided. This lookup table is used to find UI- and Storage recipes given a blueprint.  Args: - application (str): The name of the desired application. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The recipe lookup table for the provided application.
         * @summary Get Lookup
         * @param {string} application 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLookup: async (application: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'application' is not null or undefined
            assertParamExists('getLookup', 'application', application)
            const localVarPath = `/api/application/{application}`
                .replace(`{${"application"}}`, encodeURIComponent(String(application)));
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
 * LookupTableApi - functional programming interface
 * @export
 */
export const LookupTableApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = LookupTableApiAxiosParamCreator(configuration)
    return {
        /**
         * Creates a Recipe Lookup Table for an Application, given a Package Containing RecipeLinks.  This endpoint creates a lookup table for an application. This lookup table is used to find UI- and Storage recipes given a blueprint. This recipe is associated with an application, based on application name.  Args: - application (str): Name of an application. - recipe_package (list[str]): A list of one or more paths to packages that contain recipe links.     - Example: [\"system/SIMOS/recipe_links\"] - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - None, with status Code 204 (No Content).
         * @summary Create Lookup
         * @param {string} application 
         * @param {Array<string>} recipePackage 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createLookup(application: string, recipePackage: Array<string>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createLookup(application, recipePackage, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Get The Lookup Table for UI- and Storage Recipes the Provided Application  This endpoint fetches the recipe lookup table for the application provided. This lookup table is used to find UI- and Storage recipes given a blueprint.  Args: - application (str): The name of the desired application. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The recipe lookup table for the provided application.
         * @summary Get Lookup
         * @param {string} application 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLookup(application: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Lookup>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getLookup(application, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * LookupTableApi - factory interface
 * @export
 */
export const LookupTableApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = LookupTableApiFp(configuration)
    return {
        /**
         * Creates a Recipe Lookup Table for an Application, given a Package Containing RecipeLinks.  This endpoint creates a lookup table for an application. This lookup table is used to find UI- and Storage recipes given a blueprint. This recipe is associated with an application, based on application name.  Args: - application (str): Name of an application. - recipe_package (list[str]): A list of one or more paths to packages that contain recipe links.     - Example: [\"system/SIMOS/recipe_links\"] - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - None, with status Code 204 (No Content).
         * @summary Create Lookup
         * @param {LookupTableApiCreateLookupRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createLookup(requestParameters: LookupTableApiCreateLookupRequest, options?: AxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.createLookup(requestParameters.application, requestParameters.recipePackage, options).then((request) => request(axios, basePath));
        },
        /**
         * Get The Lookup Table for UI- and Storage Recipes the Provided Application  This endpoint fetches the recipe lookup table for the application provided. This lookup table is used to find UI- and Storage recipes given a blueprint.  Args: - application (str): The name of the desired application. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The recipe lookup table for the provided application.
         * @summary Get Lookup
         * @param {LookupTableApiGetLookupRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLookup(requestParameters: LookupTableApiGetLookupRequest, options?: AxiosRequestConfig): AxiosPromise<Lookup> {
            return localVarFp.getLookup(requestParameters.application, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for createLookup operation in LookupTableApi.
 * @export
 * @interface LookupTableApiCreateLookupRequest
 */
export interface LookupTableApiCreateLookupRequest {
    /**
     * 
     * @type {string}
     * @memberof LookupTableApiCreateLookup
     */
    readonly application: string

    /**
     * 
     * @type {Array<string>}
     * @memberof LookupTableApiCreateLookup
     */
    readonly recipePackage: Array<string>
}

/**
 * Request parameters for getLookup operation in LookupTableApi.
 * @export
 * @interface LookupTableApiGetLookupRequest
 */
export interface LookupTableApiGetLookupRequest {
    /**
     * 
     * @type {string}
     * @memberof LookupTableApiGetLookup
     */
    readonly application: string
}

/**
 * LookupTableApi - object-oriented interface
 * @export
 * @class LookupTableApi
 * @extends {BaseAPI}
 */
export class LookupTableApi extends BaseAPI {
    /**
     * Creates a Recipe Lookup Table for an Application, given a Package Containing RecipeLinks.  This endpoint creates a lookup table for an application. This lookup table is used to find UI- and Storage recipes given a blueprint. This recipe is associated with an application, based on application name.  Args: - application (str): Name of an application. - recipe_package (list[str]): A list of one or more paths to packages that contain recipe links.     - Example: [\"system/SIMOS/recipe_links\"] - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - None, with status Code 204 (No Content).
     * @summary Create Lookup
     * @param {LookupTableApiCreateLookupRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LookupTableApi
     */
    public createLookup(requestParameters: LookupTableApiCreateLookupRequest, options?: AxiosRequestConfig) {
        return LookupTableApiFp(this.configuration).createLookup(requestParameters.application, requestParameters.recipePackage, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get The Lookup Table for UI- and Storage Recipes the Provided Application  This endpoint fetches the recipe lookup table for the application provided. This lookup table is used to find UI- and Storage recipes given a blueprint.  Args: - application (str): The name of the desired application. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The recipe lookup table for the provided application.
     * @summary Get Lookup
     * @param {LookupTableApiGetLookupRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LookupTableApi
     */
    public getLookup(requestParameters: LookupTableApiGetLookupRequest, options?: AxiosRequestConfig) {
        return LookupTableApiFp(this.configuration).getLookup(requestParameters.application, options).then((request) => request(this.axios, this.basePath));
    }
}
