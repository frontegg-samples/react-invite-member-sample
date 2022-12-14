# Getting Started

This sample is demonstrating how you can simply implement your own invite a member dialog using Frontegg's custom hooks. In this sample we are using our suggestion of a button opening a dialog using a friendlly UX UI.

You will be able to use the simple logic from this sample to immplement it with your own UX UI.

### `npm install`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You will first need to login by clicking the relevant button, and once you will be logged in you will be able to click the invite member button and see the invite dialog modal.

The invite dialog includes 2 differrent invite methods - invite by email or invite by link.

1. Invite by link will be easilly done by clicking the copy link button.
2. Invite by email will be done by submitting the form. In this sample, the form includes an email field which is required, therefore the user will not be able to submit the form unless filling a valid email, and a name field which is optional. 
You will be also able to simply add a role field based on the code you will find while sending the request. In this sample we skipped the role field, and sending an Admin role as a default for any invite request.

#### Copy invite link method

```ts
import { useCallback, useState, useEffect } from 'react';

export const InviteModal = ({ onClose }) => {
const [ linkCopied, setLinkCopied ] = useState(false);
const { inviteTokenState } = useAuthTeamState();
const { createInvitationLink, getInvitationLink } = useAuthTeamActions();
const routes = useAuthRoutes();

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

useEffect(() => {
    getInvitationLink();
}, [getInvitationLink])

return (<Button
            variant="text"
            startIcon={linkCopied ? <CheckIcon fontSize="small"/> :
                <AttachmentIcon fontSize="small"/>}
            onClick={handleCreateInviteLink}
        >
            {linkCopied ? 'Copied!' : 'Copy invite link'}
        </Button>                        
    );
};
```

#### Invite by an email method

```ts
export const InviteModal = ({ onClose }) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ userInvited, setUserInvited ] = useState(false);
    const [ inviteError, setInviteError ] = useState<string | undefined>();
    const { addUser } = useAuthActions();
    const { roles } = useAuthTeamState();
    const { loadRoles } = useAuthTeamActions();

    const initialValue = useMemo(
        () => ({
            name: '',
            email: '',
        }),
        []
    );

    const handleInvite = useCallback(
        ({ name, email } : any, { resetForm } : any) => {
            setInviteError(undefined);
            setIsLoading(true);
            addUser({
                name,
                email,
                 // Specify the role you want to assign the invited user to, from your application roles
                roleIds: roles.filter(({key}) => key.toLowerCase() === 'admin').map(({id}) => id),
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
        loadRoles();
    }, [getInvitationLink, loadRoles])

    return (
        <Formik initialValues={initialValue} onSubmit={handleInvite}>
            {({dirty, isValid, values, errors, handleSubmit, handleBlur, handleChange} : any) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Input
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
                            name={'email'}
                            placeholder={'Enter email address'}
                            size="small"
                            value={values.email}
                            error={(dirty && !!errors.email) || !!inviteError}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <InviteButtonStyled
                                isSent={userInvited}
                                color={'primary'}
                                variant="contained"
                                disabled={!userInvited && (!dirty || !isValid)}
                                type="submit"
                            >
                                {userInvited ? 'Sent!' : 'Invite'}
                        </InviteButtonStyled>
                    </form>
                );
            }}
        </Formik>
    );
};

```


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
