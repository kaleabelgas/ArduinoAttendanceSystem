import { Card, CardContent, CardHeader, Typography } from "@mui/material";

const UserCard = ({ fname,lname,cardid,timeIn,timeOut }) => {

    const dtin = new Date(timeIn)
    const dtout = new Date(timeOut)
    let tin = (dtin.getHours() < 10 ? '0' : '') + dtin.getHours().toString() + ":" + (dtin.getMinutes() < 10 ? '0' : '') + dtin.getMinutes().toString()
    let tout = (dtout.getHours() < 10 ? '0' : '') + dtout.getHours().toString() + ":" + (dtout.getMinutes() < 10 ? '0' : '') + dtout.getMinutes().toString()
    if (!timeIn){
        tin = ""
    }
    if (!timeOut){
        tout = ""
    }
    return ( 
        <Card>
            <CardHeader title={ fname +  ' ' +lname }/>
            <CardContent>
                <Typography>Card ID: { cardid } </Typography>
                <Typography>Time in: { tin } </Typography>
                <Typography>Time out: { tout } </Typography>
            </CardContent>
        </Card>
     );
}
 
export default UserCard;