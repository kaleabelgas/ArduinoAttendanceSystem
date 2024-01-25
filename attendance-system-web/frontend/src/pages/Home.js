import UserCards from "../components/UserCards"
import { Typography, Paper, Container, FormControl, InputLabel, Select, MenuItem, Grid, Button } from "@mui/material"
import "./Home.css"
import { useEffect, useState } from "react";

const Home = () => {

    const [dateRange, setDateRange] = useState(30)

    var now = new Date()
    now.setDate(now.getDate() + 1)
    var dateBefore

    useEffect(() => {
        dateBefore = new Date()
        dateBefore.setDate(now.getDate() - dateRange)
        console.log(dateBefore)
    }, [dateRange])

    const handleChange = (e) => {
        setDateRange(parseInt(e.target.value))
    }

    const handleSubmit = async () => {
        const response = await fetch('/api/attendancelogs/bydaterange?' + new URLSearchParams({
            from: dateBefore.toISOString().substring(0, 10),
            to: now.toISOString().substring(0, 10)
        }), {
            method: 'GET'
        })
        const json = await response.json()

        const flattenedData = json.map(item => flattenObject(item));
        // console.log(json)

        const csvContent = "data:text/csv;charset=utf-8," +
            flattenedData.map(row => Object.values(row).join(',')).join('\n');

        // Create a data URI
        const encodedUri = encodeURI(csvContent);

        // Create a link element and trigger a download
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', "last_" + parseInt(dateRange) + "_days.csv");

        // Append the link to the body and trigger a click event
        document.body.appendChild(link);
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);
    }

    function flattenObject(obj, parentKey = '') {
        return Object.keys(obj).reduce((acc, key) => {
          const newKey = parentKey ? `${parentKey}.${key}` : key;
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Recursively flatten nested objects
            return { ...acc, ...flattenObject(obj[key], newKey) };
          } else {
            return { ...acc, [newKey]: obj[key] };
          }
        }, {});
      }

    return (
        <div className="home">
            <Typography
                variant="h3"
            >
                Welcome!
            </Typography>
            <div className="userCards">
                <UserCards />
            </div>
            <Container disableGutters className="downloadrequest">
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
                            <Button variant="contained" onClick={() => handleSubmit()}>
                                Download Report
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </div>
    )
}

export default Home