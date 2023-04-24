import { TPlugin } from '@development-framework/dm-core'


//***********************************************************
//Forms
//import { SingleObjectForm} from './marmo/forms/SingleObjectForm'
//***********************************************************

//***********************************************************
//views
import { SignalPlot } from './marmo/containers/views/SignalPlot'
import { SignalTable } from './marmo/containers/views/SignalTable'

//import { SignalESSForm } from './marmo/containers/forms/SignalESS'

//***********************************************************
//***********************************************************
export const plugins: TPlugin[] = [

    //********************************************************    
    //********************************************************   

    {
        pluginName: 'marmo-ess-plot-view',
        component: SignalPlot,
    },   

    {
        pluginName: 'marmo-ess-table-view',
        component: SignalTable
    },  

    // {
    //     pluginName: 'marmo-ess-edit-form',
    //     pluginType: DmtPluginType.UI,
    //     content: {
    //         component: SignalESSForm,
    //     },
    // },      
    //********************************************************    
    //********************************************************   

// {
//     pluginName: 'marmo-edit-ess',
//     pluginType: DmtPluginType.UI,
//     content: {
//         component: SingleObjectForm,
//     },
// }, 
    //********************************************************    
    //********************************************************    
]