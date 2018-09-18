module.exports = function (pool) {
    async function regSelectPlates () {
        const regSelect = await pool.query('select * from towns;');
        return regSelect.rows;
    }
    async function filterReg (plate) {
        let reg = plate;
        let splittingReg = reg.split(' ');
        const regNumberStart = splittingReg[0];
        const townData = await pool.query('select * from towns where towns_names = $1', [regNumberStart]);
        const townId = townData.rows[0].id;
        await pool.query('insert into number_plates (plates, towns_id) values ($1, $2)', [reg, townId]);
    }
    async function regResults () {
        const Result = await pool.query('select plates from number_plates');
        return Result.rows;
    }
    async function clearDataBase () {
        await pool.query('delete from number_plates;');
    }
    async function regCheckList (plate) {
        const listReg = await pool.query('select towns_names, plates from towns join number_plates on towns.id = number_plates.towns_id where towns_names = $1 ', [plate]);
        return listReg.rows;
    }

    return {
        regSelectPlates,
        filterReg,
        clearDataBase,
        regResults,
        regCheckList
    };
};
