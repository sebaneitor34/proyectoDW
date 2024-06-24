import producto from "../models/productos.model.js";
export const renderProductForm=(req,res)=>{
    res.render('addProduct')
};

export const createNewProduct=async (req,res)=>{
    const {productName,price,description,stock, image}=req.body;
    const newProducto=new producto({productName,price,description,stock, image})
    await newProducto.save();
    res.redirect('/')
}

export const renderProducts=async (req,res)=>{
const productos =await producto.find().lean();
res.render('homepage',{productos})
}

export const  renderEditForm=(req,res)=>{
 res.send('render edit form')
}

export const editProduct=(req,res)=>{
     res.send('edit product')
}


export const  renderAlbumPage=async (req,res)=>{
    const product=await  producto.findById(req.params.id).lean()
    res.render("albumPages",{product})
   }

   export const  deleteProduct=async (req,res)=>{
    const product=await producto.findByIdAndDelete(req.params.id).lean()
   res.redirect("/");
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
  
      const product = await Product.findById(productId).lean(); 
      if (!product) {
        req.flash("error_msg", "Producto no encontrado");
        return res.redirect("/"); 
      }
  
      res.render("albumPages", { product });
    } catch (error) {
      // ... manejo de errores ...
    }
  };
   
