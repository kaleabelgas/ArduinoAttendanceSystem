import { Paper, Drawer, List, ListItem, ListItemText, ListItemButton, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { useState } from 'react'
const Sidebar = () => {
    // const history = useHistory()
    // const [selectedIndex, setSelectedIndex] = useState(1);\

    var selectedIndex = 0;

    const handleListItemClick = (event, index) => {
        // setSelectedIndex(index);
        if(index === 0){
            // history.push()
        }else if(index ===1){

        }
    };


    return (
        <div>

            <Drawer
                sx={{
                    paddingTop: 100
                }}
                anchor='left'
                variant='permanent'>
                <Box className="sidebar" sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <List component="nav">
                        <ListItemButton
                            selected={selectedIndex === 0}
                            onClick={(event) => handleListItemClick(event, 0)}>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                        <ListItemButton
                            selected={selectedIndex === 1}
                            onClick={(event) => handleListItemClick(event, 1)}>
                            <ListItemText primary="Users" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
        </div>
    );
}

export default Sidebar;