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

        ap.primary = function(code, environment)
        {
            return ap.variable(code, environment) || ap.number(code, environment);
        },

        ap.variable = function(code, environment)
        {
            var regex = /^[a-zA-Z]*$/;
            if (regex.test(code))
            {
                return environment[code];
            }

            return false;
        },

        ap.number = function(code, environment)
        {
            if (/^[1-9][0-9]*$/.test(code) || code == '0')
            {
                return parseInt(code);
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