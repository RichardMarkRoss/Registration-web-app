module.exports = function (registrationFactory, regDataFun) {
    async function index (req, res) {
        res.render('home', {});
    }

    async function home (req, res, next) {
        const plate = req.body.searching;
        try {
            await regDataFun.filterReg(plate);
            const regList = await regDataFun.regResults();
            res.render('home', {
                regList
            });
        } catch (err) {
            next(err);
        }
    }
    async function reset (req, res) {
        let deleteDataBase = await regDataFun.clearDataBase();
        res.render('home', {
            deleteDataBase
        });
    }
    async function filter (req, res, next) {
        // const urltype = req.params.type;
        try {
            let filtering = await regDataFun.regCheckList();
            res.render('home', {
                filtering
            });
        } catch (err) {
            next(err);
        }
    }

    return {
        index,
        home,
        reset,
        filter
    };
};
