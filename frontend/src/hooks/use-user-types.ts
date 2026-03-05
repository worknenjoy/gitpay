import { useEffect, useState } from 'react'

const useUserTypes = ({ user }) => {
  const { completed, data } = user || {}
  const [isContributor, setIsContributor] = useState(false)
  const [isMaintainer, setIsMaintainer] = useState(false)
  const [isFunding, setIsFunding] = useState(false)
  const [isProvider, setIsProvider] = useState(false)

  useEffect(() => {
    const types = data?.Types ?? []
    setIsContributor(types.some((type) => type?.name === 'contributor'))
    setIsMaintainer(types.some((type) => type?.name === 'maintainer'))
    setIsFunding(types.some((type) => type?.name === 'funding'))
    setIsProvider(types.some((type) => type?.name === 'provider'))
  }, [data])

  return { isContributor, isMaintainer, isFunding, isProvider, completed }
}

export default useUserTypes
