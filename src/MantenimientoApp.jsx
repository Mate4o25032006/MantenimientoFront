import { AppUi } from './router';
import { TurisContextProvider } from './Context';


export const MantenimientoApp = () => {
  return (
    <TurisContextProvider>
        <AppUi />
    </TurisContextProvider>
  )
}
