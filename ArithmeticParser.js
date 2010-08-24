var ArithmeticParser = {};
ArithmeticParser.create = function()
{

    var ap = Treetop.Parser.create();
    ap.rules = [
        ap.arithmetic = function(code)
        {
            return ap.primary(code) ||
                ap.parenthesized(code) ||
                ap.multiplicative(code) ||
                ap.summable(code);
        },

        /**
         * A summable is a summation expression of
         * 1) primary / parenthesized / multiplicative
         * 2) additive_operator
         * 3) arithmetic
         */
        ap.summable = function(code)
        {
            var summable = { code: code };

            // var grammar = "(primary / parenthesized / multitive) + arithmetic";
            // var tree = ap.match(code, grammar);
            // return tree;

            // Find all the addition signs and what's before and after them
            summable.tokens = summable.code.tokenize('+');
            // Return the first one that's parseable
            for (var i in summable.tokens)
            {
                summable.token = summable.tokens[i];
                var beforeResult = ap.primary(summable.token.before) ||
                        ap.parenthesized(summable.token.before) ||
                        ap.multiplicative(summable.token.before);
                var afterResult = ap.arithmetic(summable.token.after);
                if (beforeResult && afterResult)
                {
                    summable.eval = function(environment)
                    {
                        var a = beforeResult.eval(environment);
                        var b = afterResult.eval(environment);
                        return a + b;
                    }
                    return summable;
                }
            }

            return false;
        },

        ap.multiplicative = function(code)
        {
            var multiplicative = { code: code };

            // Find all the multiplication signs and what's before and after them
            multiplicative.tokens = multiplicative.code.tokenize('*');
            // Return the first one that's parseable
            for (var i in multiplicative.tokens)
            {
                multiplicative.token = multiplicative.tokens[i];
                var beforeResult = ap.primary(multiplicative.token.before) ||
                        ap.parenthesized(multiplicative.token.before);
                var afterResult = ap.primary(multiplicative.token.after) ||
                        ap.parenthesized(multiplicative.token.after) ||
                        ap.multiplicative(multiplicative.token.after);
                if (beforeResult && afterResult)
                {
                    multiplicative.eval = function(environment)
                    {
                        var a = beforeResult.eval(environment);
                        var b = afterResult.eval(environment);
                        return (a * b);
                    }
                    return multiplicative;
                }
            }

            return false;
        },

        ap.parenthesized = function(code)
        {
            var parenthesized = { code: code };

            if (!/^\(.+\)$/.test(code))
            {
                return false;
            }

            parenthesized.eval = function(environment)
            {
                var unparenthesizedCode = parenthesized.code.substring(1, parenthesized.code.length - 1);
                var unparenthesizedArithmetic = ap.arithmetic(unparenthesizedCode);
                if (unparenthesizedArithmetic)
                {
                    return unparenthesizedArithmetic.eval(environment);
                }

                return false;
            }

            return parenthesized;
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

            var regex = /^[a-zA-Z]+$/;
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

String.prototype.tokenize = function(splitStr)
{
    var results = [];
    var currentIndex = 0;

    // Find all the indices of splits
    while(1)
    {
        currentIndex = this.indexOf(splitStr, currentIndex);
        if (!currentIndex || currentIndex < 0)
        {
            return results;
        }

        results.push({
            before: this.substring(0, currentIndex),
            after: this.substring(currentIndex + splitStr.length)
        });

        currentIndex += splitStr.length;
    }
}
