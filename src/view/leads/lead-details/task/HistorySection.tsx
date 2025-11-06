import { TimelineComponent } from '@/components'
import { useAppDispatch } from '@/redux/redux-hooks'
import { getLeadTaskHistory } from '@/redux/slices/leadSlice'
import { Icon } from '@iconify/react'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router-dom'

interface IProps {
  taskId: string
}

const HistorySection = ({ taskId }: IProps) => {
  const dispatch = useAppDispatch()
  const { id: leadId } = useParams()

  const [limit] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  const [activities, setActivities] = useState<any[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [sortOrder, setSortOrder] = useState('DESC')
  const [sortBy, setSortBy] = useState('created_at')

  const sortList = useMemo(() => [{ label: 'Date Created', field: 'created_at' }], [])

  const handleSortChange = useCallback(
    (field: string) => {
      setPage(1)
      setActivities([])
      if (field === sortBy) {
        setSortOrder(prev => (prev === 'ASC' ? 'DESC' : 'ASC'))
      } else {
        setSortBy(field)
        setSortOrder('ASC')
      }
    },
    [sortBy]
  )

  const fetchHistoryData = useCallback(
    async (currentPage: number) => {
      try {
        const response = await dispatch(
          getLeadTaskHistory({
            id: String(leadId),
            taskId: taskId,
            payload: {
              page: currentPage,
              limit,
              sortOrder,
              sortBy
            }
          })
        ).unwrap()

        const newData = response?.data || []
        const total = response?.total_records || 0

        if (Array.isArray(newData) && newData.length > 0) {
          const updated = currentPage === 1 ? newData : [...activities, ...newData]
          setActivities(updated)
          setHasMore(updated.length < total)
        } else {
          setHasMore(false)
        }
      } catch (error) {
        console.error('Error fetching activity logs', error)
        setHasMore(false)
      }
    },
    [leadId, taskId, limit, sortOrder, sortBy, activities]
  )

  useEffect(() => {
    if (!leadId || !taskId) return
    setPage(1)
    setHasMore(true)
    fetchHistoryData(1)
  }, [leadId, taskId, sortOrder, sortBy])

  const handleNext = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchHistoryData(nextPage)
  }

  const timelineData = useMemo(() => {
    return activities.map(activity => ({
      id: activity.audit_log_id,
      title: activity.note,
      date: activity.created_at,
      fullname: activity.user_first_name + ' ' + activity.user_last_name
    }))
  }, [activities])

  return (
    <>
      <div className='kanban_sortby_sec'>
        <div className='kanban_sortby_subinfo'>
          <p className='kanban_sortby_text'>Sort By:</p>
          {sortList.map(({ label, field }) => (
            <Fragment key={field}>
              <span
                className={`kanban_sort_data ${sortBy === field ? 'active' : ''}`}
                onClick={() => handleSortChange(field)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                {label}
                {sortBy === field && <Icon icon={sortOrder === 'ASC' ? 'mdi:arrow-up' : 'mdi:arrow-down'} width='14' />}
              </span>
              {/* <p className="kanban_sortby_line_div" /> */}
            </Fragment>
          ))}
        </div>
      </div>
      <div id='scrollableDiv' style={{ height: '400px', overflowY: 'auto' }}>
        <InfiniteScroll
          dataLength={activities?.length}
          next={handleNext}
          hasMore={hasMore}
          loader={<div style={{ textAlign: 'center', padding: 8 }}>Loading...</div>}
          scrollableTarget='scrollableDiv'
        >
          <TimelineComponent items={timelineData} />
        </InfiniteScroll>
      </div>
    </>
  )
}

export default HistorySection
