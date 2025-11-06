import { Icon } from '@iconify/react/dist/iconify.js'
import {
  capitalizeWords,
  getColorFromString,
  getNameInitials,
  getTransparentLightBackground,
  getSafeColor
} from './common'
import { priorityColors } from './constant'
import { convertTimestampToDate } from './dateFormat'
import { Avatar, AvatarGroup, Tooltip } from '@mui/material'
import './index.scss'

export const renderPhone = (phone: any) => {
  if (!phone) {
    return <div>--</div>
  }

  return (
    <div>
      {phone ? (
        <a href={`tel:${phone}`} style={{ color: '#007bff', textDecoration: 'none' }}>
          {phone}
        </a>
      ) : (
        '--'
      )}
    </div>
  )
}

export const renderEmail = (email: any) => {
  if (!email) {
    return <div>--</div>
  }

  return (
    <div>
      {email ? (
        <a
          href={`mailto:${email}`}
          style={{ textDecoration: 'none', color: '#007bff' }}
          target='_blank'
          className='email_data'
        >
          {email}
        </a>
      ) : (
        '--'
      )}
    </div>
  )
}

export const renderWebsite = (website: any) => {
  if (!website) {
    return <div>--</div>
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {website ? (
        <a
          href={website.startsWith('http') ? website : `https://${website}`}
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: '#007bff', textDecoration: 'none' }}
        >
          {website}
        </a>
      ) : (
        '--'
      )}
    </div>
  )
}

export const renderStatus = (status: any | undefined) => {
  console.log('status', status)
  if (!status?.name) {
    return <div>--</div>
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '22px',
        fontSize: 12,
        border: '1px solid #0000001f'
      }}
    >
      {status?.icon ? status?.icon : ''}{' '}
      <span style={{ color: getSafeColor(status?.color, '#000000') }}>{status?.name}</span>
    </span>
  )
}

export const renderAssignedUsers = (assignedTo: any[] | undefined) => {
  if (!assignedTo || assignedTo.length === 0) {
    return <div>--</div>
  }

  return (
    <AvatarGroup
      max={4}
      sx={{
        '& .MuiAvatarGroup-avatar': {
          width: 24,
          height: 24,
          fontSize: 12,
          fontFamily: 'Public Sans'
        }
      }}
    >
      {assignedTo.map((user, index) => {
        const fullName = `${user.first_name} ${user.last_name}`
        return (
          <Tooltip key={index} title={capitalizeWords(fullName)} arrow placement='top'>
            <Avatar
              sx={{
                bgcolor: user?.color || getColorFromString(fullName)
              }}
            >
              {getNameInitials(fullName)}
            </Avatar>
          </Tooltip>
        )
      })}
    </AvatarGroup>
  )
}

export const renderTags = (tags: any[] | undefined) => {
  if (!tags || tags.length === 0) {
    return <div>--</div>
  }
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px',
        margin: '10px 0px'
      }}
    >
      {tags?.map((tag, index) => (
        <span
          key={index}
          style={{
            background: tag?.color || '#f0f0f0',
            color: '#fff',
            borderRadius: '8px',
            padding: '4px',
            fontSize: '12px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            lineHeight: 'normal'
          }}
        >
          {tag?.name || 'Test'}
        </span>
      ))}
    </div>
  )
}

export const renderCompanyName = (title: any) => {
  if (!title) {
    return <div>--</div>
  }

  return (
    <span
      style={{
        display: 'inline-block',
        maxWidth: '160px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        padding: '4px',
        borderRadius: '12px',
        background: getTransparentLightBackground('#133e87'),
        color: '#133e87'
      }}
    >
      {title}
    </span>
  )
}

export const renderPriority = (priority: string | undefined) => {
  if (!priority) {
    return <div>--</div>
  }

  const selectedPriority = priorityColors.find(p => p.value === priority)
  if (!selectedPriority) {
    return <div>--</div>
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '22px',
        fontSize: 12,
        border: '1px solid #0000001f'
      }}
    >
      <Icon
        icon={selectedPriority?.icon || '--'}
        width='16'
        height='16'
        color={selectedPriority?.color}
        className='me-2'
      />
      <span>{selectedPriority?.label || '--'}</span>
    </span>
  )
}

export const statusTemplate = (data: any) => {
  return (
    <span>
      {data?.icon ? data?.icon : ''} {data?.name || ''}
    </span>
  )
}

export const priorityTemplate = (data: any) => {
  return (
    <span>
      <Icon icon={data?.icon} width='16' height='16' color={data?.color} className='me-2' />
      {data?.label || data?.properties?.text}
    </span>
  )
}

export const priorityLabelTemplate = (selectedPriority: any) => {
  return selectedPriority ? (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      <Icon
        icon={priorityColors.find(p => p.value === selectedPriority)?.icon || ''}
        width='16'
        height='16'
        color={priorityColors.find(p => p.value === selectedPriority)?.color || '#000'}
      />
      {priorityColors.find(p => p.value === selectedPriority)?.label}
    </span>
  ) : (
    'Priority'
  )
}

export const renderName = (firstName: string, lastName: string) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Avatar
        sx={{
          bgcolor: getColorFromString(`${firstName} ${lastName}`),
          width: 24,
          height: 24,
          fontSize: 12
        }}
      >
        {getNameInitials(`${firstName} ${lastName}`)}
      </Avatar>
      <div>
        {firstName} {lastName}
      </div>
    </div>
  )
}

export const renderLocation = (address: any) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: 5 }}>
        <Icon icon='tdesign:location' width='17' height='14' />
      </span>
      {address?.city?.city_name && address?.state?.state_name
        ? `${address.city.city_name}, ${address.state.state_name}`
        : address?.city?.city_name
          ? address.city.city_name
          : address?.state?.state_name
            ? address.state.state_name
            : '--'}
    </div>
  )
}

export const renderAddress = (props: any) => {
  const addresses = props?.addresses || []
  if (addresses.length > 0) {
    const address = addresses[0]
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>
          <Icon icon='tdesign:location' width='14' height='14' />
        </span>
        <span className='organization_address_text'>{address?.address_line_1}</span>
      </div>
    )
  }
  return <span>--</span>
}

export const renderSource = (source: any) => {
  if (!source?.name) {
    return <div>--</div>
  }
  return (
    <div
      style={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        padding: '10px 0px'
      }}
    >
      {source.name}
    </div>
  )
}

export const renderCurrency = (value: number | undefined) => {
  return <div>{value ? `₹ ${value}` : '--'}</div>
}

export const renderData = (data: string | undefined) => {
  return (
    <div
      style={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        padding: '10px 0px'
      }}
    >
      {data ? data : '--'}
    </div>
  )
}

export const renderDate = (date: string | undefined) => {
  return <div>{date ? convertTimestampToDate(date) : '--'}</div>
}

export const renderColor = (color: any) => {
  return (
    <div
      style={{
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        backgroundColor: color,
        color: color
      }}
    ></div>
  )
}

export const locationTemplate = (data: any) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: 5 }}>
        <Icon icon='tdesign:location' width='17' height='14' />
      </span>

      {data?.city && data?.state
        ? `${data.city}, ${data.state}`
        : data?.city
          ? data.city
          : data?.state
            ? data.state
            : '--'}
    </div>
  )
}

export const renderBaseUnit = (base_unit: any) => {
  const isYes = !!base_unit
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span
        style={{
          display: 'inline-block',
          padding: '0 10px',
          width: 'fit-content',
          borderRadius: 20,
          background: !isYes ? 'rgba(var(--color-sf-primary))' : 'rgba(var(--color-sf-primary), 0.1)',
          color: !isYes ? '#fff' : '#333',
          fontWeight: 500,
          textAlign: 'center'
        }}
      >
        {isYes ? 'No' : 'Yes'}
      </span>
    </div>
  )
}

export const renderProductService = (variant: any) => {
  return variant?.variant_name ? `${variant?.variant_name} (${variant?.variant_sku})` : '-'
}

export const offerCodeTemplate = (row: any) => {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '8px',
        borderRadius: '10px',
        background: 'rgba(var(--color-sf-primary), 0.09)',
        color: 'rgba(var(--color-sf-primary))',
        fontWeight: 600,
        minWidth: '80px',
        textAlign: 'center'
      }}
    >
      {row.offer_code || '-'}
    </span>
  )
}

export const renderAutoApply = (row: any) => {
  const isYes = !!row.auto_apply
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span
        style={{
          display: 'inline-block',
          padding: '10px',
          width: 'fit-content',
          borderRadius: 20,
          background: !isYes ? 'rgba(var(--color-sf-primary))' : 'rgba(var(--color-sf-primary), 0.1)',
          color: !isYes ? '#fff' : '#333',
          fontWeight: 500,
          textAlign: 'center'
        }}
      >
        {isYes ? 'Yes' : 'No'}
      </span>
    </div>
  )
}

export const renderStatusMaster = (row: any) => {
  const isActive = row.is_active
  return (
    <span
      className='badge rounded-pill'
      style={{
        fontSize: '12px',
        fontWeight: '500',
        padding: '4px 8px',
        textTransform: 'capitalize',
        backgroundColor: isActive
          ? 'rgba(var(--color-sf-success-container), 0.3)'
          : 'rgba(var(--color-sf-error-container), 0.3)',
        color: isActive ? 'rgba(var(--color-sf-success))' : 'rgba(var(--color-sf-error))',
        border: isActive
          ? '1px solid rgba(var(--color-sf-success), 0.3)'
          : '1px solid rgba(var(--color-sf-error), 0.3)',
        display: 'inline-flex',
        alignItems: 'center',
        minWidth: '60px',
        justifyContent: 'center'
      }}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

export const renderDescription = (data: string) => {
  const cleanData = htmlToString(data)

  if (!data) {
    return <div>--</div>
  }

  return (
    <Tooltip title={cleanData}>
      <div
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '150px',
          width: '100%'
        }}
      >
        {cleanData}
      </div>
    </Tooltip>
  )
}

export const renderHTML = (string: string) => {
  return string ? <div dangerouslySetInnerHTML={{ __html: string }} /> : '--'
}

export const htmlToString = (html: string) => {
  return (
    <div
      style={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        wordBreak: 'break-all',
        padding: '10px 0px'
      }}
    >
      {html?.replace(/<[^>]*>/g, '')}
    </div>
  )
}

export const renderCurrencyDropDownList = (currency?: any) => {
  return (
    <div>
      {currency.currency_name} {`(${currency.currency_code})`}
    </div>
  )
}
