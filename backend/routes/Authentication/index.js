router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    const frontendUrl = process.env.NODE_ENV === 'production'
      ? 'https://skillswap-sable-xi.vercel.app'
      : 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);