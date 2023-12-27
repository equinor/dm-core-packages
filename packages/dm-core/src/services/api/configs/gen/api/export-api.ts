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
import { ErrorResponse } from '../models';
// @ts-ignore
import { ExportMetaResponse } from '../models';
/**
 * ExportApi - axios parameter creator
 * @export
 */
export const ExportApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Download a zip-folder Containing One or More Documents as JSON Files.  This endpoint creates a zip-folder with the contents of the document and it\'s children.  Args: - path_address: Address to the entity or package that should be exported.   - Example: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY (PROTOCOL is optional, and the default is dmss.) - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - FileResponse: A FileResponse containing the zip file.
         * @summary Export
         * @param {string} pathAddress 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        _export: async (pathAddress: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'pathAddress' is not null or undefined
            assertParamExists('_export', 'pathAddress', pathAddress)
            const localVarPath = `/api/export/{path_address}`
                .replace(`{${"path_address"}}`, encodeURIComponent(String(pathAddress)));
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
        /**
         * Get Meta Information About a Document  This endpoint returns meta information about a document provided document id and data source id in which it is located. For more information about the meta-object, see [the docs](https://equinor.github.io/dm-docs/docs/concepts/meta)  Args: - path_address (str): Address of the object for which to get the meta-information.     - Example: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY (PROTOCOL is optional, and the default is dmss.) - user (User): The authenticated user accessing the endpoint.  Returns: - dict: A dictionary containing the meta information for the object.
         * @summary Export Meta
         * @param {string} pathAddress 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        exportMeta: async (pathAddress: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'pathAddress' is not null or undefined
            assertParamExists('exportMeta', 'pathAddress', pathAddress)
            const localVarPath = `/api/export/meta/{path_address}`
                .replace(`{${"path_address"}}`, encodeURIComponent(String(pathAddress)));
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
 * ExportApi - functional programming interface
 * @export
 */
export const ExportApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ExportApiAxiosParamCreator(configuration)
    return {
        /**
         * Download a zip-folder Containing One or More Documents as JSON Files.  This endpoint creates a zip-folder with the contents of the document and it\'s children.  Args: - path_address: Address to the entity or package that should be exported.   - Example: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY (PROTOCOL is optional, and the default is dmss.) - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - FileResponse: A FileResponse containing the zip file.
         * @summary Export
         * @param {string} pathAddress 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async _export(pathAddress: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator._export(pathAddress, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['ExportApi._export']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * Get Meta Information About a Document  This endpoint returns meta information about a document provided document id and data source id in which it is located. For more information about the meta-object, see [the docs](https://equinor.github.io/dm-docs/docs/concepts/meta)  Args: - path_address (str): Address of the object for which to get the meta-information.     - Example: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY (PROTOCOL is optional, and the default is dmss.) - user (User): The authenticated user accessing the endpoint.  Returns: - dict: A dictionary containing the meta information for the object.
         * @summary Export Meta
         * @param {string} pathAddress 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async exportMeta(pathAddress: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ExportMetaResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.exportMeta(pathAddress, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['ExportApi.exportMeta']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
    }
};

/**
 * ExportApi - factory interface
 * @export
 */
export const ExportApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ExportApiFp(configuration)
    return {
        /**
         * Download a zip-folder Containing One or More Documents as JSON Files.  This endpoint creates a zip-folder with the contents of the document and it\'s children.  Args: - path_address: Address to the entity or package that should be exported.   - Example: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY (PROTOCOL is optional, and the default is dmss.) - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - FileResponse: A FileResponse containing the zip file.
         * @summary Export
         * @param {ExportApiExportRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        _export(requestParameters: ExportApiExportRequest, options?: AxiosRequestConfig): AxiosPromise<void> {
            return localVarFp._export(requestParameters.pathAddress, options).then((request) => request(axios, basePath));
        },
        /**
         * Get Meta Information About a Document  This endpoint returns meta information about a document provided document id and data source id in which it is located. For more information about the meta-object, see [the docs](https://equinor.github.io/dm-docs/docs/concepts/meta)  Args: - path_address (str): Address of the object for which to get the meta-information.     - Example: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY (PROTOCOL is optional, and the default is dmss.) - user (User): The authenticated user accessing the endpoint.  Returns: - dict: A dictionary containing the meta information for the object.
         * @summary Export Meta
         * @param {ExportApiExportMetaRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        exportMeta(requestParameters: ExportApiExportMetaRequest, options?: AxiosRequestConfig): AxiosPromise<ExportMetaResponse> {
            return localVarFp.exportMeta(requestParameters.pathAddress, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for _export operation in ExportApi.
 * @export
 * @interface ExportApiExportRequest
 */
export interface ExportApiExportRequest {
    /**
     * 
     * @type {string}
     * @memberof ExportApiExport
     */
    readonly pathAddress: string
}

/**
 * Request parameters for exportMeta operation in ExportApi.
 * @export
 * @interface ExportApiExportMetaRequest
 */
export interface ExportApiExportMetaRequest {
    /**
     * 
     * @type {string}
     * @memberof ExportApiExportMeta
     */
    readonly pathAddress: string
}

/**
 * ExportApi - object-oriented interface
 * @export
 * @class ExportApi
 * @extends {BaseAPI}
 */
export class ExportApi extends BaseAPI {
    /**
     * Download a zip-folder Containing One or More Documents as JSON Files.  This endpoint creates a zip-folder with the contents of the document and it\'s children.  Args: - path_address: Address to the entity or package that should be exported.   - Example: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY (PROTOCOL is optional, and the default is dmss.) - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - FileResponse: A FileResponse containing the zip file.
     * @summary Export
     * @param {ExportApiExportRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ExportApi
     */
    public _export(requestParameters: ExportApiExportRequest, options?: AxiosRequestConfig) {
        return ExportApiFp(this.configuration)._export(requestParameters.pathAddress, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get Meta Information About a Document  This endpoint returns meta information about a document provided document id and data source id in which it is located. For more information about the meta-object, see [the docs](https://equinor.github.io/dm-docs/docs/concepts/meta)  Args: - path_address (str): Address of the object for which to get the meta-information.     - Example: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY (PROTOCOL is optional, and the default is dmss.) - user (User): The authenticated user accessing the endpoint.  Returns: - dict: A dictionary containing the meta information for the object.
     * @summary Export Meta
     * @param {ExportApiExportMetaRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ExportApi
     */
    public exportMeta(requestParameters: ExportApiExportMetaRequest, options?: AxiosRequestConfig) {
        return ExportApiFp(this.configuration).exportMeta(requestParameters.pathAddress, options).then((request) => request(this.axios, this.basePath));
    }
}

