import React from 'react'
import './index.scss'
import { Icon } from '@iconify/react'
import { removeUnderscoreAndCapitalize } from '../../../utils/common'

// const statuses = [
//   { label: "Draft", count: 0, percent: 0, color: "#A0A4AC" },
//   { label: "Not Sent", count: 8, percent: 72.73, color: "#3E3E52" },
//   { label: "Unpaid", count: 4, percent: 36.36, color: "#EF4444" },
//   { label: "Partially Paid", count: 4, percent: 36.36, color: "#F59E0B" },
//   { label: "Overdue", count: 0, percent: 0, color: "#F97316" },
//   { label: "Paid", count: 3, percent: 27.27, color: "#22C55E" },
// ];

type SectionProps = {
  title: string
  items: {
    label: string
    count: number
    percent: number
    color: string
  }[]
}

const Section: React.FC<SectionProps> = ({ title, items }) => (
  <div className='col-lg-12 col-md-12 mb-3'>
    <div className='section-container'>
      <h4 className='section-title'>
        <Icon icon='material-symbols-light:lab-profile-outline' width='20' height='20' />
        {title}
      </h4>
      <div className='status-breakdown'>
        {items?.map((status, index) => (
          <div className='status-item' key={index}>
            <div className='status-row'>
              <span className='count-label' style={{ color: status.color }}>
                {status.count} {status.label}
              </span>
              <span className='percent'>{status.percent.toFixed(2)}%</span>
            </div>
            <div className='progress-bar'>
              <div
                className='fill'
                style={{
                  width: `${status.percent}%`,
                  backgroundColor: status.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const OverviewDashboard = ({ data }: { data: any }) => {
  return (
    <div className='overview-dashboard common_card_main_div p-3 mb-4'>
      <div className='overview-panels'>
        <div className='row'>
          <Section
            title='Estimates overview'
            items={data?.estimate_status_counts?.map((s: any) => ({
              label: removeUnderscoreAndCapitalize(s.status),
              count: s.count,
              percent: Number(s.percentage),
              color: s.color || '#457b9d'
            }))}
          />
          {/* <Section
            title='Proposal overview'
            items={data?.proposal_status_counts?.map((s: any) => ({
              label: removeUnderscoreAndCapitalize(s.status),
              count: s.count,
              percent: Number(s.percentage),
              color: s.color || '#457b9d'
            }))}
          /> */}
        </div>
      </div>
      {/* <div className="overview-summary row px-2">
        <div className="col-md-6 col-lg-4 px-1 mb-2">
          <div className="common_card_main_div overview-card p-3 gap-3 mb-0">
            <span>Outstanding Invoices</span>
            <strong>$56,478.00</strong>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 px-1 mb-2">
          <div className="common_card_main_div overview-card p-3 gap-3 mb-0">
            <span>Past Due Invoices</span>
            <strong>$0.00</strong>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 px-1 mb-2">
          <div className="common_card_main_div overview-card p-3 gap-3 mb-0">
            <span>Paid Invoices</span>
            <strong>$9,733.20</strong>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default OverviewDashboard
