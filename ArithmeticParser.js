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

        ap.primary = {
            match: function(code)
            {
                return ap.variable.match(code) || ap.number.match(code);
            },
            eval: function(environment)
            {
                return ap.variable.eval(environment) || ap.number.eval(environment);
            }
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

        ap.number = {
            match: function(code)
            {
                return code == '0' || /^[1-9][0-9]*$/.test(code);
            },
            eval: function(environment)
            {
                return parseInt(code);
            }
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