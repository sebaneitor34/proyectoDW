import producto from "../models/productos.model.js";

export const renderProductForm = (req, res) => {
  res.render('addProduct');
};

export const createNewProduct = async (req, res) => {
  const { productName, price, description, stock, image } = req.body;
  const newProducto = new producto({ productName, price, description, stock, image });
  await newProducto.save();
  res.redirect('/');
};

export const renderProducts = async (req, res) => {
  const productos = await producto.find().lean();
  res.render('homepage', { productos });
};

import Producto from "../models/productos.model.js";

export const renderEditForm = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).lean();
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("editProduct", { producto });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

export const editProduct = async (req, res) => {
  try {
    const { productName, price, description, stock, image } = req.body;
    const productId = req.params.id;
  
    // Validación de datos (opcional, pero recomendada)
  
    await Producto.findByIdAndUpdate(productId, { 
      productName, 
      price, 
      description, 
      stock, 
      image 
    }).lean();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error al actualizar el producto');
    res.redirect('/editProduct'); // Redirige de vuelta al formulario en caso de error
  }
};


export const  renderCamisetas=async (req,res)=>{
    const product=await  producto.findById(req.params.id).lean()
    res.render("Camisetas",{product})
   }

   export const  deleteProduct=async (req,res)=>{
    const product=await producto.findByIdAndDelete(req.params.id).lean()
    res.redirect('/');
   }   
   
   export const renderProductDetails = async (req, res) => {
    try {
      const productId = req.params.productId; // Obtén el ID del producto de los parámetros de la ruta
      console.log("productId:", productId); // Imprime el ID para depurar
  
      // Verificar si el productId es un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        req.flash("error_msg", "ID de producto no válido");
        return res.redirect("/"); // Redirigir a la página principal o de error
      }
  
      const product = await producto.findById(productId).lean(); 
      if (!product) {
        req.flash("error_msg", "Producto no encontrado");
        return res.redirect("/"); 
      }
  
      res.render("Camisetas", { product });
    } catch (error) {
      // ... manejo de errores ...
    }
  };
   
