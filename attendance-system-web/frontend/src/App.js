import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from "@mui/material/CssBaseline"
import Layout from './components/Layout';

// pages & components
import Home from './pages/Home'
import Users from './pages/Users';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Register from './pages/Register';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins',
    h3: {
      "fontWeight": 600,
      "fontSize": 25
    },
    h6: {
      // "fontWeight": 600
    }
  },
  palette: {
    background: {
      default: '#f9f9f9'
    }
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          {/* <Navbar />
          <Sidebar/> */}
          <div className="content">
            <Layout>
              <Routes>
                <Route 
                  exact
                  path="/"
                  element={<Home />}
                />
                <Route 
                  exact
                  path="/users"
                  element={<Users />}
                />
                <Route 
                  exact
                  path="/register"
                  element={<Register />}
                />
              </Routes>
            </Layout>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
