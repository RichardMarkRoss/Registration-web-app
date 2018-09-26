let assert = require('assert');
let data = require('../reg-database-function');
const pg = require('pg');
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/plates_held';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});
const theRegFunction = data(pool);

describe('testing the database functionality', function () {
    beforeEach(async function () {
        await pool.query('delete from number_plates');
    });
    it('test the storing of values in the database if a registration plate is inserted', async function () {
        await theRegFunction.filterReg('CA 123-123');
        await theRegFunction.filterReg('CA 321-321');
        let list = await theRegFunction.regResults();
        let car = list.map(listed => listed.plates);
        assert.deepEqual(['CA 321-321', 'CA 123-123'], car);
    });
    it('test the filtering of the registration in the database', async function () {
        await theRegFunction.filterReg('CA 123-123');
        await theRegFunction.filterReg('CY 123-123');
        await theRegFunction.filterReg('CJ 123-123');
        assert.deepEqual(await theRegFunction.regCheckList('CA'), [{
            towns_names: 'CA',
            plates: 'CA 123-123'
        }]);
    });
    it('check if the value in the table already exist', async function () {
        await theRegFunction.filterReg('CA 123-123');
        await theRegFunction.filterReg('CJ 123-123');
        const value = await theRegFunction.checkIfSame('CA 123-123');
        assert.deepEqual(value, [{
            id: 6,
            plates: 'CA 123-123',
            towns_id: 1
        }]);
    })
    it('should clear the database when the function is running', async function () {
        await theRegFunction.filterReg('CA 123-123');
        await theRegFunction.filterReg('CJ 123-123');
        await theRegFunction.filterReg('CL 123-123');
        const deleted = await theRegFunction.clearDataBase();
        assert.strictEqual(undefined, deleted);
    });
    after(function () {
        pool.end();
    });
});