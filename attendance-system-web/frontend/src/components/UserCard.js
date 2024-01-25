import { Card, CardContent, CardHeader, Typography } from "@mui/material";

const UserCard = ({ fname,lname,address,contact,email,isActive,cardid }) => {
    return ( 
        <Card>
            <CardHeader title={ fname +  ' ' +lname }/>
            <CardContent>
                <Typography>Card ID: { cardid } </Typography>
            </CardContent>
        </Card>
     );
}
 
export default UserCard;