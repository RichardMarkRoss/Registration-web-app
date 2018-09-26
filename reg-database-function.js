module.exports = function (pool) {
    async function regSelectPlates () {
        const regSelect = await pool.query('select * from towns;');
        return regSelect.rows;
    }
    async function filterReg (plate) {
        // function inserts and filter the plates to match the first tables values
        let reg = plate;
        let splittingReg = reg.split(' ');
        const regNumberStart = splittingReg[0];
        const townData = await pool.query('select * from towns where towns_names = $1', [regNumberStart]);
        const townId = townData.rows[0].id;
        await pool.query('insert into number_plates (plates, towns_id) values ($1, $2)', [reg, townId]);
    }
    async function checkIfSame (plate) {
        const platesCheck = await pool.query('select * from number_plates where plates = $1', [plate]);
        return platesCheck.rows;
    }
    async function regResults (plates) {
        const Result = await pool.query('SELECT plates FROM number_plates GROUP BY plates HAVING COUNT(*) > 0 ');
        return Result.rows;
    }
    async function clearDataBase () {
        await pool.query('delete from number_plates');
        await pool.query('alter sequence number_plates_id_seq restart 1');
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
        regCheckList,
        checkIfSame
    };
};
