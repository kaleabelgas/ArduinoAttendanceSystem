import { useNavigate } from 'react-router-dom'
import { Button, TextField, FormLabel } from '@mui/material'
import "./Register.css"
import { useEffect, useState } from "react";
import { isDisabled } from '@testing-library/user-event/dist/utils';

const Register = () => {
    const nav = useNavigate()
    const handleCancel = async () => {
        nav(-1)
    }
    const handleSubmit = async () => {
        const response = await fetch('http://localhost:4000/api/users', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fname: fname,
                lname: lname,
                address: address,
                contact: contact,
                email: email,
                isActive: true,
                cardid: cardid
            })
        }).then(nav(-1))
        
    }

    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [address, setAddress] = useState('')
    const [contact, setContact] = useState('')
    const [email, setEmail] = useState('')
    const [cardid, setCardid] = useState('')
    const [isValid, setIsValid] = useState(true)

    const isFormValid = () => {
        return fname.trim() !== '' && lname.trim() !== '' && address.trim() !== '' && contact.trim() !== '' && email.trim() !== '' && cardid.trim() !== '' && isValid
    }

    const handleNumberChange = (event) => {
        const value = event.target.value;
        // Check if the value is a number with exactly 5 digits
        setIsValid(/^\d{9,12}$/.test(value))
        setCardid(event.target.value)
    }; 

    return (
        <div className="register">
            <form noValidate autoComplete='off'>
                <FormLabel className='field'>Register Employee</FormLabel>
                <div className='name'>
                    <TextField
                        className='field'
                        label="First name"
                        required
                        onChange={(e) => setFname(e.target.value)}
                    />
                    <TextField
                        className='field'
                        label="Last name"
                        required
                        onChange={(e) => setLname(e.target.value)}
                    />
                </div>
                <TextField
                    className='field'
                    label="Address"
                    required
                    fullWidth
                    onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                    className='field'
                    label="Contact"
                    required
                    fullWidth
                    onChange={(e) => setContact(e.target.value)}
                />
                <TextField
                    className='field'
                    label="Email"
                    required
                    fullWidth
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    className='field'
                    label="Card ID"
                    required
                    fullWidth
                    onChange={(e) => handleNumberChange(e)}
                    error={!isValid} // Highlight the TextField if not valid
                    helperText={!isValid ? 'Must be a number with 9 to 11-digits!' : ''}
                />
                <Button className='cancel' variant="contained" onClick={() => handleSubmit()} disabled={!isFormValid()}>
                    Submit
                </Button>
                <Button className='cancel' variant="outlined" onClick={() => handleCancel()}>
                    Cancel
                </Button>
            </form>
        </div>
    );
}

export default Register;