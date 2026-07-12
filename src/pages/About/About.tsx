import { APP_NAME, APP_VERSION } from '../../utils/constants'
import { Card } from '../../components/Card/Card'

export default function About() {
  return (
    <div className="page">
      <h2>About</h2>
      <Card>
        <h3>{APP_NAME}</h3>
        <p>Version {APP_VERSION}</p>
        <p>Loop sections of YouTube videos with precision.</p>
      </Card>
    </div>
  )
}