// Demo moderator accounts for the mocked, front-end-only sign-in.
// Anything shipped to the browser is readable by anyone, so a real deployment must check
// admin credentials on the server and issue a role from there; never ship passcodes like this.
export const DEMO_ADMINS = [
    { email: 'admin@vsb.student', passcode: 'vsb-admin', name: 'Campus Moderator' },
];
