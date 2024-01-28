import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom";
import "./User.css"
import { FormControl, InputLabel, Select, MenuItem, Grid, Button, Tooltip, Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, fabClasses, TextField } from "@mui/material";

const User = () => {

    const nav = useNavigate()
    const { id } = useParams()
    const [user, setUser] = useState(null)
    const [logs, setLogs] = useState([])
    const [isEditMode, setIsEditMode] = useState(false)

    const [fname, setFname] = useState()
    const [lname, setLname] = useState()
    const [address, setAddress] = useState()
    const [contact, setContact] = useState()
    const [email, setEmail] = useState()
    const [cardid, setCardid] = useState()

    const handleSubmit = async () => {
        setIsEditMode(!isEditMode)

        if (!isEditMode) return
        if (!user) return
        console.log(fname)


        const response = await fetch('/api/users/' + cardid, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fname: fname,
                lname: lname,
                address: address,
                contact: contact,
                email: email,
            })
        })
    }

    const [dateRange, setDateRange] = useState(30)

    var now = new Date()
    now.setDate(now.getDate() + 1)
    var dateBefore = new Date()
    dateBefore.setDate(now.getDate() - dateRange)

    useEffect(() => {
        dateBefore.setDate(now.getDate() - dateRange)
        console.log(dateBefore)
    }, [dateRange])

    const handleChange = (e) => {
        setDateRange(parseInt(e.target.value))
    }

    const fetchUsersLogs = async () => {
        try {
            if (user && user.fname && user.lname) {
                const logsRes = await fetch('/api/attendancelogs/byuseranddate?' + new URLSearchParams({
                    fname: user.fname,
                    lname: user.lname,
                    from: dateBefore.toISOString().substring(0, 10),
                    to: now.toISOString().substring(0, 10)

                }), {
                    method: 'GET'
                });

                const logsJson = await logsRes.json();

                if (logsRes.ok) {
                    const processedLogs = getFirstLoginLastLogoutByDay(logsJson);

                    const headers = ['Date', 'Card ID', 'First Name', 'Last Name', 'Clock in', 'Clock out', 'Hours'];

                    const dynamicData = processedLogs.map(item => ({
                        date: item.date,
                        cardid: user.cardid,
                        fname: user.fname,
                        lname: user.lname,
                        clockin: item.firstLogin,
                        clockout: item.lastLogout,
                        hours: item.hours
                    })).reverse();

                    const jsonData = [headers, ...dynamicData];


                    const csvContent = "data:text/csv;charset=utf-8," +
                        jsonData.map(row => Object.values(row).join(',')).join('\n');

                    // Create a data URI
                    const encodedUri = encodeURI(csvContent);

                    // Create a link element and trigger a download
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', user.lname + "_last_" + parseInt(dateRange) + "_days.csv");

                    // Append the link to the body and trigger a click event
                    document.body.appendChild(link);
                    link.click();

                    // Remove the link from the body
                    document.body.removeChild(link);
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userRes = await fetch('/api/users/' + id);
                const userJson = await userRes.json();

                if (userRes.ok) {
                    setUser(userJson);
                    setFname(userJson.fname)
                    setLname(userJson.lname)
                    setAddress(userJson.address)
                    setContact(userJson.contact)
                    setEmail(userJson.email)
                    setCardid(id)

                    // Check if userJson has fname and lname properties before proceeding
                    if (userJson && userJson.fname && userJson.lname) {
                        const logsRes = await fetch('/api/attendancelogs/byuser?' + new URLSearchParams({
                            fname: userJson.fname,
                            lname: userJson.lname
                        }), {
                            method: 'GET'
                        });

                        const logsJson = await logsRes.json();
                        console.log(logsJson)
                        console.log(userJson.fname)

                        if (logsRes.ok) {
                            const processedLogs = getFirstLoginLastLogoutByDay(logsJson);
                            setLogs(processedLogs);
                        }
                    }
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };
        fetchUsers()
    }, [])

    const getFirstLoginLastLogoutByDay = (logs) => {
        // Create a map to store logs by date
        const logsByDate = new Map();

        // Iterate through each log and group them by date
        logs.forEach(log => {
            const logDate = new Date(log.createdAt).toISOString().split('T')[0]; // Extract date part
            if (!logsByDate.has(logDate)) {
                logsByDate.set(logDate, []);
            }
            logsByDate.get(logDate).push(log);
        });


        const calculateHours = (start, end) => {
            if (start && end) {
                const diffInMilliseconds = new Date(end) - new Date(start);
                const hours = diffInMilliseconds / (1000 * 60 * 60);
                // Round to two decimal places
                return parseFloat(hours.toFixed(2));
            }
            return null;
        };
        // Process each group and get the firstLogin, lastLogout, and date
        const processedLogs = [];
        logsByDate.forEach((logsForDate, date) => {
            if (logsForDate.length > 0) {
                let firstLogin = null;
                let lastLogout = null;
                logsForDate.forEach(log => {
                    if (log.isTimeIn) {
                        if (!firstLogin) {
                            firstLogin = log.createdAt;
                        }
                    } else {
                        lastLogout = log.createdAt;
                    }
                });
                // Format the timestamps to display only HH:mm
                const formatTime = (timestamp) => {
                    const time = new Date(timestamp);
                    const hours = time.getHours().toString().padStart(2, '0');
                    const minutes = time.getMinutes().toString().padStart(2, '0');
                    return `${hours}:${minutes}`;
                };

                // Add an object with formatted firstLogin, lastLogout, date, and hours to the result array
                processedLogs.push({
                    date: date,
                    firstLogin: firstLogin ? formatTime(firstLogin) : null,
                    lastLogout: lastLogout ? formatTime(lastLogout) : null,
                    hours: calculateHours(firstLogin, lastLogout),
                });
                processedLogs.reverse()
            }
        });

        // Function to calculate hours between two timestamps
        return processedLogs;
    };
    if (user === null) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="user" disableGutters maxWidth={false} sx={{ alignItems: "center", display: "flex" }}>
            <Paper className="userpaper">
                <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    {isEditMode ?
                        <div>
                            <TextField defaultValue={fname} inputProps={{ style: { padding: '10px' } }} onChange={(e) => { setFname(e.target.value) }} />
                            <TextField defaultValue={lname} inputProps={{ style: { padding: '10px' } }} onChange={(e) => { setLname(e.target.value) }} />
                        </div> :
                        <Typography variant="h4"> {fname} {lname} </Typography>
                    }
                    <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
                        {isEditMode ? "Save" : "Edit"}
                    </Button>
                </Box>
                <Box mb={1}>
                    <Typography variant="body1"> Card ID: {user.cardid} </Typography>
                </Box>
                <Box mb={1}>
                    {isEditMode ?
                        <div>
                            <TextField defaultValue={address} inputProps={{ style: { padding: '5px' } }} onChange={(e) => { setAddress(e.target.value) }} />
                        </div> :
                        <Typography variant="body1"> Address: {address} </Typography>
                    }
                </Box>
                <Box mb={1}>
                    {isEditMode ?
                        <div>
                            <TextField defaultValue={contact} inputProps={{ style: { padding: '5px' } }} onChange={(e) => { setContact(e.target.value) }} />
                        </div> :
                        <Typography variant="body1"> Contact: {contact} </Typography>
                    }
                </Box>
                <Box mb={1}>
                    {isEditMode ?
                        <div>
                            <TextField defaultValue={email} inputProps={{ style: { padding: '5px' } }} onChange={(e) => { setEmail(e.target.value) }} />
                        </div> :
                        <Typography variant="body1"> Email: {email} </Typography>
                    }
                </Box>
                <TableContainer className="loglist">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time in</TableCell>
                                <TableCell>Time out</TableCell>
                                <TableCell>Hours rendered</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    to={`/users/${row.cardid}`}
                                    className="userrow"
                                >
                                    <TableCell component="th" scope="row">
                                        {row.date}
                                    </TableCell><TableCell component="th" scope="row">
                                        {row.firstLogin}
                                    </TableCell><TableCell component="th" scope="row">
                                        {row.lastLogout}
                                    </TableCell><TableCell component="th" scope="row">
                                        {row.hours}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Container disableGutters className="downloadrequest" style={{ margin: 0 }} maxWidth={false}>
                    <Paper className="downloadrequestpaper">
                        <Grid container columnSpacing={2} alignItems="center" justifyContent="center" height="100%">
                            {/* <Grid item>
                            <Typography
                                variant="h6"
                            >
                                Download Report:
                            </Typography>
                        </Grid> */}
                            <Grid item>
                                <FormControl>
                                    <InputLabel>Select duration</InputLabel>
                                    <Select
                                        value={dateRange}
                                        label="Age"
                                        onChange={handleChange}
                                        sx={{
                                            width: 250
                                        }}
                                    >
                                        <MenuItem value={30}>Last 30 days</MenuItem>
                                        <MenuItem value={90}>Last 90 days</MenuItem>
                                        <MenuItem value={180}>Last 180 days</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={() => fetchUsersLogs()}>
                                    Download Logs
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Paper>
        </Container>
    );
}

export default User;