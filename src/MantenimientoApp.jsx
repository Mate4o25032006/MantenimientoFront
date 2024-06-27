import { AppUi } from './router';
import { MantenContext, MantenContextProvider } from './Context';


export const MantenimientoApp = () => {
  return (
    <MantenContextProvider>
        <AppUi />
    </MantenContextProvider>
  )
}
