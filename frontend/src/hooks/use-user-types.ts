const useUserTypes = ({ user }) => {
  const isContributor = user?.data?.Types?.some((type) => type.name === 'contributor')
  const isMaintainer = user?.data?.Types?.some((type) => type.name === 'maintainer')
  const isFunding = user?.data?.Types?.some((type) => type.name === 'funding')

  return { isContributor, isMaintainer, isFunding }
}

export default useUserTypes