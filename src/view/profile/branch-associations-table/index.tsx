import { memo } from 'react'
import { Table } from 'react-bootstrap'
import './index.scss'

interface IProps {
  data: any
}

const BranchAssociationsTable = ({ data }: IProps) => {
  console.log('🚀 ~ ProfilePageTable ~ data:', data)
  return (
    <>
      <Table bordered striped hover responsive className='custom_table'>
        <thead>
          <tr>
            <th className='table_header_text_title'>
              <span className='e-headertext'>Branch</span>
            </th>
            <th className='table_header_text_title'>
              <span className='e-headertext'>Role</span>
            </th>
            <th className='table_header_text_title'>
              <span className='e-headertext'>Position</span>
            </th>
            <th className='table_header_text_title'>
              <span className='e-headertext'>Department</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item: any, index: number) => (
            <tr key={index}>
              <td>{item?.branch_name ? item?.branch_name : '-'}</td>
              <td>{item?.role?.role_name ? item?.role?.role_name : '-'}</td>
              <td>{item?.designation ? item?.designation : '-'}</td>
              <td>{item?.department ? item?.department : '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default memo(BranchAssociationsTable)
