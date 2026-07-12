import { createMemoryRouter } from 'react-router-dom'
import Settings from '../pages/Settings/Settings'
import About from '../pages/About/About'
import Shortcuts from '../pages/Shortcuts/Shortcuts'
import SavedLoops from '../pages/SavedLoops/SavedLoops'

export const router = createMemoryRouter([
  { path: '/', element: <Settings /> },
  { path: '/shortcuts', element: <Shortcuts /> },
  { path: '/loops', element: <SavedLoops /> },
  { path: '/about', element: <About /> },
])