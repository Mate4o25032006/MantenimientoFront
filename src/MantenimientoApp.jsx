import { MantenContextProvider } from './Context';
import { AppUi } from './router/AppUi';


export const MantenimientoApp = () => {
  return (
    <MantenContextProvider>
        <AppUi />
    </MantenContextProvider>
  )
}
