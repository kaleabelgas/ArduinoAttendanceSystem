import { Typography, Paper,  Table, TableContainer, TableRow, TableCell, TableHead, TableBody } from "@mui/material"
import "./Users.css"
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'

const Users = () => {
    // const nav = useNavigate()
    const [users, setUsers] = useState([])
    // const [jsonData, setJsonData] = useState([])
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:4000/api/users')
            const json = await response.json()

            if (response.ok) {
                setUsers(json)
            }
        }
        fetchUsers()
    }, [])

    // const handleSubmit = async () => {
    //     nav('/register')
    // }
    return (
        <div className="users">
            <Typography
                variant="h3"
            >
                Employee List:
            </Typography>

            <TableContainer component={Paper} className="usersList">
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Address</TableCell>
                            <TableCell align="right">Contact</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Card ID</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                to={`/users/${row.cardid}`}
                                component={Link}
                                className="userrow"
                            >
                                <TableCell component="th" scope="row">
                                    {row.fname}&nbsp;{row.lname}
                                </TableCell>
                                <TableCell align="right">{row.address}</TableCell>
                                <TableCell align="right">{row.contact}</TableCell>
                                <TableCell align="right">{row.email}</TableCell>
                                <TableCell align="right">{row.cardid}</TableCell>
                                <TableCell align="right">{row.isActive ? "Active" : "Inactive"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* <Box className="addUser">
                <Paper className="addUserPaper" sx={{alignItems: 'center', justifyContent:'center', display:'flex'}}>
                    <Button variant="contained" onClick={() => handleSubmit()}>
                        Register new employee
                    </Button>
                </Paper>
            </Box> */}

        </div>
    );
}

export default Users;