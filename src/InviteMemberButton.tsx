import { useState } from 'react';
import { styled, Typography, Button, Box } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { InviteModal } from './InviteMemberModel'

const InviteButtonContainerStyled = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0
});

const InviteButtonStyled = styled(Button)(({ theme }) => ({
    display: 'flex',
    borderRadius: '8px',
    backgroundColor: '#fff',
    padding: '1rem',
    border: `1px solid ${theme.palette.grey['200']}`,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.75rem',
    '&:hover': {
        backgroundColor: theme.palette.primary.contrastText,
    },
    '.MuiTypography-root': {
        color: theme.palette.grey['800'],
        fontSize: '0.875rem',
        textTransform: 'none'
    },
}));

export const InviteButton = () => {
    const [isInviteModalShow, setIsInviteModalShow] = useState(false);

    return (
        <>
            <InviteButtonContainerStyled>
                <InviteButtonStyled startIcon={<PersonAddAltIcon fontSize="small" color='primary'/>} onClick={() => setIsInviteModalShow(true)}>
                    <Typography variant={'subtitle1'}>{'Invite a member'}</Typography>
                </InviteButtonStyled>
            </InviteButtonContainerStyled>
            {isInviteModalShow && <InviteModal onClose={() => setIsInviteModalShow(false)} />}
        </>

    );
};
