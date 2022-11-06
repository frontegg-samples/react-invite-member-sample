import {ContextHolder} from '@frontegg/rest-api';
import {useAuth, useLoginWithRedirect} from "@frontegg/react";
import {ThemeProvider} from '@mui/material/styles';
import {InviteButton} from "./InviteMemberButton";
import {Box, Button, styled} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import {theme} from "./theme";

const LoginButtonStyled = styled(Button)(({theme}) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    borderRadius: '8px',
    backgroundColor: '#fff',
    padding: '1rem',
    border: `1px solid ${theme.palette.grey['200']}`,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.75rem',
    cursor: 'pointer',
    color: theme.palette.grey['800'],
    fontSize: '0.875rem',
    textTransform: 'none',
}));

const LogoutButtonStyled = styled(LoginButtonStyled)(({theme}) => ({
    left: 170,
}));

function App() {
    const {isAuthenticated} = useAuth();
    const loginWithRedirect = useLoginWithRedirect();
    const logout = () => {
        const baseUrl = ContextHolder.getContext().baseUrl;
        window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className="App">
                 {isAuthenticated ? (
                    <>
                        <LogoutButtonStyled startIcon={<LogoutIcon fontSize={'small'} color={'primary'}/>}
                                                 onClick={() => logout()}>Click to logout</LogoutButtonStyled>
                        <InviteButton/>
                    </>
                ) : (
                    <LoginButtonStyled startIcon={<LoginIcon fontSize={'small'} color={'primary'}/>}
                                             onClick={() => loginWithRedirect()}>Click to
                        login in order to invite a member</LoginButtonStyled>
                )}
            </Box>
        </ThemeProvider>
    );
}

export default App;