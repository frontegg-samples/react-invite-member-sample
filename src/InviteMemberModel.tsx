import { useCallback, useState, VFC, useMemo, useEffect } from 'react';
import { useAuthActions, useAuthRoutes, useAuthTeamActions, useAuthTeamState } from '@frontegg/react';
import copy from 'clipboard-copy';
import * as React from 'react';
import {ButtonProps, styled, Grid, Button, Typography, Input, Box, CircularProgress} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Formik } from 'formik';
import {validateEmail, validateSchema} from "./validations";

interface InviteModalProps {
    onClose: () => void;
}

const InviteModalStyled = styled(Grid)(({theme}) => ({
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 100,
    background: '#fff',
    width: '353px',
    height: '352px',
    border: `1px solid ${theme.palette.grey[200]}`,
    boxShadow: `0px 8px 16px rgba(5, 6, 11, 0.08)`,
    padding: '0.25rem 1.5rem 1.25rem 1.5rem',
    borderRadius: '8px',
}));

const HeaderStyled = styled(Grid)(({theme}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    '.MuiSvgIcon-root': {
        color: theme.palette.primary.light,
    },
    span: {
        marginLeft: 'auto',
        cursor: 'pointer',
    },
}));

const FormStyled = styled(Grid)({
    width: '100%',
    gap: '1rem',
});

const FooterStyled = styled(Grid)({
    marginTop: 'auto',
    borderTop: `1px solid #DADAE1`,
    paddingTop: '1rem',
});

interface InviteButtonStyledProps extends ButtonProps {
    isSent: boolean;
}

const InviteButtonStyled = styled(Button)<InviteButtonStyledProps>(({isSent, theme}) => ({
    textTransform: 'none',
    fontSize: '0.875rem',
    '&.MuiButton-root:not(:disabled)': {
        transition: 'background-color .2s ease-in',
        backgroundColor: isSent ? theme.palette.success.light : theme.palette.primary.main,
        borderColor: isSent ? theme.palette.success.light : theme.palette.primary.main,
    },
}));

export const InviteModal = ({ onClose }: any) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ linkCopied, setLinkCopied ] = useState(false);
    const [ userInvited, setUserInvited ] = useState(false);
    const [ inviteError, setInviteError ] = useState<string | undefined>();
    const { addUser } = useAuthActions();
    const routes = useAuthRoutes();
    const { inviteTokenState } = useAuthTeamState();
    const { roles } = useAuthTeamState();
    const { loadRoles, createInvitationLink, getInvitationLink } = useAuthTeamActions();

    const initialValue = useMemo(
        () => ({
            name: '',
            email: '',
        }),
        []
    );

    const validationSchema = useMemo(
        () =>
            validateSchema({
                email: validateEmail('Mail is in invalid form', 'Mail is required'),
            }),
        []
    );

    const handleCreateInviteLink = useCallback(() => {
        const handleLink = (token: string | undefined | null) => {
            copy(token ? `${window.location.origin}${routes.signUpUrl}?invitationToken=${token}` : '');
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 5000);
        };

        if (inviteTokenState?.token) {
            handleLink(inviteTokenState?.token);
            return;
        }

        createInvitationLink({
            callback: (createdToken, error) => {
                getInvitationLink();
                if (!error) {
                    handleLink(createdToken);
                }
            },
        });
    }, [routes.signUpUrl, inviteTokenState, getInvitationLink, createInvitationLink]);

    const handleInvite = useCallback(
        ({ name, email } : any, { resetForm } : any) => {
            setInviteError(undefined);
            setIsLoading(true);
            addUser({
                name,
                email,
                roleIds: roles.filter(({key}) => key.toLowerCase() === 'admin').map(({id}) => id), // Specify the role to assign to the invited user from your application roles
                callback: (response, error) => {
                    setIsLoading(false);
                    setInviteError(error);
                    if (!error) {
                        setUserInvited(true);
                        resetForm()
                        setTimeout(() => setUserInvited(false), 5000);
                    }
                },
            });

        },
        [addUser, roles, setUserInvited, setIsLoading, setInviteError]
    );

    useEffect(() => {
        getInvitationLink();
        loadRoles();
    }, [getInvitationLink, loadRoles])

    return (
        <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleInvite}>
            {({dirty, isValid, values, errors, handleSubmit, handleBlur, handleChange} : any) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <InviteModalStyled container>
                            <HeaderStyled container alignItems="center">
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <PersonAddAltIcon fontSize="small" sx={{marginRight: '8px'}}/>
                                    <Typography variant={'subtitle1'}>{'Invite a member to your app!'}</Typography>
                                </Box>
                                <CloseIcon sx={{cursor: 'pointer'}} onClick={onClose} fontSize="small"/>
                            </HeaderStyled>
                            <FormStyled container flexDirection="column" alignItems={'baseline'}>
                                <Input
                                    sx={{width: '240px', fontSize: '14px'}}
                                    name="name"
                                    autoFocus
                                    placeholder={'Enter name'}
                                    size="small"
                                    value={values.name}
                                    error={dirty && !!errors.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Input
                                    sx={{width: '240px', fontSize: '14px', marginTop: '8px'}}
                                    name={'email'}
                                    placeholder={'Enter email address'}
                                    size="small"
                                    value={values.email}
                                    error={(dirty && !!errors.email) || !!inviteError}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </FormStyled>
                            <FooterStyled container justifyContent="space-between">
                                <Grid item>
                                    <Button
                                        variant="text"
                                        startIcon={linkCopied ? <CheckIcon fontSize="small"/> :
                                            <AttachmentIcon fontSize="small"/>}
                                        onClick={handleCreateInviteLink}
                                        sx={{ marginLeft: '-4px', fontSize: '14px', textTransform: 'none' }}
                                    >
                                        {linkCopied ? 'Copied!' : 'Copy invite link'}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <InviteButtonStyled
                                        isSent={userInvited}
                                        color={'primary'}
                                        variant="contained"
                                        disabled={!userInvited && (!dirty || !isValid)}
                                        type="submit"
                                        startIcon={isLoading? <CircularProgress style={{ maxWidth: '15px', maxHeight: '15px', color: 'white' }}/> : undefined}
                                    >
                                        {userInvited ? 'Sent!' : 'Invite'}
                                    </InviteButtonStyled>
                                </Grid>
                            </FooterStyled>
                        </InviteModalStyled>
                    </form>
                );
            }}
        </Formik>
    );
};
