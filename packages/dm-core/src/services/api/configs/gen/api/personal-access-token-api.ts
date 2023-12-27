/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Storage Service
 * API for basic data modelling interaction
 *
 * The version of the OpenAPI document: 1.14.0
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
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import { AccessLevel } from '../models';
// @ts-ignore
import { ErrorResponse } from '../models';
// @ts-ignore
import { PATData } from '../models';
/**
 * PersonalAccessTokenApi - axios parameter creator
 * @export
 */
export const PersonalAccessTokenApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Create a Personal Access Token (PAT).  This endpoint creates a PAT token for the currently logged in user, stores it in the database and returns it to the user.  Args: - scope (WRITE | READ | NONE): Access level for the PAT. - time_to_live (int): Optional parameter specifying the lifespan of the PAT in seconds. Default lifespan is 30 days.  Returns: - str: The generated PAT token
         * @summary New Personal Access Token
         * @param {AccessLevel} [scope] 
         * @param {number} [timeToLive] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        tokenCreate: async (scope?: AccessLevel, timeToLive?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/token`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)

            if (scope !== undefined) {
                localVarQueryParameter['scope'] = scope;
            }

            if (timeToLive !== undefined) {
                localVarQueryParameter['time_to_live'] = timeToLive;
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
         * Revoke a Personal Access Token (PAT).  This endpoint revokes a PAT token so that it is invalid and can no longer be used to gain access.  Args:     token_id (str): The ID of the token to be revoked.  Returns:     str: A string with the message \"OK\" when the token has been revoked.
         * @summary Revoke Personal Access Token
         * @param {string} tokenId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        tokenDelete: async (tokenId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'tokenId' is not null or undefined
            assertParamExists('tokenDelete', 'tokenId', tokenId)
            const localVarPath = `/api/token/{token_id}`
                .replace(`{${"token_id"}}`, encodeURIComponent(String(tokenId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

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
        /**
         * Get All Personal Access Tokens for the Current User.  Get a list of all personal access tokens (PATs) for the currently logged in user.  Args:     user (User): The authenticated user accessing the endpoint.  Returns:     list: A list of all personal access tokens for the currently logged in user.
         * @summary List All Pats
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        tokenListAll: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/token`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

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
 * PersonalAccessTokenApi - functional programming interface
 * @export
 */
export const PersonalAccessTokenApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = PersonalAccessTokenApiAxiosParamCreator(configuration)
    return {
        /**
         * Create a Personal Access Token (PAT).  This endpoint creates a PAT token for the currently logged in user, stores it in the database and returns it to the user.  Args: - scope (WRITE | READ | NONE): Access level for the PAT. - time_to_live (int): Optional parameter specifying the lifespan of the PAT in seconds. Default lifespan is 30 days.  Returns: - str: The generated PAT token
         * @summary New Personal Access Token
         * @param {AccessLevel} [scope] 
         * @param {number} [timeToLive] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async tokenCreate(scope?: AccessLevel, timeToLive?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.tokenCreate(scope, timeToLive, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['PersonalAccessTokenApi.tokenCreate']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * Revoke a Personal Access Token (PAT).  This endpoint revokes a PAT token so that it is invalid and can no longer be used to gain access.  Args:     token_id (str): The ID of the token to be revoked.  Returns:     str: A string with the message \"OK\" when the token has been revoked.
         * @summary Revoke Personal Access Token
         * @param {string} tokenId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async tokenDelete(tokenId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.tokenDelete(tokenId, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['PersonalAccessTokenApi.tokenDelete']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * Get All Personal Access Tokens for the Current User.  Get a list of all personal access tokens (PATs) for the currently logged in user.  Args:     user (User): The authenticated user accessing the endpoint.  Returns:     list: A list of all personal access tokens for the currently logged in user.
         * @summary List All Pats
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async tokenListAll(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<PATData>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.tokenListAll(options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['PersonalAccessTokenApi.tokenListAll']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
    }
};

/**
 * PersonalAccessTokenApi - factory interface
 * @export
 */
export const PersonalAccessTokenApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = PersonalAccessTokenApiFp(configuration)
    return {
        /**
         * Create a Personal Access Token (PAT).  This endpoint creates a PAT token for the currently logged in user, stores it in the database and returns it to the user.  Args: - scope (WRITE | READ | NONE): Access level for the PAT. - time_to_live (int): Optional parameter specifying the lifespan of the PAT in seconds. Default lifespan is 30 days.  Returns: - str: The generated PAT token
         * @summary New Personal Access Token
         * @param {PersonalAccessTokenApiTokenCreateRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        tokenCreate(requestParameters: PersonalAccessTokenApiTokenCreateRequest = {}, options?: AxiosRequestConfig): AxiosPromise<string> {
            return localVarFp.tokenCreate(requestParameters.scope, requestParameters.timeToLive, options).then((request) => request(axios, basePath));
        },
        /**
         * Revoke a Personal Access Token (PAT).  This endpoint revokes a PAT token so that it is invalid and can no longer be used to gain access.  Args:     token_id (str): The ID of the token to be revoked.  Returns:     str: A string with the message \"OK\" when the token has been revoked.
         * @summary Revoke Personal Access Token
         * @param {PersonalAccessTokenApiTokenDeleteRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        tokenDelete(requestParameters: PersonalAccessTokenApiTokenDeleteRequest, options?: AxiosRequestConfig): AxiosPromise<string> {
            return localVarFp.tokenDelete(requestParameters.tokenId, options).then((request) => request(axios, basePath));
        },
        /**
         * Get All Personal Access Tokens for the Current User.  Get a list of all personal access tokens (PATs) for the currently logged in user.  Args:     user (User): The authenticated user accessing the endpoint.  Returns:     list: A list of all personal access tokens for the currently logged in user.
         * @summary List All Pats
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        tokenListAll(options?: AxiosRequestConfig): AxiosPromise<Array<PATData>> {
            return localVarFp.tokenListAll(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for tokenCreate operation in PersonalAccessTokenApi.
 * @export
 * @interface PersonalAccessTokenApiTokenCreateRequest
 */
export interface PersonalAccessTokenApiTokenCreateRequest {
    /**
     * 
     * @type {AccessLevel}
     * @memberof PersonalAccessTokenApiTokenCreate
     */
    readonly scope?: AccessLevel

    /**
     * 
     * @type {number}
     * @memberof PersonalAccessTokenApiTokenCreate
     */
    readonly timeToLive?: number
}

/**
 * Request parameters for tokenDelete operation in PersonalAccessTokenApi.
 * @export
 * @interface PersonalAccessTokenApiTokenDeleteRequest
 */
export interface PersonalAccessTokenApiTokenDeleteRequest {
    /**
     * 
     * @type {string}
     * @memberof PersonalAccessTokenApiTokenDelete
     */
    readonly tokenId: string
}

/**
 * PersonalAccessTokenApi - object-oriented interface
 * @export
 * @class PersonalAccessTokenApi
 * @extends {BaseAPI}
 */
export class PersonalAccessTokenApi extends BaseAPI {
    /**
     * Create a Personal Access Token (PAT).  This endpoint creates a PAT token for the currently logged in user, stores it in the database and returns it to the user.  Args: - scope (WRITE | READ | NONE): Access level for the PAT. - time_to_live (int): Optional parameter specifying the lifespan of the PAT in seconds. Default lifespan is 30 days.  Returns: - str: The generated PAT token
     * @summary New Personal Access Token
     * @param {PersonalAccessTokenApiTokenCreateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PersonalAccessTokenApi
     */
    public tokenCreate(requestParameters: PersonalAccessTokenApiTokenCreateRequest = {}, options?: AxiosRequestConfig) {
        return PersonalAccessTokenApiFp(this.configuration).tokenCreate(requestParameters.scope, requestParameters.timeToLive, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Revoke a Personal Access Token (PAT).  This endpoint revokes a PAT token so that it is invalid and can no longer be used to gain access.  Args:     token_id (str): The ID of the token to be revoked.  Returns:     str: A string with the message \"OK\" when the token has been revoked.
     * @summary Revoke Personal Access Token
     * @param {PersonalAccessTokenApiTokenDeleteRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PersonalAccessTokenApi
     */
    public tokenDelete(requestParameters: PersonalAccessTokenApiTokenDeleteRequest, options?: AxiosRequestConfig) {
        return PersonalAccessTokenApiFp(this.configuration).tokenDelete(requestParameters.tokenId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get All Personal Access Tokens for the Current User.  Get a list of all personal access tokens (PATs) for the currently logged in user.  Args:     user (User): The authenticated user accessing the endpoint.  Returns:     list: A list of all personal access tokens for the currently logged in user.
     * @summary List All Pats
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PersonalAccessTokenApi
     */
    public tokenListAll(options?: AxiosRequestConfig) {
        return PersonalAccessTokenApiFp(this.configuration).tokenListAll(options).then((request) => request(this.axios, this.basePath));
    }
}

