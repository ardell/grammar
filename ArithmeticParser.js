var ArithmeticParser = {};
ArithmeticParser.create = function()
{

    var ap = Treetop.Parser.create();
    ap.rules = [
        ap.summable = function(code)
        {
            var summable = { code: code };

            if (!/\+/.test(summable.code))
            {
                summable.eval = function(environment)
                {
                    return ap.multiplicative(summable.code).eval(environment);
                }
                return summable;
            }

            // Find the plus sign and split the string
            var location = summable.code.indexOf('+');
            var before = summable.code.substring(0, location);
            var after = summable.code.substring(location + 1);

            var beforeResult = ap.multiplicative(before);
            var afterResult = ap.summable(after);
            if (!beforeResult || !afterResult)
            {
                return false;
            }

            summable.eval = function(environment)
            {
                return (beforeResult.eval(environment) + afterResult.eval(environment));
            }
            return summable;
        },

        ap.multiplicative = function(code)
        {
            var multiplicative = { code: code };

            if (!/\*/.test(code))
            {
                multiplicative.eval = function(environment)
                {
                    return ap.primary(multiplicative.code).eval(environment);
                }
                return multiplicative;
            }

            // Find the plus sign and split the string
            var location = multiplicative.code.indexOf('*');
            var before = multiplicative.code.substring(0, location);
            var after = multiplicative.code.substring(location + 1);

            var beforeResult = ap.primary(before);
            var afterResult = ap.multiplicative(after);
            if (!beforeResult || !afterResult)
            {
                return false;
            }

            multiplicative.eval = function(environment)
            {
                var a = beforeResult.eval(environment);
                var b = afterResult.eval(environment);
                return (a * b);
            }
            return multiplicative;
        },

        ap.primary = function(code)
        {
            var primary = { code: code };

            if (ap.variable(code))
            {
                primary.eval = function(environment)
                {
                    return ap.variable(primary.code).eval(environment);
                }
            } else if (ap.number(code)) {
                primary.eval = function(environment)
                {
                    return ap.number(primary.code).eval(environment);
                }
            } else {
                return false;
            }

            return primary;
        },

        ap.variable = function(code)
        {
            var variable = { code: code };

            var regex = /^[a-zA-Z]*$/;
            if (!regex.test(code))
            {
                return false;
            }

            variable.eval = function(environment)
            {
                return environment[variable.code];
            }
            return variable;
        },

        ap.number = function(code)
        {
            var number = { code: code };

            if (code != '0' && !/^[1-9][0-9]*$/.test(code))
            {
                return false;
            }

            number.eval = function(environment)
            {
                return parseInt(number.code);
            };
            return number;
        },

        ap.space = function(code, environment)
        {
            if (/^[\ ]*$/.test(code))
            {
                return true; // Should we be returning true here?
            }

            return false;
        }
    ];

    return ap;

}