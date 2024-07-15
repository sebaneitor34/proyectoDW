// src/controllers/auth.controller.js
import User from "../models/User.js";
import passport from "passport";
import jwt from 'jsonwebtoken';

// Renderizar formulario de registro
export const renderSignUpForm = (req, res) => res.render("signup");

// Renderizar cuenta del usuario
export const renderCuenta = (req, res) => {
  const user = req.user;
  res.render("Cuenta", { wallet: user.wallet });
};

// Registrar un nuevo usuario
export const signup = async (req, res) => {
  try {
    let errors = [];
    const { name, lastName, email, password, confirm_password, address, birthday, role } = req.body;

    if (password !== confirm_password) {
      errors.push({ text: "Passwords do not match." });
    }

    if (password.length < 4) {
      errors.push({ text: "Passwords must be at least 4 characters." });
    }

    if (errors.length > 0) {
      return res.render("signup", {
        errors,
        name,
        lastName,
        email,
        password,
        confirm_password,
        address,
        birthday,
        role // Include role in case of errors
      });
    }

    // Buscar coincidencia de email
    const userFound = await User.findOne({ email: email });
    if (userFound) {
      req.flash("error_msg", "The Email is already in use.");
      return res.redirect("/signup");
    }

    // Guardar un nuevo usuario
    const newUser = new User({ name, lastName, email, password, address, birthday, role });
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();

    // Generar token JWT
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

    req.flash("success_msg", "You are registered.");
    res.redirect("login");
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
};

// Renderizar formulario de inicio de sesión
export const renderSigninForm = (req, res) => res.render("login");

// Iniciar sesión del usuario
export const signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error de autenticación:', err);
      req.flash('error_msg', 'Ocurrió un error inesperado durante la autenticación.');
      return res.redirect('/login');
    }
    if (!user) {
      req.flash('error_msg', info.message || 'Credenciales inválidas.');
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Error al iniciar sesión:', err);
        req.flash('error_msg', 'Ocurrió un error inesperado durante la autenticación.');
        return res.redirect('/login');
      } else {
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generado:', token);
        res.cookie('token', token, { httpOnly: true });
        return res.redirect('/');
      }
    });
  })(req, res, next);
};

// Cerrar sesión del usuario
export const logout = async (req, res, next) => {
  await req.logout((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return next(err);
    }
    res.clearCookie('token');
    req.flash("success_msg", "You are logged out now.");
    res.redirect("/login");
  });
};

// Renderizar el saldo de la billetera del usuario
export const renderWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('Usuario no encontrado:', req.user.id);
      req.flash('error_msg', 'Usuario no encontrado.');
      return res.redirect('/Cuenta');
    }
    const walletBalance = user.wallet;
    res.render('wallet', { walletBalance });
  } catch (error) {
    console.error('Error al obtener el saldo de la billetera:', error);
    res.status(500).send('Error en el servidor');
  }
};

// Agregar saldo a la billetera del usuario
export const addWallet = async (req, res) => {
  try {
    const { wallet } = req.body;
    const user = req.user;
    user.wallet += parseFloat(wallet);
    await user.save();
    res.redirect("/Cuenta");
  } catch (error) {
    console.error('Error al agregar saldo a la billetera:', error);
    res.status(500).send('Error en el servidor');
  }
};

