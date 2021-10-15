// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import prisma from "../../lib/prisma";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed'});

  try {
    const {user} = req.body;

    const savedUser = await prisma.user.create({
      data: user
    });
    res.status(200).json(savedUser);
  }
  catch ( err ){
    res.status(400).json({ message: 'Something went wrong'})
  }
}
