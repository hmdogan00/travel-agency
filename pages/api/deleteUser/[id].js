// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if ( req.method !== 'DELETE' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  /*let {id} = req.query;
  id = parseInt(id)
  if (!id){
    res.status(423).json({message: 'No id found!'})
    return;
  }
  try {
    const user = await prisma.user.delete({
      where: {id}
    });
    res.status(200).json(user);
  }
  catch ( err ){
    res.status(200).json({ message: err, messageType: 'ERROR'})
  }*/
}