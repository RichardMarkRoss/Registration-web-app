module.exports = function (registrationFactory, regDataFun) {
    async function index (req, res) {
        const regList = await regDataFun.regResults();
        res.render('home', {
            regList
        });
    }

    async function home (req, res, next) {
        const plate = req.body.searching;
        try {
            if (plate !== undefined) {
                await regDataFun.filterReg(plate);
                const regList = await regDataFun.regResults();
                res.render('home', {
                    regList
                });
            } else {
                req.flash('error', 'please insert registration number!');
                res.redirect('/');
            }
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
        try {
            const list = req.body.list;
            let regList = await regDataFun.regCheckList(list);
            res.render('home', {
                regList,
                list
            });
        } catch (err) {
            res.send(err);
        }
    }

    return {
        index,
        home,
        reset,
        filter
    };
};
