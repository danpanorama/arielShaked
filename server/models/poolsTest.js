const pool = require("./mysql2");


  const checkIfMaterialExist = (id,name) => {
    return pool.execute(
      `SELECT * FROM storematerials WHERE materialsourceid = ? AND materialname = ?`,
      [id,name]
    );
  };

  const insertNewMaterialToMytable = (materialname, materialimg, materialsourceid, materialproviderid
    , materialcoast,minimum,quantity,place,providername) => {
    return pool.execute(
      `INSERT INTO storematerials 
      (materialname, materialimg, materialsourceid,
         materialproviderid
        , materialcoast,minimum,quantity,place,providername
       ) 
      VALUES 
      (?,?,?,?,?,?,?,?,?)`,
      [materialname, materialimg, materialsourceid, materialproviderid
        , materialcoast,minimum,quantity,place,providername]
    ); 
  };

  const updateQuantityMaterialTable = (amount,id) => {
    return pool.execute(
      `
      UPDATE toshproject.storematerials 
    SET quantity =  ?
    WHERE materialid = ?
      `,
      [amount,id]
    );
  };



  const updateMinPlace = (min,id) => {
    return pool.execute(
      `
      UPDATE toshproject.storematerials 
    SET minimum =  ?
    WHERE materialid = ?
      `,
      [min,id]
    );
  };
  const updateQuantity = (min,id) => {
    return pool.execute(
      `
      UPDATE toshproject.storematerials 
    SET quantity =  ?
    WHERE materialid = ?
      `,
      [min,id]
    );
  };
  
  const getAllMyMaterials = () => {
    return pool.execute(`SELECT * FROM storematerials  `,);
  };

  const getExpensiveMaterial = () => {
    return pool.execute(`SELECT * FROM toshproject.storematerials order by - materialcoast `,);
  };

  const getCheepMaterial = () => {
    return pool.execute(`SELECT * FROM toshproject.storematerials order by materialcoast  `,);
  };
  const getAllMaterialsUnderQuantity = () => {
    return pool.execute(`SELECT * FROM toshproject.storematerials where quantity < minimum  `,);
  };
  const deleteoneMaterial = (id) => {
    return pool.execute(`DELETE  FROM storematerials WHERE materialid = ?  `,[id]);
  };

  const underMinimum = () => {
    return pool.execute(`  SELECT * FROM toshproject.storematerials where quantity <= 0 
    `,[]);
  };
  const almostDone = () => {
    return pool.execute(`   SELECT * FROM toshproject.storematerials where quantity <= minimum + 30;

    `,[]);
  };
  const selectMaterialLike = (text,text1,text2,text3) => {
    return pool.execute(`
    SELECT * FROM toshproject.storematerials 
    
   WHERE materialname Like CONCAT("%", ? , "%")
    or place Like CONCAT("%", ? , "%")
    or materialcoast Like CONCAT("%", ? , "%")
    or providername Like CONCAT("%", ? , "%")
    `,[text,text1,text2,text3]);
  };

  
  module.exports.getAllMaterialsUnderQuantity = getAllMaterialsUnderQuantity

  module.exports.deleteoneMaterial = deleteoneMaterial
  module.exports.getCheepMaterial = getCheepMaterial
  module.exports.getAllMyMaterials = getAllMyMaterials
  module.exports.updateMinPlace = updateMinPlace
  module.exports.selectMaterialLike = selectMaterialLike
  module.exports.updateQuantityMaterialTable = updateQuantityMaterialTable
  module.exports.getExpensiveMaterial = getExpensiveMaterial
  module.exports.insertNewMaterialToMytable = insertNewMaterialToMytable
  module.exports.checkIfMaterialExist = checkIfMaterialExist
  module.exports.underMinimum = underMinimum
  module.exports.almostDone = almostDone
  module.exports.updateQuantity = updateQuantity

  