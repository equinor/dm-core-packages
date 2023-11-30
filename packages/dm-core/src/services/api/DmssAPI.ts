import { Configuration, DefaultApi } from './configs/gen'

const DMSS_URL = process.env.REACT_APP_DMSS_URL ?? '/api/dmss'

export class DmssAPI extends DefaultApi {
	constructor(token: string, dmssBasePath?: string) {
		/*
      dmssBasePath is an optional parameter where you can specify the url for DMSS. Example: http://localhost:5000
      (Note: a forward slash should not be included at the end of the url)
    */
		const DMSSConfiguration = new Configuration({
			basePath: dmssBasePath ?? DMSS_URL,
			accessToken: token,
		})
		super(DMSSConfiguration)
	}
}

export default DmssAPI
