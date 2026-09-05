import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchBeekeeperProfile,
  fetchProfileStatus,
  createProfile,
  updateProfile,
  clearBeekeeperError
} from '../beekeeperSlice'

export const useBeekeeperProfile = (autoFetch = false) => {
  const beekeeper = useSelector((state) => state.beekeeper)
  const dispatch = useDispatch()

  useEffect(() => {
    if (autoFetch && !beekeeper.profile && !beekeeper.loading) {
      dispatch(fetchBeekeeperProfile())
      dispatch(fetchProfileStatus())
    }
  }, [autoFetch, dispatch, beekeeper.profile, beekeeper.loading])

  return {
    ...beekeeper,
    fetchProfile: () => dispatch(fetchBeekeeperProfile()),
    fetchStatus: () => dispatch(fetchProfileStatus()),
    createProfile: (data) => dispatch(createProfile(data)),
    updateProfile: (data) => dispatch(updateProfile(data)),
    clearError: () => dispatch(clearBeekeeperError()),
  }
}

export default useBeekeeperProfile
