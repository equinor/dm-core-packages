import { TPlugin } from '@development-framework/dm-core'


//***********************************************************
//Forms
//import { SingleObjectForm} from './marmo/forms/SingleObjectForm'
//***********************************************************

//***********************************************************
//views
import { Jobs } from './pages/JobRunner'

//import { SignalESSForm } from './marmo/containers/forms/SignalESS'

//***********************************************************
//***********************************************************
export const plugins: TPlugin[] = [

    //********************************************************    
    //********************************************************   

    {
        pluginName: 'signal-job-single',
        component: Jobs,
    }
    //********************************************************    
    //********************************************************    
]