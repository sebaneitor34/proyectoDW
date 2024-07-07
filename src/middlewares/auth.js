import jwt from 'jsonwebtoken';

export default function authRequired(req, res, next) {
  const token = req.cookies ? req.cookies.token : null;
  console.log('Token recibido:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).render('error', { message: 'Acceso denegado. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    req.user = decoded;
    next();
  } catch (ex) {
    console.error('Error verificando el token:', ex); // Capturar detalles del error
    res.status(400).render('error', { message: 'Token inválido.' });
  }
}

