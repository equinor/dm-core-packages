import { Configuration, DMTApi } from './configs/gen-dmt'

const DMT_URL = process.env.REACT_APP_DMT_URL ?? '/api/dmt'

export class DmtAPI extends DMTApi {
  constructor(token: string) {
    const DMTConfiguration = new Configuration({
      accessToken: token,
      basePath: DMT_URL ?? '/api/dmt',
    })
    super(DMTConfiguration)
  }
}
