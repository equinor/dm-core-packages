import { Configuration, DefaultApi } from './configs/gen'

export class DmssAPI extends DefaultApi {
  constructor(token: string, dmssBasePath?: string) {
    /*
      dmssBasePath is an optional parameter where you can specify the url for DMSS. Example: http://localhost:8000
      (Note: a forward slash should not be included at the end of the url)
    */
    const DMSSConfiguration = new Configuration({
      basePath: dmssBasePath || '/api/dmss',
      accessToken: token,
    })
    super(DMSSConfiguration)
  }
}

export default DmssAPI
