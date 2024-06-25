export const adminRequired = (req, res, next) => {
    const role = req.user.role
    //console.log(req.user)
    if(role === 'ADMIN'){
        console.log(role)
        next();
    } else {
        return res.send('No autorizado!')
    }
  };

  export default adminRequired;