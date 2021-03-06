import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useContext } from 'react';
import ProfileServiceClient from '../classes/ProfileServiceClient';
import AuthenticatedUserContext from '../contexts/AuthenticatedUserContext';

const profileServiceClient = new ProfileServiceClient();

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const ProfileForm = (props: { onSuccess: () => void }) => {
  const authenticatedUser = useContext(AuthenticatedUserContext);
  const { getAccessTokenSilently, user } = useAuth0();
  const { onSuccess } = props;
  const toast = useToast();
  return (
    <Formik
      enableReinitialize
      onSubmit={async values => {
        const token = await getAccessTokenSilently();
        if (!user || !user.email) {
          throw new Error('no user');
        }
        try {
          if (values.firstName === '' || values.lastName === '' || values.username === '') {
            toast({
              title: 'Incomplete information.',
              description: 'Please fill in the required fields.',
              status: 'error',
              duration: 9000,
              isClosable: true,
            });
          } else {
            await profileServiceClient.patchProfile({
              token,
              email: user.email,
              username: values.username,
              firstName: values.firstName,
              lastName: values.lastName,
              pronouns: values.pronouns,
              occupation: values.occupation,
              bio: values.bio,
            });
            toast({
              title: 'Account updated.',
              description: "We've updated your account for you.",
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
            authenticatedUser.refresh();
            onSuccess();
          }
        } catch (err) {
          toast({
            title: 'Something went wrong, please try again.',
            description: (err as Error).message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      }}
      initialValues={{
        username: authenticatedUser.profile?.username || '',
        firstName: authenticatedUser.profile?.firstName || '',
        lastName: authenticatedUser.profile?.lastName || '',
        email: authenticatedUser.profile?.email || '',
        pronouns: authenticatedUser.profile?.pronouns || '',
        occupation: authenticatedUser.profile?.occupation || '',
        bio: authenticatedUser.profile?.bio || '',
      }}>
      {({ handleChange, handleBlur, values }) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Box p='4' borderWidth='1px' borderRadius='lg' maxWidth='800'>
            <Form>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  id='firstName'
                  name='firstName'
                  onChange={handleChange}
                  onTouchStart={handleBlur}
                  value={values.firstName}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  id='lastName'
                  name='lastName'
                  onChange={handleChange}
                  onTouchStart={handleBlur}
                  value={values.lastName}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  id='username'
                  name='username'
                  onChange={handleChange}
                  onTouchStart={handleBlur}
                  value={values.username}
                />
              </FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name='email'
                onChange={handleChange}
                onTouchStart={handleBlur}
                value={values.email}
                disabled
              />
              <FormLabel>Pronouns</FormLabel>
              <Input
                name='pronouns'
                onChange={handleChange}
                onTouchStart={handleBlur}
                value={values.pronouns}
              />
              <FormLabel>Occupation</FormLabel>
              <Input
                name='occupation'
                onChange={handleChange}
                onTouchStart={handleBlur}
                value={values.occupation}
              />
              <FormLabel>Bio</FormLabel>
              <Textarea
                name='bio'
                onChange={handleChange}
                onTouchStart={handleBlur}
                value={values.bio}
                placeholder='Give users a small bio about you'
              />
              <Button type='submit'>Submit</Button>
            </Form>
          </Box>
        </div>
      )}
    </Formik>
  );
};

export default ProfileForm;
