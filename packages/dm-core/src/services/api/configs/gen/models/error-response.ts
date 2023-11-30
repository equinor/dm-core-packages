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

/**
 *
 * @export
 * @interface ErrorResponse
 */
export interface ErrorResponse {
	/**
	 *
	 * @type {number}
	 * @memberof ErrorResponse
	 */
	status?: number
	/**
	 *
	 * @type {string}
	 * @memberof ErrorResponse
	 */
	type?: string
	/**
	 *
	 * @type {string}
	 * @memberof ErrorResponse
	 */
	message?: string
	/**
	 *
	 * @type {string}
	 * @memberof ErrorResponse
	 */
	debug?: string
	/**
	 *
	 * @type {object}
	 * @memberof ErrorResponse
	 */
	data?: object
}
