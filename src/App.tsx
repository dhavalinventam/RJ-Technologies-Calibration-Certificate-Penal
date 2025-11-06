import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes'
import './styles/global.scss'
import './styles/variable.scss'

import 'bootstrap/dist/css/bootstrap.min.css'
function App() {
  return (
    <ThemeProvider>
      <ToastContainer className='toastify-container' />
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App
