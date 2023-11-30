import { Configuration, DMJobsApi } from './configs/gen-job'

export class DmJobAPI extends DMJobsApi {
	constructor(token: string, baseUrl: string) {
		const DMTConfiguration = new Configuration({
			accessToken: token,
			basePath: baseUrl,
		})
		super(DMTConfiguration)
	}
}
