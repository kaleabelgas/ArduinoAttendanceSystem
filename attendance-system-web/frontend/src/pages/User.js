import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./User.css"
import { Link, Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const User = () => {

    const { id } = useParams()
    const [user, setUser] = useState(null)
    const [logs, setLogs] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userRes = await fetch('/api/users/' + id);
                const userJson = await userRes.json();

                if (userRes.ok) {
                    setUser(userJson);

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
                    firstLogin: firstLogin ? formatTime(firstLogin) : null,
                    lastLogout: lastLogout ? formatTime(lastLogout) : null,
                    date: date,
                    hours: calculateHours(firstLogin, lastLogout),
                });
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
                <Box mb={2}>
                    <Typography variant="h4"> {user.fname} {user.lname} </Typography>
                </Box>
                <Box mb={1}>
                    <Typography variant="body1"> Address: {user.address} </Typography>
                </Box>
                <Box mb={1}>
                    <Typography variant="body1"> Contact: {user.contact} </Typography>
                </Box>
                <Box mb={1}>
                    <Typography variant="body1"> Email: {user.email} </Typography>
                </Box>
                <Box mb={1}>
                    <Typography variant="body1"> Card ID: {user.cardid} </Typography>
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
            </Paper>
        </Container>
    );
}

export default User;