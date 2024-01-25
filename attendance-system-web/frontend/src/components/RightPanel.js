import { useEffect, useState } from 'react';
import './Layout.css'
import Paper from "@mui/material/Paper";
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function convertDate (date){
    var date = new Date(date)
    var mins = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes().toString()
    var hours = (date.getHours() < 10 ? '0' : '') + date.getHours().toString()
    var dateDay = date.getDate().toString()
    var month = ((date.getMonth() + 1 < 10 ? '0' : '')).toString() + (date.getMonth() + 1).toString()
    var dateString = date.getHours() + ":" + mins + ":" + hours + " " + month + "-" + dateDay
    return (dateString)
}

const RightPanel = () => {
    const [logs, setLogs] = useState([])
    const [trigger, setTrigger] = useState([])
    // const [jsonData, setJsonData] = useState([])
    useEffect(() => {
        const fetchLogs = async () => {
            const response = await fetch('/api/attendancelogs/count/8')
            const json = await response.json()

            if(response.ok){
                setLogs(json)
            }
        }
        fetchLogs()
    }, [trigger])

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:4000/sse');
    
        // Handle incoming SSE events
        eventSource.onmessage = (event) => {
          // This will be triggered every 2 seconds with the blank message
          console.log('Received SSE');
          setTrigger((prevTrigger) => [...prevTrigger, event.data])
        };
    
        // Clean up the EventSource connection when the component unmounts
        return () => {
          eventSource.close();
        };
      }, []);

    return ( 
        <div>
                <Paper className="rightPanel" elevation={3}>
                    <Typography variant="h5">Latest logs:</Typography>
                    <List>
                        {logs && logs.map(log => (
                            <ListItem key={log._id}>
                                <ListItemText>
                                    {/* {console.log(log)} */}
                                    {log.user && log.user.fname} {log.user && log.user.lname}  <br/>
                                    {log.isTimeIn && log.isTimeIn ? "Clocked in: " : "Clocked Out: "}
                                    {convertDate(log.createdAt)}
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
        </div>
     );
}
 
export default RightPanel;