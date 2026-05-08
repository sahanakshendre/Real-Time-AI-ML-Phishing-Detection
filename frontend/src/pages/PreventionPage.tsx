import { useEffect, useState } from 'react'
import { fetchPrevention } from '../api'
import { PreventionMethod } from '../types'

const PreventionPage = () => {
  const [methods, setMethods] = useState<PreventionMethod[]>([])

  useEffect(() => {
    fetchPrevention().then(setMethods)
  }, [])

  return (
    <div>
      <h1 className="page-title">Prevention Method</h1>
      <div className="grid-two">
        {methods.map((method, index) => (
          <div className="panel" key={index}>
            <h3>{method.title}</h3>
            <p>{method.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PreventionPage
