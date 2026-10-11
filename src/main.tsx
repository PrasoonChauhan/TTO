// Global styles load first so component styles can override shared classes.
import './styles/global.css'
import { boot } from './boot'
import Home from './pages/Home'

boot(<Home />)
