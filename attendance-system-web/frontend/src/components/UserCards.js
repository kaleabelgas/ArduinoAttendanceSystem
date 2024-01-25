import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { Container, Grid } from "@mui/material";
import { json } from "react-router-dom";





const UserCards = () => {

    const [users, setUsers] = useState([]) 
    // const [jsonData, setJsonData] = useState([])
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/users')
            const json = await response.json()

            if(response.ok){
                setUsers(json)
            }
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
        <Container disableGutters>
            <Grid container spacing={2}>
                {users && users.map(user => (
                    <Grid item key={user._id} >
                        <UserCard {...user }/>
                    </Grid>
                ))}
            </Grid>
        </Container>
     );
}
 
export default UserCards;