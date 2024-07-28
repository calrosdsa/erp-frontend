import React, { Suspense } from "react";
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import { IndexHtmlTransform } from "vite";
import ColorSchemeToggle from "~/components/shared/button/ColorSchemeToggle";
import GoogleIcon from "~/components/shared/icon/GoogleIcon";
import { useFetcher } from "@remix-run/react";
import { action } from "./route";
const SignInClient = ({}:{
}) =>{
  const fetcher = useFetcher<typeof action>()

    return (
        <CssVarsProvider defaultMode="dark" disableTransitionOnChange >
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
        />
      <Box
        sx={(theme) => ({
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
              backgroundColor: 'rgba(19 19 24 / 0.4)',
            },
        })}
      >
        <Box
          sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100dvh',
              width: '100%',
              px: 2,
            }}
            >
          <Box
            component="header"
            sx={{
              py: 3,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton variant="soft" color="primary" size="sm">
                <BadgeRoundedIcon />
              </IconButton>
              <Typography level="title-lg">Company logo</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                },
              [`& .MuiFormLabel-asterisk`]: {
                  visibility: 'hidden',
              },
            }}
            >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component="h1" level="h3">
                  Sign in
                </Typography>
                <Typography level="body-sm">
                  New to company?{' '}
                  <Link href="#replace-with-a-link" level="title-sm">
                    Sign up!
                  </Link>
                </Typography>
              </Stack>
              <Button
                variant="soft"
                color="neutral"
                fullWidth
                startDecorator={<GoogleIcon />}
                >
                Continue with Google
              </Button>
            </Stack>
            <Divider
              sx={(theme) => ({
                  [theme.getColorSchemeSelector('light')]: {
                      color: { xs: '#FFF', md: 'text.tertiary' },
                    },
                })}
                >
              or
            </Divider>
            <Stack gap={4} sx={{ mt: 2 }}>
              <fetcher.Form
              method="post"
                // onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                //     event.preventDefault();
                //     const formData = new FormData(event.currentTarget);
                //     const data = Object.fromEntries<any>(
                //       formData.entries(),
                //     );
                //     console.log(data)
                
                // }}
                >
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" />
                </FormControl>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Checkbox size="sm" label="Remember me" name="persistent" />
                    <Link level="title-sm" href="#replace-with-a-link">
                      Forgot your password?
                    </Link>
                  </Box>
                  <Button type="submit" fullWidth loading={fetcher.state == "submitting"}>
                    Sign in 
                  </Button>
                </Stack>
              </fetcher.Form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © Your company {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
    
    </CssVarsProvider>
    )
}

export default SignInClient;