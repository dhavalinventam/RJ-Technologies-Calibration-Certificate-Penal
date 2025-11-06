import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Pagenavbar from '@/components/page-navbar'
import { useTranslation } from 'react-i18next'
import CommentsSection from './CommentSection'
import HistorySection from './HistorySection'
import AddEditTaskForm from '@/pages/protected/task/form'
import CommonTabs from '@/components/tabs'
import { NormalButton } from '@/components'
import TaskTable from '@/view/task/taskTable'
import { Add } from '@mui/icons-material'

const LeadTask = () => {
  const { t } = useTranslation()
  const [tableReloadTrigger, setTableReloadTrigger] = useState<number>(0)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [task, setTask] = useState<any>(null)
  const { id: leadId } = useParams()
  const handle = {
    handleAddTask: () => {
      setTask(null)
      setIsOpen(true)
    },
    reloadTable: () => {
      setTableReloadTrigger(prev => prev + 1)
    }
  }

  const tabData = useMemo(
    () => [
      {
        label: t('taskForm.comments'),
        content: <CommentsSection taskId={task?.task_id} />
      },
      {
        label: t('taskForm.history'),
        content: <HistorySection taskId={task?.task_id} />
      }
    ],
    [task]
  )

  return (
    <>
      {isOpen ? (
        <>
          <AddEditTaskForm
            isModal={false}
            taskData={task}
            onCancel={() => setIsOpen(false)}
            reloadTable={handle.reloadTable}
            disableSourceFields={true}
            defaultSourceType='lead'
            defaultSourceId={leadId}
          />
          {task && (
            <div className='mt-3'>
              <CommonTabs tabs={tabData} centered={false} variant='fullWidth' />
            </div>
          )}
        </>
      ) : (
        <>
          <Pagenavbar
            title={t('breadcrumb.task')}
            showToggle={false}
            rightSection={<NormalButton title={t('taskForm.addTitle')} icon={<Add />} onClick={handle.handleAddTask} />}
          />
          <TaskTable key={tableReloadTrigger} leadId={leadId} setIsOpen={setIsOpen} setTask={setTask} />
        </>
      )}
    </>
  )
}

export default LeadTask
