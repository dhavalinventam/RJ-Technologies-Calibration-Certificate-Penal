import { useEffect, useMemo, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { departmentOptions } from '@/utils/constant'
import { fetchRolesByOrgId } from '@/redux/slices/roleSlice'
import { showToastError } from '@/utils/helper'
import { NormalButton } from '@/components'
import { Add, Delete } from '@mui/icons-material'
import { CommonInput, SingleAutoCompleteControl } from '@/components/form'
import { Box } from '@mui/material'

const AddUserTable = ({ organizationId }: { organizationId: string }) => {
  const dispatch = useAppDispatch()
  const { setValue, getValues, watch } = useFormContext()
  const { orgRoleList } = useAppSelector(({ role }) => role)
  const [employeeCount, setEmployeeCount] = useState(1)

  const roleOptions = useMemo(
    () =>
      orgRoleList?.map((item: any) => ({
        label: item.role_name,
        value: item.role_id
      })),
    [orgRoleList]
  )

  const employees = watch('employees') || []

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchRolesByOrgId(organizationId))
    }
  }, [organizationId, dispatch])

  useEffect(() => {
    if (!employees.length) {
      setValue('employees', [
        {
          index: 1,
          first_name: '',
          last_name: '',
          email: '',
          contact_number: '',
          designation: '',
          department: '',
          role_id: ''
        }
      ])
      setEmployeeCount(1)
    }
  }, [employees, setValue])

  const handleAddRow = () => {
    const currentEmployees = getValues('employees') || []
    const lastEmployee = currentEmployees[currentEmployees?.length - 1]
    if (
      lastEmployee?.first_name === '' ||
      lastEmployee?.last_name === '' ||
      lastEmployee?.email === '' ||
      lastEmployee?.contact_number === '' ||
      lastEmployee?.designation === '' ||
      lastEmployee?.department === '' ||
      lastEmployee?.role_id === ''
    ) {
      showToastError('Please fill in all the fields before adding a new user.')
      return
    }
    const newEmployeeCount = employeeCount + 1

    setValue('employees', [
      ...currentEmployees,
      {
        index: newEmployeeCount,
        first_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        designation: '',
        department: '',
        role_id: ''
      }
    ])

    setEmployeeCount(newEmployeeCount)
  }

  const handleDeleteRow = (indexToDelete: number) => {
    const currentEmployees = getValues('employees') || []

    if (currentEmployees.length > 1) {
      const updatedEmployees = currentEmployees.filter((_: any, index: any) => index !== indexToDelete)

      const reindexedEmployees = updatedEmployees.map((employee: any, index: any) => ({
        ...employee,
        index: index + 1
      }))

      setValue('employees', reindexedEmployees)
    }
  }

  return (
    <>
      <Box>
        <Table responsive>
          <thead className='invite_user_table_header'>
            <tr>
              <th className='table_header_text_title' colSpan={8}>
                <span className='e-headertext'>User Details</span>
              </th>
              <th>
                <Box className='d-flex justify-content-between align-items-center'>
                  <NormalButton title='Add User' startIcon={<Add />} iconOnly type='button' onClick={handleAddRow} />
                </Box>
              </th>
            </tr>
          </thead>
          <tbody className='invite_user_table_body'>
            {employees.map((employee: any, index: any) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td style={{ display: 'none' }}>
                  <CommonInput name={`employees.${index}.index`} label={`Index`} />
                </td>
                <td>
                  <CommonInput name={`employees.${index}.first_name`} label={`First Name *`} />
                </td>
                <td>
                  <CommonInput name={`employees.${index}.last_name`} label={`Last Name *`} />
                </td>
                <td>
                  <CommonInput name={`employees.${index}.email`} label={`Email *`} />
                </td>
                <td>
                  <CommonInput name={`employees.${index}.contact_number`} label={`Phone Number *`} />
                </td>
                <td>
                  <CommonInput name={`employees.${index}.designation`} label={`Position *`} />
                </td>
                <td>
                  <SingleAutoCompleteControl
                    name={`employees.${index}.department`}
                    label={`Department *`}
                    options={departmentOptions || []}
                  />
                </td>
                <td>
                  <SingleAutoCompleteControl
                    name={`employees.${index}.role_id`}
                    label={`Role *`}
                    options={roleOptions || []}
                  />
                </td>
                <td>
                  {employees.length > 1 && (
                    <NormalButton
                      startIcon={<Delete />}
                      iconOnly
                      type='button'
                      variant='outlined'
                      color='error'
                      onClick={() => handleDeleteRow(index)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </>
  )
}

export default AddUserTable
