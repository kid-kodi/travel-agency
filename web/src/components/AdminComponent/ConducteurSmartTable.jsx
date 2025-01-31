import React, { useState } from 'react'
import { CAvatar, CBadge, CButton, CCollapse, CSmartTable } from '@coreui/react-pro'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@coreui/coreui/dist/css/coreui.min.css'

const getBadge = (status) => {
  switch (status) {
    case 'Active': {
      return 'success'
    }
    case 'Inactive': {
      return 'secondary'
    }
    case 'Pending': {
      return 'warning'
    }
    case 'Banned': {
      return 'danger'
    }
    default: {
      return 'primary'
    }
  }
}

export const ConducteurSmartTable = () => {
  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'avatar',
      label: '',
      filter: false,
      sorter: false,
    },
    {
      key: 'name',
      _style: { width: '20%' },
    },
    {
      key: 'registered',
      sorter: (item1, item2) => {
        const a = new Date(item1.registered)
        const b = new Date(item2.registered)
        return a > b ? 1 : b > a ? -1 : 0
      },
    },
    {
      key: 'role',
      _style: { width: '20%' },
    },
    'status',
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]
  const items = [
    {
      id: 1,
      name: 'Samppa Nori',
      avatar: '1.jpg',
      registered: '2021/03/01',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Estavan Lykos',
      avatar: '2.jpg',
      registered: '2018/02/07',
      role: 'Staff',
      status: 'Banned',
    },
    {
      id: 3,
      name: 'Chetan Mohamed',
      avatar: '3.jpg',
      registered: '2020/01/15',
      role: 'Admin',
      status: 'Inactive',
      _selected: true,
    },
    {
      id: 4,
      name: 'Derick Maximinus',
      avatar: '4.jpg',
      registered: '2019/04/05',
      role: 'Member',
      status: 'Pending',
    },
    {
      id: 5,
      name: 'Friderik Dávid',
      avatar: '5.jpg',
      registered: '2022/03/25',
      role: 'Staff',
      status: 'Active',
    },
    {
      id: 6,
      name: 'Yiorgos Avraamu',
      avatar: '6.jpg',
      registered: '2017/01/01',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 7,
      name: 'Avram Tarasios',
      avatar: '7.jpg',
      registered: '2016/02/12',
      role: 'Staff',
      status: 'Banned',
      _selected: true,
    },
    {
      id: 8,
      name: 'Quintin Ed',
      avatar: '8.jpg',
      registered: '2023/01/21',
      role: 'Admin',
      status: 'Inactive',
    },
    {
      id: 9,
      name: 'Enéas Kwadwo',
      avatar: '9.jpg',
      registered: '2024/03/10',
      role: 'Member',
      status: 'Pending',
    },
    {
      id: 10,
      name: 'Agapetus Tadeáš',
      avatar: '10.jpg',
      registered: '2015/01/10',
      role: 'Staff',
      status: 'Active',
    },
    {
      id: 11,
      name: 'Carwyn Fachtna',
      avatar: '11.jpg',
      registered: '2014/04/01',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 12,
      name: 'Nehemiah Tatius',
      avatar: '12.jpg',
      registered: '2013/01/05',
      role: 'Staff',
      status: 'Banned',
      _selected: true,
    },
    {
      id: 13,
      name: 'Ebbe Gemariah',
      avatar: '13.jpg',
      registered: '2012/02/25',
      role: 'Admin',
      status: 'Inactive',
    },
    {
      id: 14,
      name: 'Eustorgios Amulius',
      avatar: '14.jpg',
      registered: '2011/03/19',
      role: 'Member',
      status: 'Pending',
    },
    {
      id: 15,
      name: 'Leopold Gáspár',
      avatar: '15.jpg',
      registered: '2010/02/01',
      role: 'Staff',
      status: 'Active',
    },
  ]

  const toggleDetails = (id) => {
    const position = details.indexOf(id)
    let newDetails = [...details]
    if (position === -1) {
      newDetails = [...details, id]
    } else {
      newDetails.splice(position, 1)
    }
    setDetails(newDetails)
  }

  return (
    <CSmartTable
      activePage={2}
      cleaner
      clickableRows
      columns={columns}
      columnFilter
      columnSorter
      footer
      items={items}
      itemsPerPageSelect
      itemsPerPage={5}
      pagination
      onFilteredItemsChange={(items) => {
        console.log('onFilteredItemsChange')
        console.table(items)
      }}
      onSelectedItemsChange={(items) => {
        console.log('onSelectedItemsChange')
        console.table(items)
      }}
      scopedColumns={{
        avatar: (item) => (
          <td>
            <CAvatar src={`https://assets.coreui.io/images/avatars/${item.avatar}`} />
          </td>
        ),
        registered: (item) => {
          const date = new Date(item.registered)
          const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
          return <td>{date.toLocaleDateString('en-US', options)}</td>
        },
        status: (item) => (
          <td>
            <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
          </td>
        ),
        show_details: (item) => {
          return (
            <td className="py-2">
              <CButton
                color="primary"
                variant="outline"
                shape="square"
                size="sm"
                onClick={() => {
                  toggleDetails(item.id)
                }}
              >
                {details.includes(item.id) ? 'Hide' : 'Show'}
              </CButton>
            </td>
          )
        },
        details: (item) => {
          return (
            <CCollapse visible={details.includes(item.id)}>
              <div className="p-3">
                <h4>{item.name}</h4>
                <p className="text-body-secondary">User since: {item.registered}</p>
                <CButton size="sm" color="info">
                  User Settings
                </CButton>
                <CButton size="sm" color="danger" className="ms-1">
                  Delete
                </CButton>
              </div>
            </CCollapse>
          )
        },
      }}
      selectable
      sorterValue={{ column: 'status', state: 'asc' }}
      tableFilter
      tableProps={{
        className: 'add-this-custom-class',
        responsive: true,
        striped: true,
        hover: true,
      }}
      tableBodyProps={{
        className: 'align-middle',
      }}
    />
  )
}
