import cartModel from "../models/cart.model.js";
import productModel from "../models/productos.model.js";
import cartRelationModel from "../models/cartPerProduct.model.js";
import receiptModel from "../models/receipt.model.js";
import userModel from "../models/User.js";
import receiptUserModel from "../models/receiptUser.model.js";

export const renderRecibos = async (req, res) => {
  try {
    const user = req.user;
    console.log("Usuario autenticado:", user);

    const receiptUser = await receiptUserModel.findOne({ user: user._id }).populate({
      path: "receipt",
      populate: {
        path: "relations",
        populate: {
          path: "product",
        },
      },
    });

    if (!receiptUser) {
      console.log("Usuario no encontrado en receiptUserModel:", user._id);
      return res.status(404).send("Usuario no encontrado");
    }

    const receiptToRender = receiptUser.receipt.map((receipt) => ({
      total: receipt.total,
      createdAt: receipt.createdAt,
      products: receipt.relations.map((relation) => ({
        productName: relation.product.productName,
        quantity: relation.quantity,
        price: relation.product.price,
        image: relation.product.image,
      })),
    }));

    console.log("Recibos encontrados:", receiptToRender);

    res.render("recibos", { receiptToRender });
  } catch (error) {
    console.log("Error en renderRecibos:", error);
    res.status(500).send("Error del servidor");
  }
};

export const renderAllReceipts = async (req, res) => {
  try {
    const user = req.user;

    const receiptUser = await receiptUserModel.findOne({ user: user._id }).populate({
      path: "receipt",
      populate: {
        path: "relations",
        populate: {
          path: "product",
        },
      },
    });

    if (!receiptUser) {
      return res.status(404).send("Usuario no encontrado");
    }

    const bills = receiptUser.receipt.map((receipt) => ({
      id: receipt._id,
      createdAt: receipt.createdAt,
      total: receipt.total,
      quantityOfProducts: receipt.relations.length,
    }));

    res.json({ bills });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

export const renderReceiptDetail = async (req, res) => {
  try {
    const user = req.user;
    const receiptId = req.params.id;

    const receipt = await receiptModel.findById(receiptId).populate({
      path: "relations",
      populate: {
        path: "product",
      },
    });

    if (!receipt) {
      return res.status(404).send("Recibo no encontrado");
    }

    const receiptUser = await receiptUserModel.findOne({ user: user._id, receipt: receipt._id });

    if (!receiptUser) {
      return res.status(403).send("Acceso denegado");
    }

    const bill = {
      id: receipt._id,
      createdAt: receipt.createdAt,
      total: receipt.total,
      quantityOfProducts: receipt.relations.length,
      products: receipt.relations.map((relation) => ({
        id: relation.product._id,
        name: relation.product.productName,
        description: relation.product.description,
        price: relation.product.price,
        quantity: relation.quantity,
      })),
    };

    res.json({ bill });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

export const createReceipt = async (user) => {
  try {
    const cart = await cartModel.findOne({ user: user._id }).populate({
      path: "products",
      populate: { path: "product" },
    });

    if (!cart) {
      console.error("No se encontró ningún carrito para el usuario:", user._id);
      return null;
    }

    const productsReceipt = cart.products.map((relation) => ({
      _id: relation.product._id,
      quantity: relation.quantity,
      productName: relation.product.productName,
      price: relation.product.price,
      image: relation.product.image,
    }));

    const newReceipt = new receiptModel({
      relations: productsReceipt,
      total: cart.amount,
    });

    await newReceipt.save();
    console.log("Nuevo recibo creado:", newReceipt);

    let receiptUser = await receiptUserModel.findOne({ user: user._id });

    if (!receiptUser) {
      receiptUser = new receiptUserModel({
        user: user._id,
        receipt: [newReceipt._id],
      });
      await receiptUser.save();
      console.log("Nuevo usuario de recibo creado:", receiptUser);
    } else {
      receiptUser.receipt.push(newReceipt._id);
      await receiptUser.save();
      console.log("Recibo añadido al usuario existente:", receiptUser);
    }
  } catch (error) {
    console.log("Error al crear recibo:", error);
  }
};

export const comprar = async (req, res) => {
  try {
    const user = req.user;
    const cart = await cartModel.findOne({ user: user._id });

    if (!cart) {
      console.error("No se encontró el carrito para el usuario:", user._id);
      return res.status(404).send("Carrito no encontrado");
    }

    if (cart.amount > user.wallet) {
      console.log("Saldo insuficiente para el usuario:", user._id);
      return res.send("Saldo insuficiente");
    }

    await createReceipt(user);

    user.wallet -= cart.amount;
    await user.save();

    await cartModel.findByIdAndDelete(cart._id);
    console.log("Compra completada para el usuario:", user._id);

    res.redirect("/Carrito");
  } catch (error) {
    console.log("Error al realizar la compra:", error);
    res.status(500).send("Error del servidor");
  }
};

export const renderCart = async (req, res) => {
  try {
    const user = req.user;

    // Encontrar el carrito del usuario y hacer populate de los productos
    const cart = await cartModel
      .findOne({ user: user })
      .populate({
        path: "products",
        populate: { path: "product" }, // Populate del campo product en cartRelationModel
      })
      .exec();

    if (!cart) {
      // Si no hay carrito, crear uno nuevo
      const newCart = new cartModel({ user: user });
      await newCart.save();
      res.render("Carrito", { productsToRender: [] });
      return;
    }

    const productsToRender = cart.products.map((relation) => ({
      _id: relation.product._id,
      quantity: relation.quantity,
      productName: relation.product.productName,
      price: relation.product.price,
      image: relation.product.image,
    }));
    res.render("Carrito", { productsToRender, amount: cart.amount });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al renderizar el carrito");
  }
};

// Añadir producto a CART
export const addCart = async (req, res) => {
  try {
    const user = req.user;
    const idProduct = req.params.id;

    const cart = await cartModel.findOne({ user: user._id });

    const product = await productModel.findById(idProduct);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    if (!cart) {
      const newRelation = new cartRelationModel({
        product: product,
        quantity: 1,
      });
      await newRelation.save();

      const newCart = new cartModel({
        user: user._id,
        products: [newRelation._id],
        amount: product.price,
      });
      await newCart.save();
    } else {
      const existingRelation = await cartRelationModel.findOne({
        product: idProduct,
        _id: { $in: cart.products },
      });

      if (existingRelation) {
        existingRelation.quantity += 1;
        cart.amount += product.price;
        await cart.save();
        await existingRelation.save();
      } else {
        const newRelation = new cartRelationModel({
          product: product,
          quantity: 1,
        });
        await newRelation.save();
        cart.products.push(newRelation._id);
        cart.amount += product.price;
        await cart.save();
      }
    }

    res.redirect("/Carrito");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al añadir el producto al carrito");
  }
};

export const removeCart = async (req, res) => {
  try {
    const user = req.user;
    const idProduct = req.params.id;

    const cart = await cartModel.findOne({ user: user._id });
    const product = await productModel.findById(idProduct);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    if (!cart) {
      const newRelation = new cartRelationModel({
        product: product,
        quantity: 1,
      });
      await newRelation.save();

      const newCart = new cartModel({
        user: user._id,
        products: [newRelation._id],
      });
      await newCart.save();
    } else {
      const existingRelation = await cartRelationModel.findOne({
        product: idProduct,
        _id: { $in: cart.products },
      });

      if (existingRelation) {
        existingRelation.quantity -= 1;
        cart.amount -= product.price;
        await cart.save();
        await existingRelation.save();
      } else {
        const newRelation = new cartRelationModel({
          product: product,
          quantity: 1,
        });
        await newRelation.save();
        cart.products.push(newRelation._id);
        await cart.save();
      }
      if (existingRelation.quantity < 1) {
        await cartRelationModel.findByIdAndDelete(existingRelation.id);
      }
    }

    res.redirect("/Carrito");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al añadir el producto al carrito");
  }
};
