import User from "../models/User.js";
import passport from "passport";
import jwt from 'jsonwebtoken';

export const renderSignUpForm = (req, res) => res.render("signup");

export const renderCuenta = (req, res) => {
  const user = req.user;
  res.render("Cuenta",{wallet: user.wallet});
};

export const signup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password, role= 'USER' } = req.body;
  if (password !== confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }

  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }

  if (errors.length > 0) {
    return res.render("/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  }

  // Look for email coincidence
  const userFound = await User.findOne({ email: email });
  if (userFound) {
    req.flash("error_msg", "The Email is already in use.");
    return res.redirect("/signup");
  }

  // Saving a New User
  const newUser = new User({ name, email, password });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();
  req.flash("success_msg", "You are registered.");
  res.redirect("login");
};

export const renderSigninForm = (req, res) => res.render("login");

export const signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // Manejo de errores generales de autenticación
      console.error('Error de autenticación:', err); // Registra el error para depuración
      req.flash('error_msg', 'Ocurrió un error inesperado durante la autenticación.');
      return res.redirect('/login');
    }
    if (!user) {
      // Manejo de credenciales inválidas u otros errores de autenticación
      req.flash('error_msg', info.message || 'Credenciales inválidas.'); // Muestra el mensaje de error si existe
      return res.redirect('/login');
    }

    // Autenticación exitosa
    req.logIn(user, (err) => {
      if (err) {
        // ... (manejo de errores) ...
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token);
        res.cookie('token', token, { httpOnly: true }); // Establecer la cookie antes de redirigir
        return res.redirect('/'); // Redirigir después de establecer la cookie
      }
    });
    
  })(req, res, next);
};


export const logout = async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "You are logged out now.");
    res.redirect("/login");
  });
};

export const renderWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Obtén el usuario autenticado
    const walletBalance = user.wallet; // Obtén el saldo de la wallet del usuario

    res.render('wallet', { walletBalance }); // Pasa el saldo a la vista
  } catch (error) {
    // ... manejo de errores ...
  }
};


export const addWallet = async (req, res) => {
  const { wallet } = req.body;
  const walletNumeber=wallet;
  const user = req.user;
user.wallet=walletNumeber+user.wallet;
user.save();
res.redirect("/Cuenta");
};