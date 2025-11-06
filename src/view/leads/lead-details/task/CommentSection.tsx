import { CommonCard, NormalButton } from '@/components'
import { EditorControl } from '@/components/form'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { createComment, fetchComments } from '@/redux/slices/leadSlice'
import { capitalizeWords, getNameInitials } from '@/utils/common'
import { getRelativeTime } from '@/utils/dateFormat'
import { commentSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormProvider, useForm } from 'react-hook-form'
import InfiniteScroll from 'react-infinite-scroll-component'

interface IProps {
  taskId: string
}

interface FormValues {
  comment: string
  status?: string
}

const CommentsSection = ({ taskId }: IProps) => {
  const dispatch = useAppDispatch()
  const [isRefresh, setIsRefresh] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 5
  const [comments, setComments] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState('DESC')
  const [sortBy, setSortBy] = useState('created_at')
  const { lead, commentList } = useAppSelector(({ lead }) => lead)

  const sortList = useMemo(() => [{ label: 'Date Created', field: 'created_at' }], [])

  const handleSortChange = useCallback(
    (field: string) => {
      setPage(1)
      // setComments([]);
      setHasMore(true)
      if (field === sortBy) {
        setSortOrder(prev => (prev === 'ASC' ? 'DESC' : 'ASC'))
      } else {
        setSortBy(field)
        setSortOrder('ASC')
      }
    },
    [sortBy]
  )

  useEffect(() => {
    if (commentList?.total_records) {
      setHasMore(comments.length < commentList.total_records)
    }
  }, [commentList?.total_records, comments.length])

  const methods = useForm<FormValues>({
    resolver: yupResolver(commentSchema as any),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      comment: '',
      status: 'Active'
    }
  })

  const { handleSubmit, reset } = methods

  const fetchCommentData = useCallback(
    (pageNumber: number, resetData = false) => {
      if (lead && taskId) {
        setIsLoading(true)
        dispatch(
          fetchComments({
            id: lead?.lead_id,
            taskId,
            payload: {
              sortBy,
              sortOrder,
              limit,
              page: pageNumber
            }
          })
        ).then((res: any) => {
          const newComments = res?.payload?.data || []
          if (resetData || pageNumber === 1) {
            setComments(newComments)
          } else {
            setComments(prev => {
              const existingIds = new Set(prev.map((comment: any) => comment.comment_id))
              const filteredComments = newComments?.filter((comment: any) => !existingIds.has(comment.comment_id))
              return [...prev, ...filteredComments]
            })
          }
          setIsRefresh(false)
          setIsLoading(false)
        })
      }
    },
    [lead, taskId, sortBy, sortOrder, limit, comments]
  )
  useEffect(() => {
    fetchCommentData(1, true)
  }, [isRefresh, sortOrder, sortBy])

  const onSubmit = (data: any) => {
    if (lead && taskId) {
      dispatch(
        createComment({
          id: lead?.lead_id,
          taskId,
          payload: data
        })
      ).then(() => {
        reset()
        setPage(1) // Reset to first page when adding a new comment
        setIsRefresh(true)
      })
    }
  }

  const handleNext = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchCommentData(nextPage)
  }

  return (
    <div>
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
      <CommonCard>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={12}>
                <div className='mb-3 mt-2'>
                  <EditorControl name='comment' />
                </div>
              </Col>
              <Col md={12}>
                <div className='multi_action_btn_div'>
                  <NormalButton type='submit' title='Comment' />
                </div>
              </Col>
            </Row>
          </form>
        </FormProvider>
        <div id='commentScrollableDiv' style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <InfiniteScroll
            dataLength={comments.length}
            next={handleNext}
            hasMore={hasMore}
            key={comments?.length}
            loader={isLoading && <div style={{ textAlign: 'center', padding: 8 }}>Loading...</div>}
            scrollableTarget='commentScrollableDiv'
          >
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((item: any) => (
                <div className='mt-3' key={item?.comment_id}>
                  <div className='Comment_toolbar_data'>
                    <div className='avatar-block'>
                      {getNameInitials(`${item?.user_first_name} ${item?.user_last_name}`)}
                    </div>
                    <p className='Comment_toolbar_user_name'>
                      {capitalizeWords(item?.user_first_name)} {capitalizeWords(item?.user_last_name)}
                    </p>
                    <p className='Comment_toolbar_user_time'>{getRelativeTime(item?.created_at)}</p>
                  </div>
                  <p className='comment_content' dangerouslySetInnerHTML={{ __html: item?.comment }}></p>
                </div>
              ))
            )}
          </InfiniteScroll>
        </div>
      </CommonCard>
    </div>
  )
}

export default CommentsSection
