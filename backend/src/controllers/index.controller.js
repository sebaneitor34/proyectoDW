import producto from "../models/productos.model.js";
export const renderIndex = async (req, res) => {
  const productos =await producto.find().lean();
    res.render("homepage", {productos});
  };

  