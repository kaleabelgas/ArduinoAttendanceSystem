import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { Container, Grid } from "@mui/material";





const UserCards = () => {

    const [logs, setLogs] = useState([])

    const [users, setUsers] = useState([])

    var tom = new Date()
    var now = new Date()
    tom.setDate(now.getDate() + 1)


    // const [jsonData, setJsonData] = useState([])
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/attendancelogs/bydaterange?' + new URLSearchParams({
                from: now.toISOString().substring(0, 10),
                to: tom.toISOString().substring(0, 10)
            }), {
                method: 'GET'
            })
            const json = await response.json()

            if (!response.ok) {
                return
            }
            setLogs(json)
            // console.log(json)
            const uniqueUserIds = [...new Set(json.map(log => log.user._id))]
            
            const uniqueUsersList = uniqueUserIds.map(userId => {
                const userLogs = json.filter(log => log.user._id === userId)
                const firstLogin = userLogs.find(log => log.isTimeIn === true)
                const lastLogout = userLogs.reverse().find(log => log.isTimeIn === false)
                const timeIn = firstLogin?.createdAt ?? null
                const timeOut = lastLogout?.createdAt ?? null
                const fname = userLogs[0]['fname']
                const lname = userLogs[0]['lname']
                const cardid = userLogs[0]['cardid']
                console.log(timeIn)
                return { fname, lname, cardid, timeIn, timeOut, userId }
                
            })
            // console.log(uniqueUsersList)
            setUsers(uniqueUsersList ?? [])

        }
        fetchUsers()
    }, [])

    // const fetchLog = async (fname, lname) => {
    //     const response = await fetch ('/api/attendancelogs/byuser?' + new URLSearchParams({
    //         fname: fname,
    //         lname: lname
    //     }), {
    //         method: 'GET'
    //     })
    //     const results = await response.json()
    //     // console.log('/api/attendancelogs/byuser?' + new URLSearchParams({
    //     //     fname: fname,
    //     //     lname: lname
    //     // }))
    //     // console.log((results[results.length - 1].isTimeIn).toString())
    //     console.log(results[results.length - 1].isTimeIn)
    //     console.log(typeof(JSON.parse(results[results.length - 1].isTimeIn)))
    //     setJsonData(JSON.parse(results[results.length - 1].isTimeIn))
    //     return JSON.parse(results[results.length - 1].isTimeIn)
    // }

    return (
        <Container disableGutters style={{margin:0}}>
            <Grid container spacing={2} justifyContent="flex-start">
                {users && users.map(user => (
                    <Grid item key={user.userId} >
                        <UserCard {...user} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default UserCards;