import { Icon } from '@iconify/react'
import { useAppSelector } from '@/redux/redux-hooks'
import './index.scss'

const StatusCards = () => {
  const { dashboardData } = useAppSelector(({ dashboard }) => dashboard)

  const cardData = [
    {
      icon: 'mdi:people-outline',
      label: 'Total Leads',
      value: dashboardData?.total_lead_count,
      total: 100,
      color: '#dc3545'
    },
    {
      icon: 'mdi:leads-outline',
      label: 'Converted Leads',
      value: dashboardData?.converted_lead_count,
      total: dashboardData?.total_lead_count || 100,
      color: '#28a745'
    },
    {
      icon: 'mdi:folder-outline',
      label: 'Total Projects',
      value: dashboardData?.total_project_count,
      total: 100,
      color: '#343a40'
    },
    {
      icon: 'mdi:clipboard-text-clock-outline',
      label: 'Total Tasks',
      value: dashboardData?.total_task_count,
      total: 100,
      color: '#343a40'
    },
    {
      icon: 'mdi:invoice-text-edit-outline',
      label: 'Total Estimates',
      value: dashboardData?.total_estimate_count,
      total: 100,
      color: '#0d6efd'
    }
  ]

  return (
    <div className='status-cards-container mb-4'>
      {cardData.map((card, index) => {
        const percentage = (card.value / card.total) * 100
        return (
          <div className='common_card_main_div p-3 mb-0 gap-3' key={index}>
            <div className='card-header mb-3'>
              <Icon icon={card.icon} width='20' height='20' />
              <span>{card.label}</span>
              <strong>
                {card.value}
                {/* / {card.total} */}
              </strong>
            </div>
            <div className='progress-bar'>
              <div className='progress-fill' style={{ width: `${percentage}%`, backgroundColor: card.color }}></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatusCards
