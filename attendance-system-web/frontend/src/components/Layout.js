import { Drawer, List, ListItemText, ListItemButton, Box, Typography, ListItem } from "@mui/material"
import './Layout.css'
import Paper from "@mui/material/Paper";
import RightPanel from "./RightPanel";

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const drawerWidth = 200;

const Layout = ({ children }) => {

    const navigate = useNavigate()
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        if (index === 0) {
            navigate('/')
        } else if (index === 1) {
            navigate('/users')
        }
    };

    return (
        <div className="root">
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        paddingTop: "10pxpx"
                    }
                }}
                variant="permanent"
                anchor="left"

            >
                <Box className="sidebar" sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <List component="nav">
                        <ListItem>
                            <ListItemText
                                disableTypography
                                primary={<Typography variant="h3" style={{ fontWeight: 600 }}>Project Uno</Typography>}
                            />
                        </ListItem>
                        <ListItemButton
                            selected={selectedIndex === 0}
                            onClick={(event) => handleListItemClick(event, 0)}>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                        <ListItemButton
                            selected={selectedIndex === 1}
                            onClick={(event) => handleListItemClick(event, 1)}>
                            <ListItemText primary="Employees" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
            <div className="page">
                {children}
            </div>
            <RightPanel />
        </div>
    );
}

export default Layout