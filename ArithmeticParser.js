var ArithmeticParser = {};
ArithmeticParser.create = function()
{

    var ap = Treetop.Parser.create();
    ap.rules = [
        ap.summable = function(code, environment)
        {
            if (!/\+/.test(code))
            {
                return ap.multiplicative(code, environment);
            }

            // Find the plus sign and split the string
            var location = code.indexOf('+');
            var before = code.substring(0, location);
            var after = code.substring(location + 1);

            return (ap.multiplicative(before, environment) + ap.summable(after, environment));
        },

        ap.multiplicative = function(code, environment)
        {
            if (!/\*/.test(code))
            {
                return ap.primary(code, environment);
            }

            // Find the plus sign and split the string
            var location = code.indexOf('*');
            var before = code.substring(0, location);
            var after = code.substring(location + 1);

            return (ap.primary(before, environment) * ap.multiplicative(after, environment));
        },

        ap.primary = function(code)
        {
            var type = null;

            if (ap.variable(code))
            {
                ap.primary.eval = function(environment)
                {
                    return ap.variable.eval(environment);
                };
            } else if (ap.number(code)) {
                ap.primary.eval = function(environment)
                {
                    return ap.number.eval(environment);
                };
            } else {
                return false;
            }

            return ap.primary;
        },

        ap.variable = function(code)
        {
            var regex = /^[a-zA-Z]*$/;
            if (!regex.test(code))
            {
                return false;
            }

            ap.variable.eval = function(environment)
            {
                return environment[code];
            }
            return ap.variable;
        },

        ap.number = function(code)
        {
            // ap.number should return either an instance
            // of ap.number or false, and should have eval
            // defined inside it.
            // Code should be accessible via closure
            // so that we can access it when we run eval
            ap.number.eval = function(environment)
            {
                return parseInt(code);
            };

            if (code == '0' || /^[1-9][0-9]*$/.test(code))
            {
                return ap.number;
            }
            return false;
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