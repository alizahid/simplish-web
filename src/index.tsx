import './index.scss'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import React from 'react'
import ReactDOM from 'react-dom'

import { unregister } from './serviceWorker'
import { Simplish } from './simplish'

dayjs.extend(localizedFormat)

ReactDOM.render(
  <React.StrictMode>
    <Simplish />
  </React.StrictMode>,
  document.getElementById('root')
)

unregister()
