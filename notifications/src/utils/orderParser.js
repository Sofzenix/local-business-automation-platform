// const menuItems = [
//   "idli",
//   "dosa",
//   "vada",
//   "poha",
//   "upma",
//   "uttapam",
//   "paratha",
// ];

// exports.parseOrder = (text) => {
//   if (!text) return null;

//   const lowerText = text.toLowerCase();

//   const items = [];

//   menuItems.forEach((item) => {
//     // regex matches:
//     // 2 idli
//     // 2idli
//     // 2 idli,
//     // 2 idli 3 dosa
//     const regex = new RegExp(`(\\d+)\\s*${item}`, "g");

//     let match;

//     while ((match = regex.exec(lowerText)) !== null) {
//       items.push({
//         name: item,
//         quantity: parseInt(match[1]),
//       });
//     }
//   });

//   return items.length ? items : null;
// };















const ProductMenu = require("../models/ProductMenu");

exports.parseOrder = async (text) => {

  if (!text) return null;

  const lowerText = text.toLowerCase();

  const items = [];

  // Fetch menu dynamically from DB
  const menuItems = await ProductMenu.find({ isAvailable: true });

  menuItems.forEach((menuItem) => {

    const itemName = menuItem.itemName.toLowerCase();

    // regex matches:
    // 2 idli
    // 2idli
    // 2 masala dosa
    // 2 masaladosa
    const regex = new RegExp(`(\\d+)\\s*${itemName}`, "g");

    let match;

    while ((match = regex.exec(lowerText)) !== null) {

      items.push({
        name: menuItem.itemName,
        quantity: parseInt(match[1])
      });

    }

  });

  return items.length ? items : null;
};