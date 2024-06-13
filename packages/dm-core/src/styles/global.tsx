import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Equinor', sans-serif;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
    * {
        box-sizing: inherit;
    }
    #root {
        display: flex;
        height: 100%;
        width: 100%;
    }
    /* Add padding to plugins */
    .dm-plugin-padding {
        padding: 1rem;
    }

    /* Plugins inside plugins like form, grid and stack should not have additional padding*/
    .dm-parent-plugin .dm-plugin-padding {
        padding: 0;
    }

    .dm-table-row .dm-plugin-padding {
        padding-block: 0.5rem;
        padding-inline: 0;
    }
`

export default GlobalStyle
