import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Col, Row } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { getRelativeTime } from '@/utils/dateFormat'
import { capitalizeWords, getNameInitials } from '@/utils/common'
import { createLeadFollowUp, getLeadFollowups } from '@/redux/slices/leadSlice'
import { leadFollowUpValidationSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './index.scss'
import { CommonCard, NormalButton } from '@/components'
import { EditorControl } from '@/components/form'

interface FormValues {
  note_description: string
}

const FollowUpNotes = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { leadFollowupList } = useAppSelector(({ lead }) => lead)
  const [page, setPage] = useState(1)
  const limit = 5
  const [notes, setNotes] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const { id: leadId } = useParams()

  useEffect(() => {
    if (leadFollowupList?.data?.total_records) {
      setHasMore(notes.length < leadFollowupList?.data?.total_records)
    }
  }, [leadFollowupList?.data?.total_records, notes.length])

  const methods = useForm<FormValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(leadFollowUpValidationSchema),
    defaultValues: {
      note_description: ''
    }
  })

  const { handleSubmit, reset } = methods

  const fetchNotesData = (pageNumber: number, resetData = false) => {
    setIsLoading(true)
    dispatch(
      getLeadFollowups({
        id: String(leadId),
        payload: { page: pageNumber, limit }
      })
    )
      .then((res: any) => {
        const newNotes = res?.payload?.data?.data || []
        if (resetData || pageNumber === 1) {
          setNotes(newNotes)
        } else {
          setNotes((prev: any) => {
            const existingIds = new Set(prev.map((note: any) => note?.note_id))
            return [...prev, ...newNotes.filter((note: any) => !existingIds.has(note?.note_id))]
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchNotesData(1, true)
  }, [])

  const handleCancel = () => {
    reset()
  }

  const onSubmit = (data: any) => {
    dispatch(createLeadFollowUp({ id: String(leadId), payload: data }))
      .unwrap()
      .then(() => {
        reset()
        setPage(1) // Reset page to 1 when adding a new note
        fetchNotesData(1, true)
      })
  }

  const handleNext = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchNotesData(nextPage)
  }

  return (
    <>
      <CommonCard>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={12}>
                <div className='mb-3 mt-2'>
                  <EditorControl name='note_description' isControl={true} />
                </div>
              </Col>
              <Col md={12}>
                <Col md={12}>
                  <div className='multi_action_btn_div'>
                    <NormalButton variant='outlined' title={t('common.cancel')} onClick={handleCancel} />
                    <NormalButton type='submit' title={t('common.save')} />
                  </div>
                </Col>
              </Col>
            </Row>
          </form>
        </FormProvider>
        <div className='timeline-container mt-3'>
          <div
            id='followUpNotesScrollableDiv'
            className='template-container'
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          >
            <InfiniteScroll
              dataLength={notes.length}
              next={handleNext}
              hasMore={hasMore}
              key={notes?.length}
              loader={isLoading && <div style={{ textAlign: 'center', padding: 8 }}>Loading...</div>}
              scrollableTarget='followUpNotesScrollableDiv'
            >
              {notes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>
                  No notes yet. Be the first to note!
                </div>
              ) : (
                notes.map((item: any) => (
                  <div className='mt-3' key={item?.note_id}>
                    <div className='Comment_toolbar_data'>
                      <div className='avatar-block'>
                        {getNameInitials(`${item?.user_first_name} ${item?.user_last_name}`)}
                      </div>
                      <p className='Comment_toolbar_user_name'>
                        {capitalizeWords(item?.user_first_name)} {capitalizeWords(item?.user_last_name)}
                      </p>
                      <p className='Comment_toolbar_user_time'>{getRelativeTime(item?.created_at)}</p>
                    </div>
                    <p
                      className='comment_content'
                      dangerouslySetInnerHTML={{
                        __html: item?.note_description
                      }}
                    ></p>
                  </div>
                ))
              )}
            </InfiniteScroll>
          </div>
        </div>
      </CommonCard>
    </>
  )
}

export default FollowUpNotes
