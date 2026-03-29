import { COffcanvas, COffcanvasHeader, COffcanvasTitle, COffcanvasBody } from '@coreui/react'
import { CForm, CFormInput, CFormLabel, CFormSelect, CFormCheck, CButton } from '@coreui/react'
import { useState } from 'react'
import './Registration.css'

export default function Registration() {
    const [name, setName] = useState('')
    const [ipAddress, setIpAddress] = useState('')
    const [id, setId] = useState('')
    const [model, setModel] = useState('')
    const [group, setGroup] = useState('')
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <button className="register-button" onClick={() => setVisible(true)}>Register Device</button>
            <COffcanvas visible={visible} onHide={() => setVisible(false)} placement='end'>
                <COffcanvasHeader>
                    <COffcanvasTitle>Device Registration</COffcanvasTitle>
                </COffcanvasHeader>
                <COffcanvasBody>
                    <CForm>
                        <CFormInput type="text" label="Name" value={name} onChange={(e) => setName(e.target.value)}></CFormInput>
                        <CFormInput type="text" label="IP Address" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)}></CFormInput>
                        <CFormInput type="text" label="ID" value={id} onChange={(e) => setId(e.target.value)}></CFormInput>
                        <CFormInput type="text" label="Model" value={model} onChange={(e) => setModel(e.target.value)}></CFormInput>
                        <CFormInput type="text" label="Group" value={group} onChange={(e) => setGroup(e.target.value)}></CFormInput>
                    </CForm>
                </COffcanvasBody>
            </COffcanvas>
        </div>
    )
}