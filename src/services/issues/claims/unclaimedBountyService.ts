import { findUnclaimedBountiesWithMergedPrs } from '../../../queries/issue/bounty/findUnclaimedBountiesWithMergedPrs'

export const getUnclaimedBountiesWithMergedPrs = async () => {
  const unclaimedBountiesWithMergedPrs = await findUnclaimedBountiesWithMergedPrs()
  return unclaimedBountiesWithMergedPrs
}
