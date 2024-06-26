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
/**
 * SearchApi - axios parameter creator
 * @export
 */
export const SearchApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Search for Entities of a Specific Blueprint Type in the Provided Data Sources.  This endpoint searches the provided data sources for entities that match the search data object provided. It will return all the entities in database of the type specified, with attributes that match the requirements set in the search query.  Args: - data (dict): A dictionary containing a \"type\"-attribute which will be used to search . Other attributes can be used to filter the search.     - Example: {         \"type\": \"dmss://blueprints/root_package/ValuesBlueprint\",         \"attribute_greater_than_example\": \">100\",         \"attribute_less_than_example\": \"<11\".         \"my_string\": \"de\" # will return entities with attributes of type \"my_string\" that starts with \"de\"     } - data_sources (List[str]): Optional list of data source id\'s of which to search. If left empty it will search all available databases. - sort_by_attribute (str): Optional attribute of which to sort the results. Default is \"name\". - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The sorted search results.
         * @summary Search
         * @param {Array<string>} [dataSources] 
         * @param {string} [sortByAttribute] 
         * @param {object | null} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        search: async (dataSources?: Array<string>, sortByAttribute?: string, body?: object | null, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/search`;
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

            if (dataSources) {
                localVarQueryParameter['data_sources'] = dataSources;
            }

            if (sortByAttribute !== undefined) {
                localVarQueryParameter['sort_by_attribute'] = sortByAttribute;
            }


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(body, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * SearchApi - functional programming interface
 * @export
 */
export const SearchApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SearchApiAxiosParamCreator(configuration)
    return {
        /**
         * Search for Entities of a Specific Blueprint Type in the Provided Data Sources.  This endpoint searches the provided data sources for entities that match the search data object provided. It will return all the entities in database of the type specified, with attributes that match the requirements set in the search query.  Args: - data (dict): A dictionary containing a \"type\"-attribute which will be used to search . Other attributes can be used to filter the search.     - Example: {         \"type\": \"dmss://blueprints/root_package/ValuesBlueprint\",         \"attribute_greater_than_example\": \">100\",         \"attribute_less_than_example\": \"<11\".         \"my_string\": \"de\" # will return entities with attributes of type \"my_string\" that starts with \"de\"     } - data_sources (List[str]): Optional list of data source id\'s of which to search. If left empty it will search all available databases. - sort_by_attribute (str): Optional attribute of which to sort the results. Default is \"name\". - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The sorted search results.
         * @summary Search
         * @param {Array<string>} [dataSources] 
         * @param {string} [sortByAttribute] 
         * @param {object | null} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async search(dataSources?: Array<string>, sortByAttribute?: string, body?: object | null, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.search(dataSources, sortByAttribute, body, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['SearchApi.search']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
    }
};

/**
 * SearchApi - factory interface
 * @export
 */
export const SearchApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SearchApiFp(configuration)
    return {
        /**
         * Search for Entities of a Specific Blueprint Type in the Provided Data Sources.  This endpoint searches the provided data sources for entities that match the search data object provided. It will return all the entities in database of the type specified, with attributes that match the requirements set in the search query.  Args: - data (dict): A dictionary containing a \"type\"-attribute which will be used to search . Other attributes can be used to filter the search.     - Example: {         \"type\": \"dmss://blueprints/root_package/ValuesBlueprint\",         \"attribute_greater_than_example\": \">100\",         \"attribute_less_than_example\": \"<11\".         \"my_string\": \"de\" # will return entities with attributes of type \"my_string\" that starts with \"de\"     } - data_sources (List[str]): Optional list of data source id\'s of which to search. If left empty it will search all available databases. - sort_by_attribute (str): Optional attribute of which to sort the results. Default is \"name\". - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The sorted search results.
         * @summary Search
         * @param {SearchApiSearchRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        search(requestParameters: SearchApiSearchRequest = {}, options?: AxiosRequestConfig): AxiosPromise<object> {
            return localVarFp.search(requestParameters.dataSources, requestParameters.sortByAttribute, requestParameters.body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for search operation in SearchApi.
 * @export
 * @interface SearchApiSearchRequest
 */
export interface SearchApiSearchRequest {
    /**
     * 
     * @type {Array<string>}
     * @memberof SearchApiSearch
     */
    readonly dataSources?: Array<string>

    /**
     * 
     * @type {string}
     * @memberof SearchApiSearch
     */
    readonly sortByAttribute?: string

    /**
     * 
     * @type {object}
     * @memberof SearchApiSearch
     */
    readonly body?: object | null
}

/**
 * SearchApi - object-oriented interface
 * @export
 * @class SearchApi
 * @extends {BaseAPI}
 */
export class SearchApi extends BaseAPI {
    /**
     * Search for Entities of a Specific Blueprint Type in the Provided Data Sources.  This endpoint searches the provided data sources for entities that match the search data object provided. It will return all the entities in database of the type specified, with attributes that match the requirements set in the search query.  Args: - data (dict): A dictionary containing a \"type\"-attribute which will be used to search . Other attributes can be used to filter the search.     - Example: {         \"type\": \"dmss://blueprints/root_package/ValuesBlueprint\",         \"attribute_greater_than_example\": \">100\",         \"attribute_less_than_example\": \"<11\".         \"my_string\": \"de\" # will return entities with attributes of type \"my_string\" that starts with \"de\"     } - data_sources (List[str]): Optional list of data source id\'s of which to search. If left empty it will search all available databases. - sort_by_attribute (str): Optional attribute of which to sort the results. Default is \"name\". - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The sorted search results.
     * @summary Search
     * @param {SearchApiSearchRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SearchApi
     */
    public search(requestParameters: SearchApiSearchRequest = {}, options?: AxiosRequestConfig) {
        return SearchApiFp(this.configuration).search(requestParameters.dataSources, requestParameters.sortByAttribute, requestParameters.body, options).then((request) => request(this.axios, this.basePath));
    }
}

