import { DesktopIcon } from '@/assets/png'
import CommonModal from '@/components/modal'
import { useAppDispatch } from '@/redux/redux-hooks'
import { getAllActiveSession, logoutSingleSession } from '@/redux/slices/userSlice'
import { getUsersInfo } from '@/utils/common'
import { getRelativeTime } from '@/utils/dateFormat'
import { useEffect, useState } from 'react'
import './index.scss'
import { NormalButton } from '@/components'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Logout } from '@mui/icons-material'
interface ActiveSessionModalProps {
  open: boolean
  onClose: () => void
  footer?: React.ReactNode
}
const ActiveSessionModal = ({ open, onClose, footer }: ActiveSessionModalProps) => {
  const [activeSessionData, setActiveSessionData] = useState<any>([])
  const [isRefersh, setIsRefersh] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const dispatch = useAppDispatch()
  const userInfo = getUsersInfo()

  const handle = {
    handleGetAllActiveSession: () => {
      dispatch(
        getAllActiveSession({
          id: userInfo?.user_id,
          page: page,
          limit: 5,
          search: '',
          sortBy: 'created_at',
          sortOrder: 'ASC'
        })
      )
        .unwrap()
        .then((res: any) => {
          // eslint-disable-next-line no-unsafe-optional-chaining
          setActiveSessionData((prev: any) => [...prev, ...res?.data?.data])
          setTotalPages(res?.data?.total_records)
        })
        .finally(() => {
          setIsRefersh(false)
        })
    },
    handleLogoutSingleSession: (sessionId: string) => {
      dispatch(logoutSingleSession({ id: userInfo?.user_id, sessionId }))
        .unwrap()
        .then(() => {
          setActiveSessionData((prev: any) => prev.filter((item: any) => item.user_session_id !== sessionId))
          if (activeSessionData.length === 1) onClose()
          setPage(1)
        })
    },
    handleNext: () => {
      setPage(page + 1)
      setIsRefersh(true)
    },
    handleGetUserInfo: (user_agent: any) => {
      return Object.keys(user_agent || {}).length === 0 ? '' : user_agent
    }
  }

  useEffect(() => {
    setHasMore(totalPages > activeSessionData?.length)
  }, [totalPages, activeSessionData])

  useEffect(() => {
    if (!isRefersh) return
    handle.handleGetAllActiveSession()
  }, [page, isRefersh])

  return (
    <CommonModal open={open} onClose={onClose} title='Active Session' footer={footer} size='lg'>
      <div className='session_div' id='scrollableDiv'>
        <InfiniteScroll
          dataLength={activeSessionData.length}
          next={handle.handleNext}
          hasMore={hasMore}
          scrollableTarget='scrollableDiv'
          loader={<div className='text-center py-2'>Loading...</div>}
          endMessage={<></>}
        >
          {activeSessionData?.map((item: any, index: number) => {
            const user_agent = Object.keys(item.user_agent || {}).length === 0 ? '' : item.user_agent

            return (
              <div className='session_div_item' key={index}>
                <div className='card-title d-flex justify-content-between align-items-center gap-1'>
                  <div>
                    <img src={DesktopIcon} alt='user-img' className='' />
                  </div>
                  <div className='details'>
                    <div>{user_agent}</div>
                    <div className=''>{getRelativeTime(item.created_at)}</div>
                  </div>
                  <div>
                    <NormalButton
                      type='button'
                      onClick={() => handle.handleLogoutSingleSession(item.user_session_id)}
                      icon={<Logout />}
                      iconOnly={true}
                      iconSize='small'
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </InfiniteScroll>
      </div>
    </CommonModal>
  )
}
export default ActiveSessionModal
