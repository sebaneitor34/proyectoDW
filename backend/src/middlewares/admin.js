export default function adminRequired(req, res, next) {
  console.log('Usuario recibido:', req.user);
  if (req.user && req.user.role === 'ADMIN') {
    console.log('Acceso de administrador concedido:', req.user);
    return next();
  }
  console.error('Acceso denegado. Usuario:', req.user); // Capturar detalles del usuario
  req.flash('error_msg', 'Acceso denegado. Se requiere rol de administrador.');
  return res.redirect('/unauthorized');
}
