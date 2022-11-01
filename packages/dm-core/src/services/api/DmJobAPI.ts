import { Configuration, DMJobsApi } from './configs/gen-job'

const DM_JOB_URL = process.env.REACT_APP_DM_JOB_URL ?? '/api/dmt'

export class DmJobAPI extends DMJobsApi {
  constructor(token: string) {
    const DMTConfiguration = new Configuration({
      accessToken: token,
      basePath: DM_JOB_URL ?? '/api/dmt',
    })
    super(DMTConfiguration)
  }
}
