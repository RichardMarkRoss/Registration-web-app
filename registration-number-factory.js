module.exports = function (regDataFun) {

    function isValid (regNumber) {
        return regNumber.startsWith('CJ') ||
           regNumber.startsWith('CA') ||
           regNumber.startsWith('CY') ||
           regNumber.startsWith('CL') ||
           regNumber.startsWith('CAW');
    }

    function storingRegNumber (regNumber) {
        if (isValid(regNumber)) {
            return regNumber;
        }
    }
    return {
        isValid,
        storingRegNumber
    };

};
