import {
    handleAuth,
    handleCallback,
    handleLogin,
    handleLogout,
    handleProfile
  } from '@auth0/nextjs-auth0';
  import type { NextApiRequest, NextApiResponse } from 'next';
  
  export default handleAuth({
    login: handleLogin,
    logout: handleLogout,
    profile: handleProfile,
  
    callback: async (req: NextApiRequest, res: NextApiResponse) => {
        try {
          const result = await handleCallback(req, res);
          console.log("✅ CALLBACK OK :", result);
          return result;
        } catch (error) {
          console.error("❌ CALLBACK ERROR :", error);
          res.status(500).end("Callback error");
        }
      }
  });
  