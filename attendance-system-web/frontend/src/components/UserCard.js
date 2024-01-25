import { Card, CardContent, CardHeader, Typography } from "@mui/material";

const UserCard = ({ fname,lname,cardid,timeIn,timeOut }) => {

    const dtin = new Date(timeIn)
    const dtout = new Date(timeOut)
    const tin = (dtin.getHours() < 10 ? '0' : '') + dtin.getHours().toString() + ":" + (dtin.getMinutes() < 10 ? '0' : '') + dtin.getMinutes().toString()
    const tout = (dtout.getHours() < 10 ? '0' : '') + dtout.getHours().toString() + ":" + (dtout.getMinutes() < 10 ? '0' : '') + dtout.getMinutes().toString()

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