import { TimelineComponent } from '@/components/timeline'
import { useAppDispatch } from '@/redux/redux-hooks'
import { getLeadActivityLogs } from '@/redux/slices/leadSlice'
import { useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router-dom'

interface ActivityLog {
  id: string
  title: string
  date: string
  [key: string]: any
}

const ActivityLog = () => {
  const dispatch = useAppDispatch()
  const { id: leadId } = useParams()

  const [limit] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)

  useEffect(() => {
    if (leadId) {
      setPage(1)
      setActivities([])
      setHasMore(true)
      fetchActivityLogs(1)
    }
  }, [leadId])

  const fetchActivityLogs = async (currentPage: number) => {
    try {
      const response = await dispatch(
        getLeadActivityLogs({
          id: String(leadId),
          payload: { page: currentPage, limit }
        })
      ).unwrap()

      const newData = response?.data || []
      const total = response?.total_records || 0

      if (Array.isArray(newData) && newData.length > 0) {
        const updated = [...activities, ...newData]
        setActivities(updated)
        setHasMore(updated.length < total)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching activity logs', error)
      setHasMore(false)
    }
  }

  const handleNext = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchActivityLogs(nextPage)
  }

  const timelineData = useMemo(() => {
    return activities.map(activity => ({
      id: activity.audit_log_id,
      title: activity.note,
      date: activity.created_at,
      fullname: activity.user_first_name + ' ' + activity.user_last_name
    }))
  }, [activities])

  console.log(activities)

  return (
    <div id='scrollableDiv' style={{ height: '400px', overflowY: 'auto' }}>
      <InfiniteScroll
        dataLength={activities.length}
        next={handleNext}
        hasMore={hasMore}
        loader={<div style={{ textAlign: 'center', padding: 8 }}>Loading...</div>}
        scrollableTarget='scrollableDiv'
      >
        <TimelineComponent items={timelineData} />
      </InfiniteScroll>
    </div>
  )
}

export default ActivityLog
