import { Provider } from './hooks'

import Navigation from './Navigation'
import Deck from './Deck'
import Board from './Board'

export default function App () {
  return (
    <Provider>
      <Navigation />
      <Board />
      <Deck />
    </Provider>
  )
}
